import express from 'express';
import bodyParser from 'body-parser';

const app = express();

import pokeRoutes from "./routes/pokemon.mjs";

app.use(bodyParser.json());

app.use(pokeRoutes);

// For error handling
app.use((error, req, res, next) => {
  console.log("This is the error handling middleware");
  res.status(error.status || 500).json({ error: error.message});
});

app.listen(8000, () => {
  console.log("Server started");
});
