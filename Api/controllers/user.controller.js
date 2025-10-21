import User from "../models/user.model.js";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

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
