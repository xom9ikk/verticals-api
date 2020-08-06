const jwt = require('jsonwebtoken');
const { v4: uuidV4 } = require('uuid');

const { JWT_EXPIRE, JWT_SECRET } = process.env;

class TokenComponent {
  async issueTokenPair(
    userId,
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
