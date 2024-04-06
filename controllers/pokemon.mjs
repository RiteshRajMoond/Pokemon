import Pokedex from "pokedex-promise-v2";
const P = new Pokedex();

export const getHome = (req, res, next) => {
  res.status(200).json("This is home page");
};

export const getPokemonByName = async (req, res, next) => {
  let { pokemonName } = req.params;
  pokemonName = pokemonName.toLowerCase().trim();
  P.getPokemonByName(pokemonName)
    .then((resp) => {
      const { name, height, weight } = resp;
      const ability = resp.abilities[0].ability;
      return res.status(200).json({ name, ability, height, weight });
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 404;
      error.message = "Pokemon not found";
      next(error);
    });
};

export const getPokemonColorByName = async (req, res, next) => {
  let { pokemonColor } = req.params;
  pokemonColor = pokemonColor.toLowerCase().trim();
  P.getPokemonColorByName(pokemonColor)
    .then((resp) => {
      const { pokemon_species } = resp;
      return res.status(200).json({ pokemon_species });
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 404;
      error.message = "Color not found";
      next(error);
    });
};

export const getPokemonByType = async (req, res, next) => {
  let { pokemonType } = req.params;
  pokemonType = pokemonType.toLowerCase().trim();
  P.getTypeByName(pokemonType)
    .then((resp) => {
      const { pokemon } = resp;
      return res.status(200).json(pokemon);
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 404;
      error.message = "Type not found";
      next(error);
    });
};

export const getPokemonByRegion = async (req, res, next) => {
  let { pokemonRegion } = req.params;
  const region = pokemonRegion.toLowerCase().trim();

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

  pokemonRegion = regionToGeneration[region];

  P.getGenerationByName(pokemonRegion)
    .then((resp) => {
      const { pokemon_species } = resp;
      return res.status(200).json({ pokemon_species });
    })
    .catch((err) => {
      const error = new Error(err);
      error.status = 404;
      error.message = "Region not found";
      next(error);
    });
};

// replace then/catch block with async await (Will be done after validation studing pagination and error handling)
