import axios from "axios";
import newRequest from "./newRequest";

/**
 * Sleep utility for retry delays
 */
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Validate file before upload
 */
const validateFile = (file) => {
  if (!file) {
    throw new Error("No file provided");
  }

  // Check file type
  const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
  if (!allowedTypes.includes(file.type)) {
    throw new Error("Invalid file type. Please upload a JPEG, PNG, GIF, or WebP image.");
  }

  // Check file size (max 5MB)
  const maxSize = 5 * 1024 * 1024; // 5MB
  if (file.size > maxSize) {
    throw new Error("File too large. Maximum size is 5MB.");
  }

  return true;
};

/**
 * Upload to Cloudinary (client-side)
 * Includes retry logic with exponential backoff
 */
const uploadToCloudinary = async (file, retries = 3) => {
  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", "lugshare");

  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      console.log(`📤 Attempting Cloudinary upload (attempt ${attempt}/${retries})...`);
      
      const res = await axios.post(
        "https://api.cloudinary.com/v1_1/dzmrfifoq/image/upload",
        data,
        {
          timeout: 30000, // 30 second timeout
          headers: {
            'Content-Type': 'multipart/form-data',
          },
          onUploadProgress: (progressEvent) => {
            const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            console.log(`Upload progress: ${percentCompleted}%`);
          },
        }
      );

      if (res.data?.secure_url) {
        console.log("✅ Cloudinary upload successful!");
        return res.data.secure_url;
      } else {
        throw new Error("Invalid response from Cloudinary");
      }
    } catch (err) {
      console.error(`❌ Cloudinary upload attempt ${attempt} failed:`, err.message);
      
      // Don't retry on validation errors (4xx)
      if (err.response?.status >= 400 && err.response?.status < 500) {
        throw new Error(`Upload failed: ${err.response?.data?.error?.message || err.message}`);
      }
      
      // If this was the last attempt, throw error
      if (attempt === retries) {
        throw new Error(`Upload failed after ${retries} attempts: ${err.message}`);
      }
      
      // Exponential backoff: wait longer between each retry
      const delay = Math.min(1000 * Math.pow(2, attempt - 1), 5000); // Max 5 seconds
      console.log(`⏳ Retrying in ${delay}ms...`);
      await sleep(delay);
    }
  }
};

/**
 * Upload to server (fallback when client-side fails)
 */
const uploadToServer = async (file) => {
  try {
    console.log("📤 Attempting server-side upload...");
    
    const data = new FormData();
    data.append("file", file);

    const res = await newRequest.post("/auth/upload-profile-image", data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      timeout: 30000, // 30 second timeout
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
        console.log(`Server upload progress: ${percentCompleted}%`);
      },
    });

    if (res.data?.url) {
      console.log("✅ Server-side upload successful!");
      return res.data.url;
    } else {
      throw new Error("Invalid response from server");
    }
  } catch (err) {
    console.error("❌ Server-side upload failed:", err.message);
    throw new Error(`Server upload failed: ${err.response?.data?.message || err.message}`);
  }
};

/**
 * Main upload function with client-side attempt and server-side fallback
 */
const upload = async (file) => {
  try {
    // Validate file first
    validateFile(file);

    // Try client-side upload first (with retries)
    try {
      return await uploadToCloudinary(file, 3);
    } catch (clientError) {
      console.warn("⚠️ Client-side upload failed, trying server-side fallback...");
      console.error("Client error:", clientError.message);
      
      // Fallback to server-side upload
      try {
        return await uploadToServer(file);
      } catch (serverError) {
        console.error("❌ Both client and server uploads failed");
        
        // Throw a user-friendly error
        throw new Error(
          "Failed to upload image. Please check your internet connection and try again. " +
          "If the problem persists, try using a smaller image."
        );
      }
    }
  } catch (err) {
    console.error("❌ Upload error:", err);
    // Re-throw with user-friendly message
    throw err;
  }
};

export default upload;
