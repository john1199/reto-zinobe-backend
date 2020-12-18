const { config } = require('../config');
const passport = require('passport');
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');
const boom = require('@hapi/boom');

//user controller
const UserService = require('../services/users');
const ScopeKeys = require('../services/scopes');
//basic strategy
require('../utils/strategies/basic');

function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);
  const usersService = new UserService();
  const scopeKeys = new ScopeKeys();
  router.post(
    '/sign-in',
    [
      check('email', 'Please provide an email').isEmail(),
      check('password', 'Please provide the password').exists(),
    ],
    async function (req, res, next) {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }

      passport.authenticate('basic', function (error, user) {
        try {
          if (error || !user) {
            next(boom.unauthorized('no user o error'));
          }

          req.login(user, { session: false }, async function (error) {
            if (error) {
              next(error);
            }
            const { _id: id, name, email, isAdmin, team, points } = user;
            // sign a jsonwebtoken

            const scopes = scopeKeys.scope(user);
            const payload = {
              user: {
                sub: id,
                name: name,
                email: email,
                isAdmin: isAdmin,
                scopes: scopes,
              },
            };
            jwt.sign(
              payload,
              config.authJwtSecret,
              {
                expiresIn: '60m',
              },
              (err, token) => {
                if (err) throw err;
                res.status(200).json({ token, user: { name, email, isAdmin, team, points } });
              }
            );
          });
        } catch (error) {
          console.log(error);
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
      check('isAdmin').exists(),
      check('team', 'Please provide the team').exists(),
    ],
    async function (req, res, next) {
      const errors = validationResult(req.body);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { body: user } = req;
      const { email } = user;
      try {
        let userExist = await usersService.getUser({ email });
        if (userExist) {
          return res.status(400).json({ msg: 'user already exist' });
        }

        let createdUserId = await usersService.createUser({ user });

        res.status(201).json({
          data: createdUserId,
          message: 'user created',
        });
      } catch (error) {
        next(error);
      }
    }
  );
}

module.exports = authApi;
