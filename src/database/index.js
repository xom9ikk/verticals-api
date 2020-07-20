const { tables } = require('./tables');

class Database {
  get tokens() {
    return knex(tables.tokens);
  }

  get users() {
    return knex(tables.users);
  }

  get boards() {
    return knex(tables.boards);
  }

  get boardsAccess() {
    return knex(tables.boardsAccess);
  }

  get columns() {
    return knex(tables.columns);
  }

  get todos() {
    return knex(tables.todos);
  }
}

module.exports = {
  Database,
};
