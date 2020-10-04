class AuthSchema {
  register = {
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
      username: {
        type: 'string',
        minLength: 2,
        maxLength: 32,
        pattern: '^[A-Za-z0-9_.]+$',
      },
    },
    required: ['email', 'password', 'name', 'surname', 'username'],
  }
  login = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        lowercase: true,
        format: 'email',
      },
      username: {
        type: 'string',
        minLength: 2,
        maxLength: 32,
        pattern: '^[A-Za-z0-9_.]+$',
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
    },
    required: ['password'],
    anyOf: [
      { required: ["email"] },
      { required: ["username"] },
    ]
  }
  refresh = {
    type: 'object',
    properties: {
      refreshToken: {
        type: 'string',
      },
    },
    required: ['refreshToken'],
  }
}

module.exports = {
  AuthSchema: new AuthSchema(),
};
