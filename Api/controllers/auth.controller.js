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

    const trimmedUsername = username.trim();
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
      process.env.JWT_SECRET
    );
    //////////////////////////////////////////////////////
    const { password: _password, ...info } = user._doc;
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
