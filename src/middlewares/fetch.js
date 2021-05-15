const { BackendError } = require('../components/error/rest');
const { TokenComponent } = require('../components');
const { UserService } = require('../services');

class FetchMiddleware {
  static getDataFromToken(token) {
    return TokenComponent.verifyToken(token);
  }

  async getUserId(req) {
    try {
      const { parsedBearerToken } = req;
      const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);
      req.userId = userId;
    } catch (e) {
      throw new BackendError.Unauthorized('Invalid token signature');
    }
  }

  async getUser(req) {
    try {
      const { parsedBearerToken } = req;
      const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);
      req.user = await UserService.getById(userId);
    } catch (e) {
      throw new BackendError.Unauthorized('Invalid token signature');
    }
  }
}

module.exports = {
  FetchMiddleware: new FetchMiddleware(),
};
