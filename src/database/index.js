class Database {
  constructor(tableName) {
    this.tableName = tableName;
  }

  get db() {
    return knex(this.tableName);
  }
}

module.exports = {
  Database,
};
