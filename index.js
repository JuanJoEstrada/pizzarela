const express = require('express');
const app = express();

const loaders = require('./loaders/index');
const { PORT } = require('./config/config');

const startServer = async () => {

  // Init application loaders
  loaders(app);
  
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`)
  });
};

startServer();