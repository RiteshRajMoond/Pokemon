import express from "express";
import { body } from "express-validator";
import User from "../model/user.mjs";

import * as pokeController from "../controllers/pokemon.mjs";
import * as authController from "../controllers/auth.mjs";

const router = express.Router();

router.get("/poke/name/:pokemonName", pokeController.getPokemonByName);

router.get("/color/:pokemonColor", pokeController.getPokemonColorByName);

router.get("/type/:pokemonType", pokeController.getPokemonByType);

router.get("/poke/region/:pokemonRegion", pokeController.getPokemonByRegion);

router.post(
  "/auth/signup",
  [
    body("email")
      .isEmail()
      .withMessage("Please Enter a valid email")
      .custom((email, { req }) => {
        return User.findOne({ email: email }).then((userDoc) => {
          if (userDoc) {
            return Promise.reject("Email already exists");
          }
        });
      })
      .normalizeEmail(),
    body(
      "password",
      "Password must contain at least one uppercase letter, one lowercase letter, and one special character."
    )
      .isLength({ min: 8 })
      .custom((value) => {
        return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9]).{8,}$/.test(
          value
        );
      }),
  ],
  authController.signup
);

router.post("/auth/signin", authController.signin);

router.get("/", pokeController.getHome);

export default router;
