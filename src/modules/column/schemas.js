class ColumnSchema {
  createColumn = {
    type: 'object',
    properties: {
      boardId: {
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
      color: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
      isCollapsed: {
        type: 'boolean',
      },
    },
    required: ['boardId', 'title', 'position'],
  }
  getColumn = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
      },
    },
    required: ['columnId'],
  }
  getColumnsQuery = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
    },
  }
  patchColumnBody = {
    type: 'object',
    properties: {
      boardId: {
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
      color: {
        type: 'number',
        enum: [0, 1, 2, 3, 4, 5, 6],
      },
      isCollapsed: {
        type: 'boolean',
      },
    },
    anyOf: [
      { required: ["boardId"] },
      { required: ["title"] },
      { required: ["position"] },
      { required: ["description"] },
      { required: ["color"] },
      { required: ["isCollapsed"] },
    ],
  }
  patchColumnParams = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
      },
    },
    required: ['columnId'],
  }
  deleteColumnParams = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
      },
    },
    required: ['columnId'],
  }
}

module.exports = {
  ColumnSchema: new ColumnSchema(),
};
