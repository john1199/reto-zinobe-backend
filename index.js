const { config } = require('./config');
const express = require('express');
import helmet from 'helmet';
const cors = require('cors');
const app = express();

const authApi = require('./routes/auth');
const adminApi = require('./routes/admin');
const employeApi = require('./routes/employe');
const {
  logErrors,
  wrapErrors,
  errorHandler,
} = require('./utils/middleware/errorHandlers.js');

const notFoundHandler = require('./utils/middleware/notFoundHandler');

async function main() {
  // settings
  app.set('port', config.port);

  app.use(helmet());
  app.use(helmet.permittedCrossDomainPolicies());
  app.disable('x-powered-by');
  //middlewares
  app.use(cors());

  //bodyparser
  app.use(express.json());

  //routes
  authApi(app);
  adminApi(app);
  employeApi(app);
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
