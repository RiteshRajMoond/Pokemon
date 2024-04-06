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

export const signup = (req, res, next) => {
  const result = validationResult(req);

  if (!result.isEmpty()) {
    const error = new Error("Validation failed");
    error.statusCode = 422;
    error.auth = true;
    // error.data = result.array();
    throw error;
  }

  const { email, password } = req.body;
  bcrypt
    .hash(password, 10)
    .then((hashedPw) => {
      const user = new User({ email: email, password: hashedPw });
      return user.save();
    })
    .then((resp) => {
      return res.status(201).json("New User created!");
    })
    .catch((err) => {
      next(err);
    });
};

export const signin = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        const error = new Error("User not found");
        error.auth = true;
        throw error;
      }
      loadedUser = user;
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((equals) => {
      if (!equals) {
        const error = new Error("Wrong password");
        error.auth = true;
        throw error;
      }
      const token = jwt.sign(
        {
          email: loadedUser.email,
          userId: loadedUser._id.toString(),
        },
        process.env.JWT_SECRET_KEY,
        {
          expiresIn: "2hr",
        }
      );
      return res.status(200).json({ token: token });
    })
    .catch((err) => {
      next(err);
    });
};
