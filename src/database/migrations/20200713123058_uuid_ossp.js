exports.up = (knex) => knex
  .raw('create extension if not exists "uuid-ossp"');
exports.down = (knex) => knex
  .raw('drop extension if exists "uuid-ossp"');
