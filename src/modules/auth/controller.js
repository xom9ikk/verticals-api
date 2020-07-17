const { compareSync, hashSync } = require('bcryptjs');
const { BackendError, BackendResponse } = require('../../components');
const { TokenService, UserService } = require('../../services');
const { TokenComponent } = require('../../components');

class AuthController {
  async register(req, res, next) {
    try {
      const {
        email,
        password,
        name,
        surname,
        username,
      } = req.body;

      const hashPassword = hashSync(password);

      const registeredUserUuid = await UserService.create({
        password: hashPassword,
        email,
        name,
        surname,
        username,
      });

      const token = await TokenComponent.issueTokenPair({
        uuid: registeredUserUuid,
        ip: req.ip,
      });

      return BackendResponse.Created(res, 'User successfully registered', token);
    } catch (e) {
      next(e);
    }
  }

  async login(req, res, next) {
    try {
      const { password: userInputPassword, email, username } = req.body;
      let user;

      if (email) {
        user = await UserService.getPasswordByEmail(email);
      } else {
        user = await UserService.getPasswordByUsername(username);
      }

      if (!user) {
        throw new BackendError.Forbidden('Email or password is wrong');
      }

      const { password, uuid } = user;

      if (!compareSync(userInputPassword, password)) {
        throw new BackendError.Forbidden('Email or password is wrong');
      }

      const tokens = await TokenComponent.issueTokenPair({
        uuid,
        ip: req.ip,
      });

      return BackendResponse.Success(res, 'Pair of tokens was generated', tokens);
    } catch (e) {
      next(e);
    }
  }

  async refresh(req, res, next) {
    try {
      const { refreshToken } = req.body;
      const pairTokens = await TokenService.findByRefreshToken(refreshToken);

      if (!pairTokens) {
        throw new BackendError.Forbidden(`Invalid refresh token: ${refreshToken}`);
      }

      const { uuid } = pairTokens;
      const [tokens, remove] = await Promise.all([
        TokenComponent.issueTokenPair({
          uuid,
          ip: req.ip,
        }),
        TokenService.removeByRefreshToken(refreshToken),
      ]);

      return BackendResponse.Success(res, 'Pair of tokens was refreshed', tokens);
    } catch (e) {
      next(e);
    }
  }

  async logout(req, res, next) {
    try {
      const { token } = req;
      const removeTokenPair = await TokenService.removeByToken(token);
      if (!removeTokenPair) {
        throw new BackendError.NotFound(`Logout failed. Token ${token} not found`);
      }
      return BackendResponse.Success(res, 'Success logout');
    } catch (e) {
      next(e);
    }
  }

  async me(req, res, next) {
    try {
      const { token } = req;
      const { uuid } = TokenComponent.verifyToken(token);
      const user = await UserService.getByUuid(uuid);
      if (!user) {
        throw new BackendError.NotFound('User not found');
      }
      return BackendResponse.Success(res, 'User successfully received', user);
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  AuthController: new AuthController(),
};
