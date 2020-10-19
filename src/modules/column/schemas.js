const { Color } = require('../../enums');

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
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
      },
      color: {
        type: 'number',
        enum: Object.values(Color),
      },
      isCollapsed: {
        type: 'boolean',
      },
      belowId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId', 'title'],
  }

  getColumn = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['columnId'],
  }

  getColumnsQuery = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
  }

  patchColumnPositionBody = {
    type: 'object',
    properties: {
      boardId: {
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
    },
    required: ['boardId', 'sourcePosition', 'destinationPosition'],
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
      description: {
        type: 'string',
        minLength: 1,
        maxLength: 4096,
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
      isCollapsed: {
        type: 'boolean',
      },
    },
    anyOf: [
      { required: ['boardId'] },
      { required: ['title'] },
      { required: ['description'] },
      { required: ['color'] },
      { required: ['isCollapsed'] },
    ],
  }

  patchColumnParams = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['columnId'],
  }

  duplicateColumn = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['columnId'],
  }

  reverseOrder = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }

  deleteColumnParams = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['columnId'],
  }
}

module.exports = {
  ColumnSchema: new ColumnSchema(),
};
