import express from 'express';

import * as pokeController from "../controllers/pokemon.mjs";
import * as authController from '../controllers/auth.mjs';

const router = express.Router();

router.get("/poke/name/:pokemonName", pokeController.getPokemonByName);

router.get("/color/:pokemonColor", pokeController.getPokemonColorByName);

router.get("/type/:pokemonType", pokeController.getPokemonByType);

router.get("/poke/region/:pokemonRegion", pokeController.getPokemonByRegion);

router.post("/auth/signup", authController.signup);

router.get("/", pokeController.getHome);

export default router;