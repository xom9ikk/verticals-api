const { Color, TodoStatus } = require('../../constants');

class TodoSchema {
  createTodo = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      description: {
        type: 'string',
        minLength: 0,
        maxLength: 4096,
      },
      status: {
        type: 'number',
        enum: Object.values(TodoStatus),
      },
      color: {
        type: 'number',
        enum: Object.values(Color),
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
      belowId: {
        type: 'integer',
        minimum: 1,
      },
      expirationDate: {
        oneOf: [
          {
            type: 'string',
            format: 'date-time',
          },
          { type: 'null' },
        ],
      },
    },
    required: ['headingId', 'title'],
  }

  getTodo = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }

  getTodosQuery = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
  }

  patchTodoPositionBody = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
      sourcePosition: {
        type: 'integer',
        minimum: 0,
      },
      destinationPosition: {
        type: 'integer',
        minimum: 0,
      },
      targetHeadingId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['headingId', 'sourcePosition', 'destinationPosition'],
  }

  patchTodoBody = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      description: {
        type: 'string',
        minLength: 0,
        maxLength: 4096,
      },
      status: {
        type: 'number',
        enum: Object.values(TodoStatus),
      },
      color: {
        oneOf: [
          {
            type: 'number',
            enum: Object.values(Color),
          },
          { type: 'null' },
        ],
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
      expirationDate: {
        oneOf: [
          {
            type: 'string',
            format: 'date-time',
          },
          { type: 'null' },
        ],
      },
    },
    anyOf: [
      { required: ['headingId'] },
      { required: ['title'] },
      { required: ['description'] },
      { required: ['status'] },
      { required: ['color'] },
      { required: ['isNotificationsEnabled'] },
      { required: ['expirationDate'] },
    ],
  }

  patchTodoParams = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }

  duplicateTodo = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }

  deleteTodoParams = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }

  switchArchived = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }

  switchRemoved = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId'],
  }
}

module.exports = {
  TodoSchema: new TodoSchema(),
};
