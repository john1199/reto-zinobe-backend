const { config } = require('./config');
const express = require('express');
const cors = require('cors');
const app = express();

const authApi = require('./routes/auth');
const adminApi = require('./routes/admin');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

async function main() {
  // settings
  app.set('port', config.port);

  //middlewares
  app.use(cors());

  //bodyparser
  app.use(express.json());

  //routes
  authApi(app);
  adminApi(app);

  // Catch 404
  app.use(notFoundHandler);

  // Errors middleware
  app.use(logErrors);
  app.use(wrapErrors);
  app.use(errorHandler);
  await app.listen(config.port);
  console.log(`Listening http://localhost:${config.port}`);
}

main();
