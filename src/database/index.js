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

  get headings() {
    return knex(tables.headings);
  }

  get todos() {
    return knex(tables.todos);
  }

  get comments() {
    return knex(tables.comments);
  }

  get commentFiles() {
    return knex(tables.commentFiles);
  }

  get boardPositions() {
    return knex(tables.boardPositions);
  }

  get columnPositions() {
    return knex(tables.columnPositions);
  }

  get headingPositions() {
    return knex(tables.headingPositions);
  }

  get todoPositions() {
    return knex(tables.todoPositions);
  }

  get commentLikes() {
    return knex(tables.commentLikes);
  }
}

module.exports = {
  Database,
};
