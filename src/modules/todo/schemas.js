const { Color, TodoStatus } = require('../../enums');

class TodoSchema {
  createTodo = {
    type: 'object',
    properties: {
      columnId: {
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
        minLength: 1,
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
      isArchived: {
        type: 'boolean',
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
      belowId: {
        type: 'integer',
        minimum: 1,
      },
      expirationDate: {
        type: 'string',
        format: 'date-time',
      },
    },
    required: ['columnId', 'title'],
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
      columnId: {
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
      targetColumnId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['columnId', 'sourcePosition', 'destinationPosition'],
  }

  patchTodoBody = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      description: {
        type: 'string',
        minLength: 1,
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
      isArchived: {
        type: 'boolean',
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
      { required: ['title'] },
      { required: ['description'] },
      { required: ['status'] },
      { required: ['color'] },
      { required: ['isArchived'] },
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
}

module.exports = {
  TodoSchema: new TodoSchema(),
};
