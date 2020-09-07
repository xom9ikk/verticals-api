require('dotenv').config();

const {
  DB_HOST,
  DB_PORT,
  POSTGRES_DB,
  POSTGRES_USER,
  POSTGRES_PASSWORD,
  DB_POOL_MIN,
  DB_POOL_MAX,
} = process.env;

module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    },
    pool: {
      min: parseInt(DB_POOL_MIN),
      max: parseInt(DB_POOL_MAX),
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  test: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    },
    pool: {
      min: parseInt(DB_POOL_MIN),
      max: parseInt(DB_POOL_MAX),
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: DB_HOST,
      port: DB_PORT,
      database: POSTGRES_DB,
      user: POSTGRES_USER,
      password: POSTGRES_PASSWORD,
    },
    pool: {
      min: parseInt(DB_POOL_MIN),
      max: parseInt(DB_POOL_MAX),
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
