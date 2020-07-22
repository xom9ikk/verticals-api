const tableName = 'users';

exports.seed = (knex) => knex(tableName)
  .del()
  .then(() => knex(tableName).insert([
    {
      email: 'test.email@test.test',
      password: '$2a$10$womuiqMqALCi2HLWdgL0KuW2x8dM2hm9ukBWyNKVughyVxi1JqjOC', // 123456
      name: 'test_name',
      surname: 'test_surname',
      username: 'test_username',
    },
  ]));
