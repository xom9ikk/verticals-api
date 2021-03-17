const { Color } = require('../../constants');

class HeadingSchema {
  createHeading = {
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
        minLength: 0,
        maxLength: 4096,
      },
      color: {
        type: 'number',
        enum: Object.values(Color),
      },
      isCollapsed: {
        type: 'boolean',
      },
    },
    required: ['columnId', 'title'],
  }

  getHeading = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['headingId'],
  }

  getHeadingsQuery = {
    type: 'object',
    properties: {
      columnId: {
        type: 'integer',
        minimum: 1,
      },
    },
  }

  patchHeadingPositionBody = {
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
        minimum: 0,
      },
    },
    required: ['columnId', 'sourcePosition', 'destinationPosition'],
  }

  patchHeadingBody = {
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
        minLength: 0,
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
      { required: ['columnId'] },
      { required: ['title'] },
      { required: ['description'] },
      { required: ['color'] },
      { required: ['isCollapsed'] },
    ],
  }

  patchHeadingParams = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['headingId'],
  }

  duplicateHeading = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['headingId'],
  }

  deleteHeadingParams = {
    type: 'object',
    properties: {
      headingId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['headingId'],
  }
}

module.exports = {
  HeadingSchema: new HeadingSchema(),
};
