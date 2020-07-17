const selectorAll = ['uuid', 'email', 'name', 'surname', 'username'];

class UserService {
  get DB() {
    return knex('users');
  }

  async create(user) {
    const response = await this.DB.insert(user).returning('uuid');
    return response[0];
  }

  getByUuid(uuid) {
    return this.DB.select(selectorAll).where({
      uuid,
    }).first();
  }

  getByEmail(email) {
    return this.DB.select(selectorAll).where({
      email,
    }).first();
  }

  getByUsername(username) {
    return this.DB.select(selectorAll).where({
      username,
    }).first();
  }

  getPasswordByEmail(email) {
    return this.DB.select(
      ['uuid', 'password'],
    ).where({
      email,
    }).first();
  }

  getPasswordByUsername(username) {
    return this.DB.select(
      ['uuid', 'password'],
    ).where({
      username,
    }).first();
  }
}

module.exports = {
  UserService: new UserService(),
};
