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
    return res.status(404).json({ err: result });
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
      // console.log(err)
      return res.status(404).json("Error: ", err);
    });
};

export const signin = (req, res, next) => {
  const { email, password } = req.body;
  let loadedUser;
  User.findOne({ email: email })
    .then((user) => {
      if (!user) {
        return res.status(404).json("User not found");
      }
      loadedUser = user;
      return bcrypt.compare(password, loadedUser.password);
    })
    .then((equals) => {
      if (!equals) {
        return res.status(401).json("Wrong Password");
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
      console.log(err);
      return res.status(500).json("Error");
    });
};
