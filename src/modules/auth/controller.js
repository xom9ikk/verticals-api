const { BackendError, PasswordComponent, TokenComponent } = require('../../components');
const { BoardController } = require('../board/controller');
const {
  TokenService, UserService, BoardPositionsService,
} = require('../../services');

class AuthController {
  async register({
    email, password, name, surname, username, ip,
  }) {
    const hashPassword = await PasswordComponent.hash(password);

    const registeredUserId = await UserService.create({
      password: hashPassword, email, name, surname, username,
    });

    const tokens = await TokenComponent.issueTokenPair(registeredUserId);

    await TokenService.create({
      ...tokens,
      userId: registeredUserId,
      ip,
    });

    await Promise.all([
      BoardPositionsService.create(registeredUserId, []),
      // TODO: move to seed component
      BoardController.create(registeredUserId, {
        icon: '/assets/svg/board/star.svg',
        title: 'Today',
      }),
    ]);

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

    const isValidPassword = await PasswordComponent.compare(userInputPassword, password);

    if (!isValidPassword) {
      throw new BackendError.Forbidden('Email or password is wrong');
    }

    const tokens = await TokenComponent.issueTokenPair(userId);

    await TokenService.create({
      ...tokens,
      userId,
      ip,
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
      TokenComponent.issueTokenPair(userId),
      TokenService.removeByRefreshToken(refreshToken),
    ]);

    await TokenService.create({
      ...tokens,
      userId,
      ip,
    });

    return tokens;
  }

  async logout({ token }) {
    const removeTokenPair = await TokenService.removeByToken(token);
    if (!removeTokenPair) {
      throw new BackendError.NotFound(`Logout failed. Token ${token} not found`);
    }
    return true;
  }

  async changePassword({ userId, oldPassword, newPassword }) {
    const { password } = await UserService.getPasswordById(userId);

    const isValidPassword = await PasswordComponent.compare(oldPassword, password);

    if (!isValidPassword) {
      throw new BackendError.Forbidden('Old password is wrong');
    }

    const hashPassword = await PasswordComponent.hash(newPassword);

    await UserService.update(userId, { password: hashPassword });

    return true;
  }
}

module.exports = {
  AuthController: new AuthController(),
};
