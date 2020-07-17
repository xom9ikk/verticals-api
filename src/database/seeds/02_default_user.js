const tableName = 'users';

exports.seed = (knex) => knex(tableName)
  .del()
  .then(() => knex(tableName).insert([
    {
      email: 'xom9ik.code@gmail.com',
      password: '$2a$10$womuiqMqALCi2HLWdgL0KuW2x8dM2hm9ukBWyNKVughyVxi1JqjOC',
      name: 'Max',
      surname: 'Romanyuta',
      username: 'xom9ik',
    },
  ]));
