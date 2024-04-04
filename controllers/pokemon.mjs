import Pokedex from "pokedex-promise-v2";
const P = new Pokedex();

export const getHome = (req, res, next) => {
  res.status(200).json("This is home page");
};

export const getPokemonByName = async (req, res, next) => {
  const { pokemonName } = req.params;
  P.getPokemonByName(pokemonName)
    .then((resp) => {
      const { name, height, weight } = resp;
      const ability = resp.abilities[0].ability;
      return res.status(200).json({ name, ability, height, weight });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json("In catch block of getPokemonByName");
    });
};

export const getPokemonColorByName = async (req, res, next) => {
  const { pokemonColor } = req.params;
  P.getPokemonColorByName(pokemonColor)
    .then((resp) => {
      const { pokemon_species } = resp;
      return res.status(200).json({ pokemon_species });
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json("Error in getPokemonColorByName");
    });
};

export const getPokemonByType = async (req, res, next) => {
  const { pokemonType } = req.params;
  P.getTypeByName(pokemonType)
    .then((resp) => {
      const { pokemon } = resp;
      return res.status(200).json(pokemon);
    })
    .catch((err) => {
      console.log(err);
      return res.status(404).json("error in getPokemonByType");
    });
};

export const getPokemonByRegion = async (req, res, next) => {
  let { pokemonRegion } = req.params;
  const region = pokemonRegion.toLowerCase();

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
      console.log(err);
      return res.status(404).json("error in the getPokemonByRegion");
    });
};

// replace then/catch block with async await (Will be done after validation studing pagination and error handling)
