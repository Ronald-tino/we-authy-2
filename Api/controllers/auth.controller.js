import User from "../models/user.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

////////////////////////////////////////////////////////
export const register = async (req, res) => {
  try {
    const hash = await bcrypt.hash(req.body.password, 5); // Add 'await' here
    const newUser = new User({
      ...req.body,
      password: hash,
    });
    await newUser.save();
    res.status(201).send("User created successfully");
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

export const login = async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      return res.status(404).send("User not found");
    }
    const isPasswordCorrect = await bcrypt.compareSync(req.body.password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).send("Wrong password for username");
    }
    //////////////////////////////////////////////////////
    const token = jwt.sign({ 
      id: user._id , 
      isSeller: user.isSeller,
    }, process.env.JWT_SECRET);
    //////////////////////////////////////////////////////
    const { password, ...info } = user._doc;
      res.cookie("accessToken", token, {
        httpOnly: true,
      }).status(200).send({ info });
    //////////////////////////////////////////////////////
  } catch (error) {
    console.log(error);
    res.status(500).send("Something went wrong");
  }
};

export const logout = async (req, res) => {
  res.send("Logout endpoint working");
};
