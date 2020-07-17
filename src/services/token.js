class TokenService {
  get DB() {
    return knex('tokens');
  }

  add({
    refreshToken, token, userId, ip,
  }) {
    return this.DB.insert({
      refresh_token: refreshToken,
      token,
      user_id: userId,
      ip,
    }).returning('*');
  }

  findByRefreshToken(refreshToken) {
    return this.DB.select('*').where({
      refresh_token: refreshToken,
    }).first();
  }

  findByToken(token) {
    return this.DB.select('*').where({
      token,
    }).first();
  }

  removeByRefreshToken(refreshToken) {
    return this.DB.where({
      refresh_token: refreshToken,
    }).del();
  }

  removeByToken(token) {
    return this.DB.where({
      token,
    }).del();
  }
}

module.exports = {
  TokenService: new TokenService(),
};
