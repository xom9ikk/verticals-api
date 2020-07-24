module.exports = {
  development: {
    client: 'pg',
    connection: {
      host: '0.0.0.0',
      database: 'verticals',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 10000,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  // test: {
  //   client: 'sqlite3',
  //   connection: ':memory:',
  //   migrations: {
  //     tableName: 'knex_migrations',
  //   },
  // },

  test: {
    client: 'pg',
    connection: {
      host: '0.0.0.0',
      database: 'verticals_test',
      port: 5432,
    },
    pool: {
      min: 2,
      max: 100000,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },

  production: {
    client: 'pg',
    connection: {
      host: 'verticals_backend_postgresql',
      port: 5432,
      database: 'verticals',
      user: 'prod_user',
      password: 'prod_password_uygf2836gyi',
    },
    pool: {
      min: 2,
      max: 10,
    },
    migrations: {
      tableName: 'knex_migrations',
    },
  },
};
