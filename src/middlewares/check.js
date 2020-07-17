const { BackendError, TokenComponent } = require('../components');
const { ValidatorComponent } = require('../components');

class CheckMiddleware {
  static isBearer(token) {
    if (!token) return false;
    return token.includes('Bearer');
  }

  static normalizeBearerToken(token) {
    return token.split('Bearer ')[1];
  }

  static extractToken(req) {
    const { authorization } = req.headers;
    if (this.isBearer(authorization)) {
      return this.normalizeBearerToken(authorization);
    }
  }

  static isValidTokenSignature(token) {
    try {
      TokenComponent.verifyToken(token);
      return true;
    } catch (e) {
      return false;
    }
  }

  async isAuthenticated(req, res, next) {
    try {
      const token = CheckMiddleware.extractToken(req);
      if (!token) {
        throw new BackendError.BadRequest('Token does not contain Bearer');
      }

      const isValidTokenSignature = await CheckMiddleware.isValidTokenSignature(token);
      if (!isValidTokenSignature) {
        throw new BackendError.BadRequest('Invalid token signature');
      }

      const isActiveToken = await ValidatorComponent.isActiveToken(token);
      if (!isActiveToken) {
        throw new BackendError.Forbidden('Invalid token');
      }

      res.locals.parsedBearerToken = token;
      next();
    } catch (e) {
      next(e);
    }
  }

  async isUserExist(req, res, next) {
    try {
      const { email, username } = req.body;
      const [isExistEmail, isExistUsername] = await Promise.all([
        ValidatorComponent.isExistEmail(email),
        ValidatorComponent.isExistUsername(username),
      ]);
      if (isExistEmail) {
        throw new BackendError.Conflict(`User with email ${email} already registered`);
      }
      if (isExistUsername) {
        throw new BackendError.Conflict(`User with username ${username} already registered`);
      }
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  CheckMiddleware: new CheckMiddleware(),
};
