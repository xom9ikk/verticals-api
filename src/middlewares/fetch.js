const { TokenComponent } = require('../components');
const { UserService } = require('../services');

class FetchMiddleware {
  static getDataFromToken(token) {
    return TokenComponent.verifyToken(token);
  }

  async getUserId(req, res) {
    const { parsedBearerToken } = req;
    const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);

    req.userId = userId;
  }

  async getUser(req, res, next) {
    const { parsedBearerToken } = req;
    const { userId } = FetchMiddleware.getDataFromToken(parsedBearerToken);

    const user = await UserService.getById(userId);
    req.user = user;
  }
}

module.exports = {
  FetchMiddleware: new FetchMiddleware(),
};
