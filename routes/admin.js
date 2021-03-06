const express = require('express');
const { check, validationResult } = require('express-validator');

const passport = require('passport');
//user controller
const UsersService = require('../services/users');
const SenioritiesService = require('../services/seniorities');
const TeamsService = require('../services/teams');

//jwt strategy
require('../utils/strategies/jwt');

const scopesValidationHandler = require('../utils/middleware/scopesValidation');

function adminApi(app) {
  const router = express.Router();
  app.use('/api/admin', router);
  const usersService = new UsersService();
  const senioritiesService = new SenioritiesService();
  const teamsService = new TeamsService();
  //USUARIOS
  router.get(
    '/users',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:users']),
    async function (req, res, next) {
      try {
        const users = await usersService.getUsers();
        res.status(200).json({
          data: users,
          message: 'users retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );
  router.put(
    '/users/:userId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:users']),
    async function (req, res, next) {
      const { userId } = req.params;
      const { body: user } = req;

      try {
        const updatedUserId = await usersService.updateUser({
          userId,
          user,
        });

        res.status(200).json({
          data: updatedUserId,
          message: 'user updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.delete(
    '/users/:userId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:users']),
    async function (req, res, next) {
      const { userId } = req.params;

      try {
        const deletedUserId = await usersService.deletedUser({ userId });

        res.status(200).json({
          data: deletedUserId,
          message: 'user deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //SENIORITIES
  router.get(
    '/seniorities',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:seniorities']),
    async function (req, res, next) {
      try {
        const users = await senioritiesService.getSeniorities();
        res.status(200).json({
          data: users,
          message: 'seniorities retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );
  router.post(
    '/seniorities',
    [
      check('name', 'Please provide an name').exists(),
      check('description', 'Please provide the description').exists(),
    ],
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:seniorities']),
    async function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { body: senioritie } = req;
      try {
        const createSenioritiesId = await senioritiesService.createSenioritie({
          senioritie,
        });

        res.status(201).json({
          data: createSenioritiesId,
          message: 'senioritie created',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.put(
    '/seniorities/:senioritieId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:seniorities']),
    async function (req, res, next) {
      const { senioritieId } = req.params;
      const { body: senioritie } = req;
      try {
        const senioritiesId = await senioritiesService.updateSeniorities({
          senioritieId,
          senioritie,
        });

        res.status(200).json({
          data: senioritiesId,
          message: 'senioritie updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.delete(
    '/seniorities/:senioritiesId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:seniorities']),
    async function (req, res, next) {
      const { senioritiesId } = req.params;

      try {
        const deletedsenioritiesId = await senioritiesService.deleteSeniorities(
          { senioritiesId }
        );

        res.status(200).json({
          data: deletedsenioritiesId,
          message: 'senioritie deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );

  //TEAMS
  router.get(
    '/teams',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['read:teams']),
    async function (req, res, next) {
      try {
        const users = await teamsService.getTeams();
        res.status(200).json({
          data: users,
          message: 'teams retrieved',
        });
      } catch (error) {
        next(error);
      }
    }
  );
  router.post(
    '/team',
    [
      check('name', 'Please provide an name').exists(),
      check('description', 'Please provide the description').exists(),
    ],
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['create:teams']),
    async function (req, res, next) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
      }
      const { body: team } = req;
      try {
        const createTeamId = await teamsService.createTeam({
          team,
        });

        res.status(201).json({
          data: createTeamId,
          message: 'team created',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.put(
    '/teams/:teamId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['update:teams']),
    async function (req, res, next) {
      const { teamId } = req.params;
      const { body: team } = req;
      try {
        const UpdateTeamId = await teamsService.updateTeam({
          teamId,
          team,
        });

        res.status(200).json({
          data: UpdateTeamId,
          message: 'team updated',
        });
      } catch (err) {
        next(err);
      }
    }
  );
  router.delete(
    '/teams/:teamId',
    passport.authenticate('jwt', { session: false }),
    scopesValidationHandler(['delete:seniorities']),
    async function (req, res, next) {
      const { teamId } = req.params;

      try {
        const deletedTeamId = await teamsService.deleteTeam(
          { teamId }
        );

        res.status(200).json({
          data: deletedTeamId,
          message: 'team deleted',
        });
      } catch (err) {
        next(err);
      }
    }
  );

}

module.exports = adminApi;
