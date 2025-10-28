import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { cloudinary } from "../server.js";

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
  const user = await User.findById(req.params.id);
  const token = req.cookies.accessToken;
  if (!token) {
    return res.status(401).send("Unauthorized Please Login");
  }
  jwt.verify(token, process.env.JWT_SECRET, async (err, payload) => {
    if (req.userId !== user._id.toString()) {
      return next(createError(403, "You can delete only your account"));
    }
    await User.findByIdAndDelete(req.params.id);
    res.status(200).send("User has been deleted");
  });

  // await User.findByIdAndDelete(req.params.id);
};

export const getUser = async (req, res, next) => {
  const user = await User.findById(req.params.id);

  res.status(200).send(user);
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
      .cookie("accessToken", token, {
        httpOnly: true,
      })
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

    // Validate that user is updating their own profile
    if (userId !== req.params.id) {
      return next(createError(403, "You can only update your own profile"));
    }

    // Get current user to check old image
    const currentUser = await User.findById(userId);
    if (!currentUser) {
      return next(createError(404, "User not found"));
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
        currentUser.img &&
        currentUser.img.includes("cloudinary") &&
        currentUser.img !== img.trim()
      ) {
        try {
          const publicId = extractPublicId(currentUser.img);
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

    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      userId,
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
