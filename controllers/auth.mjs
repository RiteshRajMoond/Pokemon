import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { validationResult } from "express-validator";
import { config } from "dotenv";
config();

import User from "../model/user.mjs";

mongoose.connect(
  `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0.hodiq1h.mongodb.net/pokemon?retryWrites=true&w=majority`
);

export const signup = async (req, res, next) => {
  try {
    const result = validationResult(req);

    if (!result.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      error.data = result.array().map((err) => err.msg);
      throw error;
    }

    const { email, password } = req.body;
    const hashedPw = bcrypt.hashSync(password, 10);
    const user = new User({
      email: email,
      password: hashedPw,
    });
    await user.save();
    return res.status(201).json({ message: "User created" });
  } catch (err) {
    next(err);
  }
};

export const signin = async (req, res, next) => {
  try {
    const result = validationResult(req);
    if (!result.isEmpty()) {
      const error = new Error("Validation failed");
      error.status = 422;
      error.data = result.array().map((err) => err.msg);
      throw error;
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email });

    if (!user) {
      const error = new Error("User not found");
      error.status = 404;
      error.auth = true;
      throw error;
    }

    const equals = await bcrypt.compare(password, user.password);

    if (!equals) {
      const error = new Error("Password is incorrect");
      error.status = 401;
      error.auth = true;
      throw error;
    }

    const token = jwt.sign(
      { email: user.email, userId: user._id.toString() },
      process.env.JWT_SECRET_KEY,
      { expiresIn: "1h" }
    );

    return res.status(200).json({ token: token, userId: user._id.toString() });
  } catch (err) {
    next(err);
  }
};
