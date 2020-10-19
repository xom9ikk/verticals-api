const { BackendResponse } = require('../../components');
const { AuthController } = require('./controller');

class AuthAdapter {
  async register(req, res) {
    const tokens = await AuthController.register({
      ...req.body,
      ip: req.ip,
    });
    return BackendResponse.Created(res, 'User successfully registered', tokens);
  }

  async login(req, res) {
    const {
      body:
          { password: userInputPassword, email, username },
      ip,
    } = req;
    const tokens = await AuthController.login({
      userInputPassword, email, username, ip,
    });
    return BackendResponse.Success(res, 'Pair of tokens was generated', tokens);
  }

  async refresh(req, res) {
    const {
      body:
          { refreshToken },
      ip,
    } = req;
    const tokens = await AuthController.refresh({
      refreshToken, ip,
    });
    return BackendResponse.Success(res, 'Pair of tokens was refreshed', tokens);
  }

  async logout(req, res) {
    const { parsedBearerToken } = req;
    await AuthController.logout({ token: parsedBearerToken });
    return BackendResponse.Success(res, 'Success logout');
  }
}

module.exports = {
  AuthAdapter: new AuthAdapter(),
};
