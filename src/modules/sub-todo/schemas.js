const { Color, TodoStatus } = require('../../constants');

class SubTodoSchema {
  createSubTodo = {
    type: 'object',
    properties: {
      todoId: {
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
    required: ['todoId', 'title'],
  }

  getSubTodo = {
    type: 'object',
    properties: {
      subTodoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['subTodoId'],
  }

  getSubTodosQuery = {
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

  patchSubTodoPositionBody = {
    type: 'object',
    properties: {
      todoId: {
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
      targetTodoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['todoId', 'sourcePosition', 'destinationPosition'],
  }

  patchSubTodoBody = {
    type: 'object',
    properties: {
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
      { required: ['title'] },
      { required: ['description'] },
      { required: ['status'] },
      { required: ['color'] },
      { required: ['isNotificationsEnabled'] },
      { required: ['expirationDate'] },
    ],
  }

  patchSubTodoParams = {
    type: 'object',
    properties: {
      subTodoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['subTodoId'],
  }

  duplicateSubTodo = {
    type: 'object',
    properties: {
      subTodoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['subTodoId'],
  }

  deleteSubTodoParams = {
    type: 'object',
    properties: {
      subTodoId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['subTodoId'],
  }
}

module.exports = {
  SubTodoSchema: new SubTodoSchema(),
};
