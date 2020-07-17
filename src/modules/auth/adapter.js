const { BackendResponse } = require('../../components');
const { AuthController } = require('./controller');

class AuthAdapter {
  async register(req, res, next) {
    try {
      const {
        body: {
          email, password, name, surname, username,
        },
        ip,
      } = req;
      const tokens = await AuthController.register({
        email, password, name, surname, username, ip,
      });
      return BackendResponse.Created(res, 'User successfully registered', tokens);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const {
        body:
          { password: userInputPassword, email, username },
        ip,
      } = req;
      const tokens = await AuthController.login({
        userInputPassword, email, username, ip,
      });
      return BackendResponse.Success(res, 'Pair of tokens was generated', tokens);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const {
        body:
          { refreshToken },
        ip,
      } = req;
      const tokens = await AuthController.refresh({
        refreshToken, ip,
      });
      return BackendResponse.Success(res, 'Pair of tokens was refreshed', tokens);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { parsedBearerToken } = res.locals;
      await AuthController.logout({ token: parsedBearerToken });
      return BackendResponse.Success(res, 'Success logout');
    } catch (e) {
      next(e);
    }
  }

  async me(req, res, next) {
    try {
      const { token } = req;
      const user = await AuthController.me({ token });
      return BackendResponse.Success(res, 'User successfully received', user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  AuthAdapter: new AuthAdapter(),
};
