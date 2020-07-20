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
      position: {
        type: 'integer',
        minimum: 0,
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      status: {
        type: 'number',
        enum: [0, 1, 2],
      },
      color: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
      isArchived: {
        type: 'boolean',
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
    },
    required: ['columnId', 'title', 'position'],
  }
  getTodo = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
      },
    },
    required: ['todoId'],
  }
  getTodosQuery = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
      columnId: {
        type: 'integer',
      },
    },
  }
  patchTodoBody = {
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
      position: {
        type: 'integer',
        minimum: 0,
      },
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      status: {
        type: 'number',
        enum: [0, 1, 2],
      },
      color: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
      isArchived: {
        type: 'boolean',
      },
      isNotificationsEnabled: {
        type: 'boolean',
      },
    },
    anyOf: [
      { required: ["columnId"] },
      { required: ["title"] },
      { required: ["position"] },
      { required: ["description"] },
      { required: ["status"] },
      { required: ["color"] },
      { required: ["isArchived"] },
      { required: ["isNotificationsEnabled"] },
    ],
  }
  patchTodoParams = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
      },
    },
    required: ['todoId'],
  }
  deleteTodoParams = {
    type: 'object',
    properties: {
      todoId: {
        type: 'integer',
      },
    },
    required: ['todoId'],
  }
}

module.exports = {
  TodoSchema: new TodoSchema(),
};
