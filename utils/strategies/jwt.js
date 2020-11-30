const passport = require('passport');
const { Strategy, ExtractJwt } = require('passport-jwt');
const boom = require('@hapi/boom');
const { config } = require('../../config');
const UsersService = require('../../services/users');

passport.use(
  new Strategy(
    {
      secretOrKey: config.authJwtSecret,
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
    },
    async function (tokenPayload, cb) {
      const usersService = new UsersService();
      try {
        const user = await usersService.getUser({
          email: tokenPayload.user.email,
        });

        if (!user) {
          return cb(boom.unauthorized('no existe'), false);
        }

        delete user.password;
        cb(null, { ...user, scopes: tokenPayload.user.scopes });
      } catch (error) {
        return cb(error);
      }
    }
  )
);
