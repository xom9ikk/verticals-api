const { Database } = require('../database');

class UserService extends Database {
  async create(user) {
    try {
      const [userId] = await this.users
        .insert(user)
        .returning('id');
      return userId;
    } catch (e) {
      if (e.code === '23505') {
        return undefined;
      }
      throw new Error(e);
    }
  }

  getById(id) {
    return this.users
      .select([
        'email',
        'name',
        'surname',
        'username',
      ])
      .where({
        id,
      })
      .first();
  }

  getByEmail(email) {
    return this.users
      .select([
        'email',
        'name',
        'surname',
        'username',
      ])
      .where({
        email,
      })
      .first();
  }

  getByUsername(username) {
    return this.users
      .select([
        'email',
        'name',
        'surname',
        'username',
      ])
      .where({
        username,
      })
      .first();
  }

  getUserWithPasswordByEmail(email) {
    return this.users
      .select([
        'id',
        'password',
      ])
      .where({
        email,
      })
      .first();
  }

  getUserWithPasswordByUsername(username) {
    return this.users
      .select([
        'id',
        'password',
      ])
      .where({
        username,
      })
      .first();
  }
}

module.exports = {
  UserService: new UserService(),
};
