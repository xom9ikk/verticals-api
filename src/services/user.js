const { Database } = require('../database');

class UserService extends Database {
  async create(user) {
    const [userId] = await this.users
      .insert(user)
      .returning('id');
    return userId;
  }

  getById(id) {
    return this.users
      .select([
        'email',
        'name',
        'surname',
        'username',
        'bio',
        'avatar',
      ])
      .where({
        id,
      })
      .first();
  }

  async getPasswordById(id) {
    const response = await this.users
      .select([
        'password',
      ])
      .where({
        id,
      })
      .first();
    return response.password;
  }

  getByEmail(email) {
    return this.users
      .select([
        'email',
        'name',
        'surname',
        'username',
        'bio',
        'avatar',
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
        'bio',
        'avatar',
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

  async update(id, data) {
    const [userId] = await this.users
      .where({
        id,
      })
      .update(data)
      .returning('id');
    return userId;
  }
}

module.exports = {
  UserService: new UserService(),
};
