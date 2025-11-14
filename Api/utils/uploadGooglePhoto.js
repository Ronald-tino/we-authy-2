import axios from "axios";
import { cloudinary } from "../server.js";
import { Readable } from "stream";

/**
 * Downloads a Google profile photo and uploads it to Cloudinary
 * @param {string} googlePhotoUrl - The Google profile photo URL (e.g., from lh3.googleusercontent.com)
 * @param {string} userId - User ID to use as filename in Cloudinary
 * @returns {Promise<string>} - Cloudinary URL or null if upload fails
 */
export const uploadGooglePhotoToCloudinary = async (googlePhotoUrl, userId) => {
  try {
    // Validate that this is actually a Google photo URL
    if (!googlePhotoUrl || !googlePhotoUrl.includes("googleusercontent.com")) {
      console.log("Not a Google photo URL, skipping upload");
      return null;
    }

    console.log(`📸 Uploading Google photo to Cloudinary for user: ${userId}`);

    // Download the image from Google with timeout
    const response = await axios.get(googlePhotoUrl, {
      responseType: "arraybuffer",
      timeout: 10000, // 10 second timeout
      headers: {
        "User-Agent": "Mozilla/5.0", // Some services require a user agent
      },
    });

    // Convert buffer to stream for Cloudinary upload
    const buffer = Buffer.from(response.data);

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile-photos",
          public_id: `user_${userId}_${Date.now()}`,
          resource_type: "image",
          overwrite: true,
          transformation: [
            { width: 400, height: 400, crop: "fill", gravity: "face" },
            { quality: "auto", fetch_format: "auto" },
          ],
        },
        (error, result) => {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );

      // Create a readable stream from the buffer and pipe to Cloudinary
      const readableStream = Readable.from(buffer);
      readableStream.pipe(uploadStream);
    });

    console.log(`✅ Successfully uploaded photo to Cloudinary: ${uploadResult.secure_url}`);
    return uploadResult.secure_url;
  } catch (error) {
    console.error("❌ Error uploading Google photo to Cloudinary:", error.message);
    
    // Log specific error types for debugging
    if (error.code === "ECONNABORTED" || error.code === "ETIMEDOUT") {
      console.error("Timeout while fetching Google photo");
    } else if (error.response?.status === 429) {
      console.error("Google rate limit exceeded (429)");
    } else if (error.response?.status === 403 || error.response?.status === 401) {
      console.error("Access forbidden to Google photo");
    }
    
    // Return null to allow fallback handling
    return null;
  }
};

/**
 * Check if a URL is a Google profile photo URL
 * @param {string} url - The URL to check
 * @returns {boolean}
 */
export const isGooglePhotoUrl = (url) => {
  return url && typeof url === "string" && url.includes("googleusercontent.com");
};






