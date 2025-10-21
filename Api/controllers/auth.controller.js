import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import createError from "../utils/createError.js";

////////////////////////////////////////////////////////
export const register = async (req, res, next) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 5); // Add 'await' here
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();

    // Auto-login after registration
    const token = jwt.sign(
      {
        id: newUser._id,
        isSeller: newUser.isSeller,
      },
      process.env.JWT_SECRET
    );

    const { password, ...info } = newUser._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(201)
      .send({ info });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    //error

    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compareSync(
      req.body.password.trim(),
      user.password
    );
    if (!isPasswordCorrect) {
      return next(createError(400, "Wrong password for username"));
    }
    //////////////////////////////////////////////////////
    const token = jwt.sign(
      {
        id: user._id,
        isSeller: user.isSeller,
      },
      process.env.JWT_SECRET
    );
    //////////////////////////////////////////////////////
    const { password, ...info } = user._doc;
    res
      .cookie("accessToken", token, {
        httpOnly: true,
      })
      .status(200)
      .send({ info });
    //////////////////////////////////////////////////////
  } catch (err) {
    next(err);
  }
};

export const logout = async (req, res) => {
  res
    .clearCookie("accessToken", {
      sameSite: "none",
      secure: true,
    })
    .status(200)
    .send("User has been logged out");
};
