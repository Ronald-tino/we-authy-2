import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { uploadGooglePhotoToCloudinary, isGooglePhotoUrl } from "../utils/uploadGooglePhoto.js";
import admin from "firebase-admin";

////////////////////////////////////////////////////////
export const register = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 10); // Secure hash rounds
    const newUser = new User({
      ...req.body,
      username: req.body.username.trim().toLowerCase(),
      password: hash,
    });
    await newUser.save();

    // Auto-login after registration
    const token = jwt.sign(
      {
        id: newUser._id,
        isSeller: newUser.isSeller,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );

    const { password, ...info } = newUser._doc;
    const cookieOptions =
      process.env.NODE_ENV === "production"
        ? { httpOnly: true, sameSite: "none", secure: true }
        : { httpOnly: true };

    res.cookie("accessToken", token, cookieOptions).status(201).send({ info });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { username, password } = req.body || {};
    // Basic input validation
    if (
      !username ||
      !password ||
      typeof username !== "string" ||
      typeof password !== "string"
    ) {
      return next(createError(400, "Username and password are required"));
    }

    const trimmedUsername = username.trim().toLowerCase();
    const user = await User.findOne({ username: trimmedUsername });
    // Use generic error messages to avoid leaking which field was wrong
    if (!user) return next(createError(401, "Invalid username or password"));

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return next(createError(401, "Invalid username or password"));
    }
    //////////////////////////////////////////////////////
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET,
      { expiresIn: "7d" } // Token expires in 7 days
    );
    //////////////////////////////////////////////////////
    const { password: _password, ...info } = user._doc;
    const cookieOptions =
      process.env.NODE_ENV === "production"
        ? { httpOnly: true, sameSite: "none", secure: true }
        : { httpOnly: true };

    res.cookie("accessToken", token, cookieOptions).status(200).send({ info });
    //////////////////////////////////////////////////////
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  const clearOptions =
    process.env.NODE_ENV === "production"
      ? { sameSite: "none", secure: true }
      : undefined;

  res
    .clearCookie("accessToken", clearOptions)
    .status(200)
    .send("User has been logged out");
};

/**
 * Check if username is available
 * This endpoint should be called BEFORE creating a Firebase account
 */
export const checkUsernameAvailability = async (req, res, next) => {
  try {
    const { username } = req.body;

    if (!username || typeof username !== "string") {
      return next(createError(400, "Username is required"));
    }

    const normalizedUsername = username.trim().toLowerCase();

    if (normalizedUsername.length < 3) {
      return next(createError(400, "Username must be at least 3 characters"));
    }

    if (normalizedUsername.length > 20) {
      return next(createError(400, "Username must be at most 20 characters"));
    }

    // Check if username exists
    const existingUser = await User.findOne({ username: normalizedUsername });

    if (existingUser) {
      return res.status(200).json({
        available: false,
        message: "Username is already taken",
      });
    }

    return res.status(200).json({
      available: true,
      message: "Username is available",
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Check if a user exists in MongoDB and if their profile is complete
 * This endpoint is used during sign-in to determine routing
 */
export const checkUserExists = async (req, res, next) => {
  try {
    const { firebaseUid } = req.body;

    if (!firebaseUid || typeof firebaseUid !== "string") {
      return next(createError(400, "Firebase UID is required"));
    }

    // Check if user exists in MongoDB
    const user = await User.findOne({ firebaseUid });

    if (!user) {
      return res.status(200).json({
        exists: false,
        profileComplete: false,
        message: "User not found in database",
      });
    }

    // Check if profile is complete (username and country are required)
    const profileComplete =
      user.username &&
      user.username !== "" &&
      !user.username.includes("_") && // Temp usernames have underscores
      user.country &&
      user.country !== "Not specified";

    return res.status(200).json({
      exists: true,
      profileComplete,
      user: profileComplete ? {
        _id: user._id,
        username: user.username,
        email: user.email,
        img: user.img,
        country: user.country,
        isSeller: user.isSeller,
      } : null,
    });
  } catch (err) {
    next(err);
  }
};

/**
 * Helper function to delete a Firebase user
 * Used for cleanup when MongoDB user creation fails
 */
const deleteFirebaseUser = async (firebaseUid) => {
  try {
    if (!firebaseUid) {
      console.error("❌ Cannot delete Firebase user: UID is missing");
      return false;
    }

    await admin.auth().deleteUser(firebaseUid);
    console.log(`✅ Successfully deleted Firebase user: ${firebaseUid}`);
    return true;
  } catch (error) {
    // If user already deleted, that's fine - mission accomplished
    if (error.code === 'auth/user-not-found') {
      console.log(`ℹ️ Firebase user ${firebaseUid} already deleted (cleanup already ran)`);
      return true;
    }
    
    console.error(`❌ Failed to delete Firebase user ${firebaseUid}:`, error.message);
    return false;
  }
};

/**
 * Create or update MongoDB user after Firebase authentication
 * This endpoint is called after successful Firebase auth to sync/create user in MongoDB
 */
export const syncFirebaseUser = async (req, res, next) => {
  try {
    const {
      firebaseUid,
      email,
      username,
      img,
      country,
      phone,
      desc,
      isSeller,
    } = req.body;

    if (!firebaseUid || !email) {
      return next(createError(400, "Firebase UID and email are required"));
    }

    // Upload Google photo to Cloudinary if provided
    let processedImg = img;
    if (isGooglePhotoUrl(img)) {
      console.log("🔄 Detected Google photo URL, uploading to Cloudinary...");
      const cloudinaryUrl = await uploadGooglePhotoToCloudinary(img, firebaseUid);
      if (cloudinaryUrl) {
        processedImg = cloudinaryUrl;
        console.log("✅ Google photo uploaded to Cloudinary successfully");
      } else {
        console.log("⚠️ Failed to upload to Cloudinary, using original URL");
        // Keep original Google URL as fallback
      }
    }

    // Check if user already exists by firebaseUid
    let user = await User.findOne({ firebaseUid });
    let isNewUser = false;

    if (user) {
      // Update existing user if new data provided
      if (username && username !== user.username) {
        // Check if username is already taken by another user
        const usernameExists = await User.findOne({
          username: username.trim().toLowerCase(),
          _id: { $ne: user._id },
        });
        if (usernameExists) {
          return next(createError(400, "Username already taken"));
        }
        user.username = username.trim().toLowerCase();
      }
      if (processedImg !== undefined) user.img = processedImg;
      if (country && country !== "Not specified") user.country = country;
      if (phone !== undefined) user.phone = phone;
      if (desc !== undefined) user.desc = desc;
      if (isSeller !== undefined) user.isSeller = isSeller;

      // Update email if changed in Firebase
      if (email !== user.email) {
        // Check if new email is already used by another user
        const emailExists = await User.findOne({
          email,
          _id: { $ne: user._id },
        });
        if (emailExists) {
          return next(createError(400, "Email already registered"));
        }
        user.email = email;
      }

      await user.save();
    } else {
      // User does not exist in MongoDB
      // Only create if username AND country are provided (full registration)
      if (!username || !country || country === "Not specified") {
        // User is trying to sign in without completing registration
        return next(createError(404, "User not found. Please complete registration first."));
      }

      // Full registration with username/country provided
      isNewUser = true;
      
      // Create new user - let MongoDB's unique constraints handle duplicates
      const newUser = new User({
        username: username.trim().toLowerCase(),
        email,
        firebaseUid,
        img: processedImg || "",
        country,
        phone: phone || "",
        desc: desc || "",
        isSeller: isSeller || false,
        password: "", // No password needed - Firebase handles auth
      });

      // Try to save - if duplicate exists, catch block will handle cleanup
      await newUser.save();
      user = newUser;
    }

    const { password, ...info } = user._doc;

    // Check if profile is complete
    const profileComplete =
      info.username &&
      info.username !== "" &&
      !info.username.includes("_") && // Temp usernames have underscores
      info.country &&
      info.country !== "Not specified";

    res.status(200).json({
      user: info,
      profileComplete,
      isNewUser,
    });
  } catch (err) {
    // If MongoDB save failed, cleanup Firebase account if it was just created
    if (err.code === 11000 || err.name === 'MongoServerError') {
      // Duplicate key error - username or email already exists
      const { firebaseUid } = req.body;
      
      if (firebaseUid) {
        console.log(`⚠️ MongoDB duplicate key error. Cleaning up Firebase user: ${firebaseUid}`);
        
        // Attempt cleanup (gracefully handles already-deleted case)
        const cleanedUp = await deleteFirebaseUser(firebaseUid);
        
        if (cleanedUp) {
          console.log(`✅ Cleanup completed for ${firebaseUid}`);
        }
      }
      
      // Return specific error based on which field was duplicate
      if (err.message.includes('username')) {
        return next(createError(400, "Username is already taken. Please choose a different username."));
      } else if (err.message.includes('email')) {
        return next(createError(400, "Email is already registered. Please use a different email."));
      }
      
      return next(createError(400, "Username or email already exists"));
    }
    
    // Handle other errors
    console.error('Error in syncFirebaseUser:', err);
    next(err);
  }
};

/**
 * Upload profile image to Cloudinary (server-side fallback)
 * This endpoint handles image uploads when client-side upload fails
 */
export const uploadProfileImage = async (req, res, next) => {
  try {
    // Check if file was uploaded
    if (!req.file) {
      return next(createError(400, "No file uploaded"));
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    if (!allowedTypes.includes(req.file.mimetype)) {
      return next(createError(400, "Invalid file type. Only images are allowed."));
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (req.file.size > maxSize) {
      return next(createError(400, "File too large. Maximum size is 5MB."));
    }

    // Import cloudinary from server.js
    const { cloudinary } = await import("../server.js");

    // Upload to Cloudinary using upload_stream
    const uploadResult = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "profile-photos",
          public_id: `user_${req.firebaseUid || Date.now()}_${Date.now()}`,
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

      // Write file buffer to stream
      uploadStream.end(req.file.buffer);
    });

    console.log(`✅ Successfully uploaded profile image to Cloudinary: ${uploadResult.secure_url}`);

    res.status(200).json({
      success: true,
      url: uploadResult.secure_url,
      public_id: uploadResult.public_id,
    });
  } catch (err) {
    console.error("❌ Error uploading image to Cloudinary:", err.message);
    
    // Provide specific error messages
    if (err.message?.includes('Invalid image file')) {
      return next(createError(400, "Invalid image file"));
    } else if (err.message?.includes('File size')) {
      return next(createError(400, "File size exceeds limit"));
    }
    
    return next(createError(500, "Failed to upload image. Please try again."));
  }
};
