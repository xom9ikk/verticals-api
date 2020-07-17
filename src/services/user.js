const selectorAll = ['id', 'email', 'name', 'surname', 'username'];

class UserService {
  get DB() {
    return knex('users');
  }

  async create(user) {
    const response = await this.DB.insert(user).returning('id');
    return response[0];
  }

  getById(id) {
    console.log('get by id', id);
    return this.DB.select(selectorAll).where({
      id,
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

  getUserWithPasswordByEmail(email) {
    return this.DB.select(
      ['id', 'password'],
    ).where({
      email,
    }).first();
  }

  getUserWithPasswordByUsername(username) {
    return this.DB.select(
      ['id', 'password'],
    ).where({
      username,
    }).first();
  }
}

module.exports = {
  UserService: new UserService(),
};
