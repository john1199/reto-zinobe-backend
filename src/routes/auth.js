const { config } = require('../config');
const express = require('express');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//user controller
const UserService = require('../services/users');
//basic strategy
require('../utils/auth/strategies/basic');

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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { email } = req.body;
      try {
        let user = await usersService.getUser({ email });
        // sign a jsonwebtoken
        const payload = {
          user: {
            id: user._id,
          },
        };

        jwt.sign(
          payload,
          config.authJwtSecret,
          {
            expiresIn: 36000,
          },
          (err, token) => {
            if (err) throw err;
            res.status(200).json({ token });
          }
        );
      } catch (error) {
        console.error(err.message);
        res.status(500).send('server error');
      }
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
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { body: user } = req;
      const { email } = user;
      try {
        let userExist = await usersService.getUser({ email });
        if (userExist)
          return res.status(400).json({ msg: 'user already exist' });
        let createUserId = await usersService.createUser({ user });
        const payload = {
          user: {
            id: createUserId,
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

        /*res.status(201).json({
          data: createUserId,
          message: 'user created',
        });*/
      } catch (error) {
        console.error(error.message);
        res.status(500).send('server error in sign-up');
      }
    }
  );
}

module.exports = authApi;
