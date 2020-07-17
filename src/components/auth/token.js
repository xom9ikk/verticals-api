const jwt = require('jsonwebtoken');
const { v4: uuidV4 } = require('uuid');
const { TokenService } = require('../../services');

const { JWT_EXPIRE, JWT_SECRET } = process.env;

class TokenComponent {
  constructor() {
    this.expiresIn = JWT_EXPIRE;
    this.secret = JWT_SECRET;
  }

  async issueTokenPair({ uuid, ip }) {
    const { expiresIn, secret } = this;
    const refreshToken = uuidV4();
    const token = jwt.sign(
      {
        uuid,
        timestamp: new Date().getMilliseconds(),
      },
      secret,
      { expiresIn },
    );
    await TokenService.add({
      refreshToken,
      token,
      uuid,
      ip,
    });
    return {
      token,
      refreshToken,
    };
  }

  verifyToken(token) {
    return jwt.verify(token, this.secret);
  }
}

module.exports = {
  TokenComponent: new TokenComponent(),
};
