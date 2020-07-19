class TokenService {
  constructor() {
    this.db = knex('tokens');
  }

  add(pairTokens) {
    return this.db
      .insert(pairTokens)
      .returning('*');
  }

  getByRefreshToken(refreshToken) {
    return this.db
      .select('*')
      .where({
        refreshToken,
      })
      .first();
  }

  getByToken(token) {
    return this.db
      .select('*')
      .where({
        token,
      })
      .first();
  }

  removeByRefreshToken(refreshToken) {
    return this.db
      .where({
        refreshToken,
      })
      .del();
  }

  removeByToken(token) {
    return this.db
      .where({
        token,
      })
      .del();
  }
}

module.exports = {
  TokenService: new TokenService(),
};
