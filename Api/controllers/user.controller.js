import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { cloudinary } from "../server.js";
import { uploadGooglePhotoToCloudinary, isGooglePhotoUrl } from "../utils/uploadGooglePhoto.js";

// Helper function to extract public_id from Cloudinary URL
const extractPublicId = (url) => {
  if (!url || !url.includes("cloudinary")) return null;

  // Example URL: https://res.cloudinary.com/dzmrfifoq/image/upload/v1234567890/folder/image_id.jpg
  const parts = url.split("/");
  const uploadIndex = parts.indexOf("upload");

  if (uploadIndex === -1) return null;

  // Get everything after 'upload/vXXXXXXXXXX/' or 'upload/'
  let publicIdParts = parts.slice(uploadIndex + 1);

  // Skip version number if present (starts with 'v' followed by digits)
  if (publicIdParts[0] && /^v\d+$/.test(publicIdParts[0])) {
    publicIdParts = publicIdParts.slice(1);
  }

  // Join the remaining parts and remove file extension
  const publicId = publicIdParts.join("/").replace(/\.[^/.]+$/, "");

  return publicId;
};

////////////////////////////////////////////////////////

export const deleteUser = async (req, res, next) => {
  try {
    // Support both MongoDB _id and firebaseUid
    let user;
    try {
      user = await User.findOne({
        $or: [
          { _id: req.params.id },
          { firebaseUid: req.params.id }
        ]
      });
    } catch (castErr) {
      if (castErr.name === 'CastError') {
        user = await User.findOne({ firebaseUid: req.params.id });
      } else {
        throw castErr;
      }
    }

    if (!user) {
      return next(createError(404, "User not found"));
    }
    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account"));
    }
    await User.findByIdAndDelete(user._id);
    res.status(200).send("User has been deleted");
  } catch (err) {
    next(err);
  }
};

export const getUser = async (req, res, next) => {
  try {
    // Support both MongoDB _id and firebaseUid
    let user;
    try {
      user = await User.findOne({
        $or: [
          { _id: req.params.id },
          { firebaseUid: req.params.id }
        ]
      });
    } catch (castErr) {
      // If _id format is invalid (CastError), try firebaseUid only
      if (castErr.name === 'CastError') {
        user = await User.findOne({ firebaseUid: req.params.id });
      } else {
        throw castErr;
      }
    }

    if (!user) {
      return next(createError(404, "User not found"));
    }

    res.status(200).send(user);
  } catch (err) {
    next(err);
  }
};

export const getPublicUser = async (req, res, next) => {
  try {
    console.log("📖 Fetching public profile for user:", req.params.id);

    // Support both MongoDB _id and firebaseUid
    let user;
    try {
      user = await User.findOne({
        $or: [
          { _id: req.params.id },
          { firebaseUid: req.params.id }
        ]
      }).select(
        "username img country desc isSeller totalStars starNumber tripsCompleted createdAt firebaseUid"
      );
    } catch (castErr) {
      // If _id format is invalid (CastError), try firebaseUid only
      if (castErr.name === 'CastError') {
        user = await User.findOne({ firebaseUid: req.params.id }).select(
          "username img country desc isSeller totalStars starNumber tripsCompleted createdAt firebaseUid"
        );
      } else {
        throw castErr;
      }
    }

    if (!user) {
      console.log("❌ User not found:", req.params.id);
      return next(createError(404, "User not found"));
    }

    console.log("✅ Public profile found for:", user.username);
    res.status(200).send(user);
  } catch (err) {
    console.error("❌ Error fetching public profile:", err.message);
    next(err);
  }
};

export const becomeSeller = async (req, res, next) => {
  try {
    const userId = req.userId; // From JWT middleware
    const { phone, desc } = req.body;

    // Validate required fields
    if (!phone || !desc) {
      return next(createError(400, "Phone and description are required"));
    }

    if (phone.trim().length < 10) {
      return next(createError(400, "Please provide a valid phone number"));
    }

    if (desc.trim().length < 50) {
      return next(
        createError(400, "Description must be at least 50 characters")
      );
    }

    // Update user to become a seller
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      {
        $set: {
          isSeller: true,
          phone: phone.trim(),
          desc: desc.trim(),
        },
      },
      { new: true } // Return updated document
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }

    // Generate new JWT token with updated isSeller status
    const token = jwt.sign(
      {
        id: updatedUser._id,
        isSeller: updatedUser.isSeller,
      },
      process.env.JWT_SECRET
    );

    // Send updated token as cookie along with user data
    // Return in same format as login/register: { info: userData }
    res
      .cookie(
        "accessToken",
        token,
        process.env.NODE_ENV === "production"
          ? { httpOnly: true, sameSite: "none", secure: true }
          : { httpOnly: true }
      )
      .status(200)
      .json({ info: updatedUser });
  } catch (err) {
    next(err);
  }
};

export const updateUser = async (req, res, next) => {
  try {
    const userId = req.userId; // From JWT middleware
    const { phone, desc, country, img } = req.body;

    // Get current user by MongoDB _id (userId from middleware)
    let currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(createError(404, "User not found"));
    }

    // Support both MongoDB _id and firebaseUid in params
    let targetUser;
    try {
      targetUser = await User.findOne({
        $or: [
          { _id: req.params.id },
          { firebaseUid: req.params.id }
        ]
      });
    } catch (castErr) {
      if (castErr.name === 'CastError') {
        targetUser = await User.findOne({ firebaseUid: req.params.id });
      } else {
        throw castErr;
      }
    }

    if (!targetUser) {
      return next(createError(404, "User not found"));
    }

    // Validate that user is updating their own profile
    if (userId !== targetUser._id.toString()) {
      return next(createError(403, "You can only update your own profile"));
    }

    // Build update object with only provided fields
    const updateData = {};

    if (phone !== undefined) {
      if (phone.trim().length > 0 && phone.trim().length < 10) {
        return next(createError(400, "Please provide a valid phone number"));
      }
      updateData.phone = phone.trim();
    }

    if (desc !== undefined) {
      updateData.desc = desc.trim();
    }

    if (country !== undefined) {
      if (country.trim().length === 0) {
        return next(createError(400, "Country is required"));
      }
      updateData.country = country.trim();
    }

    if (img !== undefined && img.trim() !== "") {
      // Delete old image from Cloudinary if it exists and is different from new image
      if (
        targetUser.img &&
        targetUser.img.includes("cloudinary") &&
        targetUser.img !== img.trim()
      ) {
        try {
          const publicId = extractPublicId(targetUser.img);
          if (publicId) {
            await cloudinary.uploader.destroy(publicId);
            console.log(`Deleted old profile image: ${publicId}`);
          }
        } catch (error) {
          // Log error but don't fail the update
          console.error("Error deleting old image from Cloudinary:", error);
        }
      }
      updateData.img = img.trim();
    }

    // Update user profile using the MongoDB _id
    const updatedUser = await User.findByIdAndUpdate(
      targetUser._id,
      { $set: updateData },
      { new: true } // Return updated document
    ).select("-password"); // Exclude password from response

    if (!updatedUser) {
      return next(createError(404, "User not found"));
    }

    // Update localStorage format - return in same format as login/register
    res.status(200).json({ info: updatedUser });
  } catch (err) {
    next(err);
  }
};

/**
 * Migration endpoint to upload all Google profile photos to Cloudinary
 * This will find all users with Google photo URLs and upload them to Cloudinary
 */
export const migrateGooglePhotos = async (req, res, next) => {
  try {
    console.log("🔄 Starting Google photo migration to Cloudinary...");

    // Find all users with Google photo URLs
    const usersWithGooglePhotos = await User.find({
      img: { $regex: "googleusercontent.com", $options: "i" },
    });

    console.log(`📊 Found ${usersWithGooglePhotos.length} users with Google photos`);

    const results = {
      total: usersWithGooglePhotos.length,
      successful: 0,
      failed: 0,
      skipped: 0,
      details: [],
    };

    // Process each user
    for (const user of usersWithGooglePhotos) {
      try {
        const googlePhotoUrl = user.img;
        
        if (!isGooglePhotoUrl(googlePhotoUrl)) {
          console.log(`⏭️ Skipping user ${user._id} - not a valid Google photo URL`);
          results.skipped++;
          results.details.push({
            userId: user._id,
            username: user.username,
            status: "skipped",
            reason: "Not a valid Google photo URL",
          });
          continue;
        }

        console.log(`📸 Processing user ${user.username} (${user._id})`);
        
        // Upload to Cloudinary
        const cloudinaryUrl = await uploadGooglePhotoToCloudinary(
          googlePhotoUrl,
          user.firebaseUid || user._id.toString()
        );

        if (cloudinaryUrl) {
          // Update user with new Cloudinary URL
          user.img = cloudinaryUrl;
          await user.save();
          
          results.successful++;
          results.details.push({
            userId: user._id,
            username: user.username,
            status: "success",
            oldUrl: googlePhotoUrl,
            newUrl: cloudinaryUrl,
          });
          console.log(`✅ Successfully migrated photo for ${user.username}`);
        } else {
          results.failed++;
          results.details.push({
            userId: user._id,
            username: user.username,
            status: "failed",
            reason: "Failed to upload to Cloudinary",
            oldUrl: googlePhotoUrl,
          });
          console.log(`❌ Failed to migrate photo for ${user.username}`);
        }
      } catch (error) {
        console.error(`Error processing user ${user._id}:`, error);
        results.failed++;
        results.details.push({
          userId: user._id,
          username: user.username,
          status: "error",
          reason: error.message,
        });
      }
    }

    console.log("✅ Migration completed!");
    console.log(`📊 Results: ${results.successful} successful, ${results.failed} failed, ${results.skipped} skipped`);

    res.status(200).json({
      message: "Google photo migration completed",
      results,
    });
  } catch (err) {
    console.error("Error during migration:", err);
    next(err);
  }
};
