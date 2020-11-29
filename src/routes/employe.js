const express = require('express');

const passport = require('passport');
//user controller
const UsersService = require('../services/users');

//jwt strategy
require('../utils/strategies/jwt');

const scopesValidationHandler = require('../utils/middleware/scopesValidation');

function employeApi(app) {
  const router = express.Router();
  app.use('/api/users', router);
  const usersService = new UsersService();
  //USUARIO
  router.get(
    '/:userId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:users']),
    async function (req, res, next) {
      const { userId } = req.params;
      try {
        const user = await usersService.get({ userId });
        res.status(200).json({
          data: user,
          message: 'users retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = employeApi;
