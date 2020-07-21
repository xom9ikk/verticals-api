const tableName = 'tokens';

exports.seed = (knex) => knex(tableName)
  .del();
