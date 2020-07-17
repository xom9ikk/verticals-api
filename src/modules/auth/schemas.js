class AuthSchema {
  register = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        lowercase: true,
        format: 'email',
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
      name: {
        type: 'string',
        minLength: 2,
        maxLength: 16,
        pattern: '^[A-Za-z0-9_]+$',
      },
      surname: {
        type: 'string',
        minLength: 2,
        maxLength: 16,
        pattern: '^[A-Za-z0-9_]+$',
      },
      username: {
        type: 'string',
        minLength: 2,
        maxLength: 16,
        pattern: '^[A-Za-z0-9_]+$',
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
        maxLength: 16,
        pattern: '^[A-Za-z0-9_]+$',
      },
      field: {
        type: 'string',
        minLength: 2,
        maxLength: 100,
      },
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
    },
    required: ['password'],
    anyOf: [
      {
        required: [
          "email"
        ]
      },
      {
        required: [
          "username"
        ]
      },
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

  passwordReset = {
    type: 'object',
    properties: {
      email: {
        type: 'string',
        lowercase: true,
        format: 'email',
      },
      target: {
        type: 'integer',
        enum: [0, 1, 2],
      },
    },
    required: ['email', 'target'],
  }

  passwordRecovery = {
    type: 'object',
    properties: {
      password: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
      hash: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['password', 'hash'],
  }

  passwordChange = {
    type: 'object',
    properties: {
      oldPassword: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
      newPassword: {
        type: 'string',
        minLength: 6,
        maxLength: 32,
      },
    },
    required: ['oldPassword', 'newPassword'],
  }

  confirmEmail = {
    type: 'object',
    properties: {
      hash: {
        type: 'string',
        minLength: 1,
      },
    },
    required: ['hash'],
  }
}

module.exports = {
  AuthSchema: new AuthSchema(),
};
