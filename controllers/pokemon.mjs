import Pokedex from "pokedex-promise-v2";
import nodeCache from "node-cache";
const P = new Pokedex();
const cache = new nodeCache();

export const getHome = (req, res, next) => {
  res.status(200).json("This is home page");
};

export const getPokemonByName = async (req, res, next) => {
  try {
    let { pokemonName } = req.params;
    pokemonName = pokemonName.toLowerCase().trim();
    const resp = await P.getPokemonByName(pokemonName);
    const { name, height, weight } = resp;
    const ability = resp.abilities[0].ability;
    return res.status(200).json({ name, ability, height, weight });
  } catch (err) {
    const error = new Error(err);
    error.status = 404;
    error.message = "Pokemon not found";
    next(error);
  }
};

export const getPokemonColorByName = async (req, res, next) => {
  try {
    let { pokemonColor } = req.params;
    pokemonColor = pokemonColor.toLowerCase().trim();

    const cacheKey = `color:${pokemonColor}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ pokemon_species: cachedData });
    }

    const resp = await P.getPokemonColorByName(pokemonColor);
    cache.set(cacheKey, resp.pokemon_species, 3600);
    const { pokemon_species } = resp;
    return res.status(200).json({ pokemon_species });
  } catch (err) {
    const error = new Error(err);
    error.status = 404;
    error.message = "Color not found";
    next(error);
  }
};

export const getPokemonByType = async (req, res, next) => {
  try {
    let { pokemonType } = req.params;
    pokemonType = pokemonType.toLowerCase().trim();
    const cacheKey = `type:${pokemonType}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ pokemon: cachedData });
    }

    const resp = await P.getTypeByName(pokemonType);
    cache.set(cacheKey, resp.pokemon, 3600);
    return res.status(200).json({ pokemon: resp.pokemon });
  } catch (err) {
    const error = new Error(err);
    error.status = 404;
    error.message = "Type not found";
    next(error);
  }
};

export const getPokemonByRegion = async (req, res, next) => {
  try {
    let { pokemonRegion } = req.params;
    pokemonRegion = pokemonRegion.toLowerCase().trim();

    const regionToGeneration = {
      kanto: "generation-i",
      johto: "generation-ii",
      hoenn: "generation-iii",
      sinnoh: "generation-iv",
      unova: "generation-v",
      kalos: "generation-vi",
      alola: "generation-vii",
      galar: "generation-viii",
    };

    const generation = regionToGeneration[pokemonRegion];

    const cacheKey = `region:${generation}`;
    const cachedData = cache.get(cacheKey);

    if (cachedData) {
      return res.status(200).json({ pokemon_species: cachedData });
    }

    const resp = await P.getGenerationByName(generation);
    const { pokemon_species } = resp;
    cache.set(cacheKey, pokemon_species, 3600);
    return res.status(200).json({ pokemon_species });
  } catch (err) {
    const error = new Error(err);
    error.status = 404;
    error.message = "Region not found";
    next(error);
  }
};