const { config } = require('../config');
const express = require('express');
const passport = require('passport');
const boom = require('@hapi/boom');
const { check, validationResult } = require('express-validator');
const jwt = require('jsonwebtoken');

//user controller
const UserService = require('../services/users');
//user model
const Users = require('../models/Users');
function authApi(app) {
  const router = express.Router();
  app.use('/api/auth', router);
  const usersService = new UserService();
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
            id: user.id,
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
        res.status(500).send('server error');
      }
    }
  );
}

module.exports = authApi;
