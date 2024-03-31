import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import {config} from 'dotenv';
config();

import User from "../model/user.mjs";

mongoose.connect(
    `mongodb+srv://${process.env.MONGO_USER_NAME}:${process.env.MONGO_PASSWORD}@cluster0.hodiq1h.mongodb.net/pokemon?retryWrites=true&w=majority`
  );

export const signup = (req, res, next) => {
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
