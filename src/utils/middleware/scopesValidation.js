const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    console.log(req.user);
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'));
    }

    const hasAccess = allowedScopes
      .map((allowedScope) => req.user.scopes.includes(allowedScope))
      .find((allowed) => Boolean(allowed));

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized('Insufficient scoopes'));
    }
  };
}

module.exports = scopesValidationHandler;
