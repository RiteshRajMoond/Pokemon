import express from 'express';

import * as pokeController from "../controllers/pokemon.mjs";

const router = express.Router();

router.get("/poke/name/:pokemonName", pokeController.getPokemonByName);

router.get("/color/:pokemonColor", pokeController.getPokemonColorByName);

router.get("/type/:pokemonType", pokeController.getPokemonByType);

router.get("/poke/region/:pokemonRegion", pokeController.getPokemonByRegion);

router.get("/", pokeController.getHome);

export default router;