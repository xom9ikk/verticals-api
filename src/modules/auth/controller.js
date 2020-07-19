const { compare, hash } = require('bcryptjs');
const { BackendError, TokenComponent } = require('../../components');
const { TokenService, UserService } = require('../../services');

class AuthController {
  async register({
    email, password, name, surname, username, ip,
  }) {
    const hashPassword = await hash(password, 10);

    const registeredUserId = await UserService.create({
      password: hashPassword, email, name, surname, username,
    });

    const tokens = await TokenComponent.issueTokenPair({
      userId: registeredUserId,
      ip,
    });
    return tokens;
  }

  async login({
    userInputPassword, email, username, ip,
  }) {
    let user;

    if (email) {
      user = await UserService.getUserWithPasswordByEmail(email);
    } else {
      user = await UserService.getUserWithPasswordByUsername(username);
    }

    if (!user) {
      throw new BackendError.Forbidden('Email or password is wrong');
    }

    const { password, id: userId } = user;

    const isValidPassword = await compare(userInputPassword, password);

    if (!isValidPassword) {
      throw new BackendError.Forbidden('Email or password is wrong');
    }

    const tokens = await TokenComponent.issueTokenPair({
      userId, ip,
    });
    return tokens;
  }

  async refresh({ refreshToken, ip }) {
    const pairTokens = await TokenService.getByRefreshToken(refreshToken);

    if (!pairTokens) {
      throw new BackendError.Forbidden(`Invalid refresh token: ${refreshToken}`);
    }

    const { userId } = pairTokens;
    const [tokens] = await Promise.all([
      TokenComponent.issueTokenPair({
        userId,
        ip,
      }),
      TokenService.removeByRefreshToken(refreshToken),
    ]);
    return tokens;
  }

  async logout({ token }) {
    const removeTokenPair = await TokenService.removeByToken(token);
    if (!removeTokenPair) {
      throw new BackendError.NotFound(`Logout failed. Token ${token} not found`);
    }
    return true;
  }

  async me({ userId }) {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new BackendError.NotFound('User not found');
    }
    return user;
  }
}

module.exports = {
  AuthController: new AuthController(),
};
