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
        'bio',
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
        'bio',
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
