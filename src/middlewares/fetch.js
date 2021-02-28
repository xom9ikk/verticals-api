const { TokenComponent } = require('../components');
const { UserService } = require('../services');

class FetchMiddleware {
  static getDataFromToken(token) {
    return TokenComponent.verifyToken(token);
  }

  async getUserId(req) {
    const { parsedBearerToken } = req;
    const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);
    req.userId = userId;
  }

  async getUser(req) {
    const { parsedBearerToken } = req;
    const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);
    req.user = await UserService.getById(userId);
  }
}

module.exports = {
  FetchMiddleware: new FetchMiddleware(),
};
