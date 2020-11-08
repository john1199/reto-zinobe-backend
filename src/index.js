const { config } = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();

const authApi = require('./routes/auth');

async function main() {
  // settings
  app.set('port', config.port);

  //middlewares
  app.use(cors());

  //bodyparser
  app.use(express.json());

  //routes
  authApi(app);

  await app.listen(config.port);
  console.log(`Listening http://localhost:${config.port}`);
}

main();
