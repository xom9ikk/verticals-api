const { TokenComponent } = require('../components');
const { UserService } = require('../services');

class FetchMiddleware {
  static getDataFromToken(token) {
    return TokenComponent.verifyToken(token);
  }

  async getUserId(req, res, next) {
    try {
      const { parsedBearerToken } = res.locals;
      const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);

      res.locals.userId = userId;
      next();
    } catch (e) {
      next(e);
    }
  }

  async getUser(req, res, next) {
    try {
      const { parsedBearerToken } = res.locals;
      const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);

      const user = await UserService.getById(userId);

      res.locals.user = user;
      next();
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  FetchMiddleware: new FetchMiddleware(),
};
