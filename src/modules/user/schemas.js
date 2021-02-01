class UserSchema {
  patchUserBody = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        lowercase: true,
        format: 'email',
        maxLength: 64,
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
      username: {
        type: 'string',
        minLength: 2,
        maxLength: 32,
        pattern: '^[A-Za-z0-9_.]+$',
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 32,
        pattern: '^[A-Za-z0-9_]+$',
      },
      surname: {
        type: 'string',
        minLength: 2,
        maxLength: 32,
        pattern: '^[A-Za-z0-9_]+$',
      },
      bio: {
        oneOf: [
          {
            type: 'string',
            minLength: 2,
            maxLength: 255,
          },
          { type: 'null' },
        ],
      },
    },
    anyOf: [
      { required: ['email'] },
      { required: ['password'] },
      { required: ['username'] },
      { required: ['name'] },
      { required: ['surname'] },
      { required: ['bio'] },
    ],
  }
}

module.exports = {
  UserSchema: new UserSchema(),
};
