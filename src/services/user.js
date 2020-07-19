const { Database } = require('../database');
const { tables } = require('../database/tables');

const selectorAll = ['email', 'name', 'surname', 'username'];

class UserService extends Database {
  constructor() {
    super(tables.users);
  }

  async create(user) {
    const response = await this.db
      .insert(user)
      .returning('id');
    return response[0];
  }

  getById(id) {
    return this.db
      .select(selectorAll)
      .where({
        id,
      })
      .first();
  }

  getByEmail(email) {
    return this.db
      .select(selectorAll)
      .where({
        email,
      })
      .first();
  }

  getByUsername(username) {
    return this.db
      .select(selectorAll)
      .where({
        username,
      })
      .first();
  }

  getUserWithPasswordByEmail(email) {
    console.log(this.db.select(
      ['id', 'password'],
    )
      .where({
        email,
      })
      .first().toSQL()
      .toNative());
    return this.db.select(
      ['id', 'password'],
    )
      .where({
        email,
      })
      .first();
  }

  getUserWithPasswordByUsername(username) {
    return this.db
      .select(
        ['id', 'password'],
      )
      .where({
        username,
      })
      .first();
  }
}

module.exports = {
  UserService: new UserService(),
};
