const { Database } = require('../database');

class TokenService extends Database {
  create(pairTokens) {
    return this.tokens
      .insert(pairTokens)
      .returning('*');
  }

  getByRefreshToken(refreshToken) {
    return this.tokens
      .select('*')
      .where({
        refreshToken,
      })
      .first();
  }

  getByToken(token) {
    return this.tokens
      .select('*')
      .where({
        token,
      })
      .first();
  }

  removeByRefreshToken(refreshToken) {
    return this.tokens
      .where({
        refreshToken,
      })
      .del();
  }

  removeByToken(token) {
    return this.tokens
      .where({
        token,
      })
      .del();
  }
}

module.exports = {
  TokenService: new TokenService(),
};
