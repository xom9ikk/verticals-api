const { TokenComponent } = require('../../src/components');

class AuthMock {
  static getExpiredTokenPair(data) {
    return TokenComponent.issueTokenPair(data, '1ms');
  }

  static getTokenPairWithInvalidSignature(data) {
    return TokenComponent.issueTokenPair(data, '1Y', 'INVALID_SECRET');
  }

  static getInvalidRefreshToken() {
    return 'INVALID_REFRESH_TOKEN';
  }

  static getInvalidToken() {
    return 'INVALID_TOKEN';
  }
}

module.exports = {
  AuthMock,
};
