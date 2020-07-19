class Database {
  constructor(tableName) {
    this.db = knex(tableName);
  }
}

module.exports = {
  Database,
};
