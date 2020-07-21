const jwt = require('jsonwebtoken');
const { v4: uuidV4 } = require('uuid');
const { TokenService } = require('../../src/services');

const { JWT_SECRET } = process.env;

class AuthMock {
  static async issueTokenPair({ userId, ip }, expiresIn) {
    const refreshToken = uuidV4();
    const token = jwt.sign(
      {
        userId,
        timestamp: new Date().getMilliseconds(),
      },
      JWT_SECRET,
      { expiresIn },
    );
    await TokenService.add({
      refreshToken,
      token,
      userId,
      ip,
    });
    return {
      token,
      refreshToken,
    };
  }

  static getInvalidRefreshToken() {
    return 'INVALID_REFRESH_TOKEN';
  }
}

module.exports = {
  AuthMock,
};
