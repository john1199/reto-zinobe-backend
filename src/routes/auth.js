const { config } = require('../config');
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

//user controller
const UserService = require('../services/users');
const passport = require('passport');
const { use } = require('passport');
//basic strategy
require('../utils/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);
  const usersService = new UserService();

  router.post(
    '/sign-in',
    [
      check('email', 'Please provide an email').isEmail(),
      check(
        'password',
        'Please provide the password min 6 characters'
      ).exists(),
    ],
    async function (req, res, next) {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      passport.authenticate('basic', function (error, user) {
        try {
          console.log(user);
          if (error || !user) {
            next(boom.unauthorized());
          }

          req.login(user, { session: false }, async function (error) {
            if (error) {
              next(error);
            }
            const { name } = user;
            // sign a jsonwebtoken

            const payload = {
              user: {
                sub: user._id,
                name: user.name,
                email: user.email,
              },
            };

            jwt.sign(
              payload,
              config.authJwtSecret,
              {
                expiresIn: '15m',
              },
              (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, user: { name, email } });
              }
            );
          });
        } catch (error) {
          next(error);
        }
      })(req, res, next);
    }
  );

  router.post(
    '/sign-up',
    [
      check(
        'identificationCard',
        'Please provide the identification document'
      ).exists(),
      check('name', 'Please provide an name').exists(),
      check('email', 'Please provide an email').isEmail(),
      check('password', 'Please provide the password min 6 characters')
        .exists()
        .isLength({ min: 6 }),
      check('team', 'Please provide the team').exists(),
    ],
    async function (req, res, next) {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = user;
      try {
        let userExist = await usersService.getUser({ email });
        if (userExist)
          return res.status(400).json({ msg: 'user already exist' });
        let createUserId = await usersService.createUser({ user });

        const payload = {
          user: {
            sub: createUserId,
            name: user.name,
            email: user.email,
          },
        };
        jwt.sign(
          payload,
          config.authJwtSecret,
          {
            expiresIn: 3600,
          },
          (err, token) => {
            if (err) throw err;
            res.send({ token });
          }
        );
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
