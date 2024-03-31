import express from 'express';
import bodyParser from 'body-parser';

const app = express();

import pokeRoutes from "./routes/pokemon.mjs";

app.use(bodyParser.json());

app.use(pokeRoutes);

app.listen(8000, () => {
  console.log("Server started");
});
