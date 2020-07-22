const jwt = require('jsonwebtoken');
const { v4: uuidV4 } = require('uuid');
const { TokenService } = require('../../services');

const { JWT_EXPIRE, JWT_SECRET } = process.env;

class TokenComponent {
  async issueTokenPair(
    { userId, ip },
    expiresIn = JWT_EXPIRE,
    secret = JWT_SECRET,
  ) {
    const refreshToken = uuidV4();
    const token = jwt.sign(
      {
        userId,
        timestamp: new Date().getMilliseconds(),
      },
      secret,
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

  verifyToken(token, secret = JWT_SECRET) {
    return jwt.verify(token, secret);
  }
}

module.exports = {
  TokenComponent: new TokenComponent(),
};
