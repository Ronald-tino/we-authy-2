import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";
import { uploadGooglePhotoToCloudinary, isGooglePhotoUrl } from "../utils/uploadGooglePhoto.js";

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
      isNewUser = true;

      // Auto-create user with minimal data if username/country not provided
      if (!username || !country) {
        // Create minimal record for Firebase-only users (e.g., Google sign-in without registration)
        const tempUsername =
          email.split("@")[0].toLowerCase() + "_" + firebaseUid.slice(0, 6);

        // Check if temp username exists and find unique one
        let finalUsername = tempUsername;
        let counter = 1;
        while (await User.findOne({ username: finalUsername })) {
          finalUsername = `${tempUsername}_${counter}`;
          counter++;
        }

        const newUser = new User({
          username: finalUsername,
          email,
          firebaseUid,
          country: country || "Not specified", // Temporary value - user can update later
          img: processedImg || "",
          phone: phone || "",
          desc: desc || "",
          isSeller: false,
          password: "",
        });

        await newUser.save();
        user = newUser;
      } else {
        // Full registration with username/country provided
        // Check if username or email already exists
        const existingUser = await User.findOne({
          $or: [{ username: username.trim().toLowerCase() }, { email }],
        });

        if (existingUser) {
          // If user exists but doesn't have firebaseUid, link it
          if (!existingUser.firebaseUid) {
            existingUser.firebaseUid = firebaseUid;
            if (email !== existingUser.email) existingUser.email = email;
            await existingUser.save();
            const { password, ...info } = existingUser._doc;

            // Check if profile is complete
            const profileComplete =
              info.username && info.country && info.country !== "Not specified";

            return res.status(200).json({
              user: info,
              message: "User linked to Firebase account",
              profileComplete,
            });
          } else {
            return next(createError(400, "Username or email already exists"));
          }
        }

        // Create new user with full data
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

        await newUser.save();
        user = newUser;
      }
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
    next(err);
  }
};
