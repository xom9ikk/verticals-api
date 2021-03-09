const { CardType, Color } = require('../../constants');

class BoardSchema {
  createBoard = {
    type: 'object',
    properties: {
      icon: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      cardType: {
        type: 'integer',
        enum: Object.values(CardType),
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
      belowId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['icon', 'title'],
  }

  getBoard = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }

  patchBoardPosition = {
    type: 'object',
    properties: {
      sourcePosition: {
        type: 'integer',
        minimum: 0,
      },
      destinationPosition: {
        type: 'integer',
        minimum: 0,
      },
    },
    required: ['sourcePosition', 'destinationPosition'],
  }

  patchBoardBody = {
    type: 'object',
    properties: {
      icon: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 255,
      },
      cardType: {
        type: 'integer',
        enum: Object.values(CardType),
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
    },
    anyOf: [
      { required: ['icon'] },
      { required: ['title'] },
      { required: ['cardType'] },
      { required: ['description'] },
      { required: ['color'] },
    ],
  }

  patchBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }

  deleteBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
        minimum: 1,
      },
    },
    required: ['boardId'],
  }
}

module.exports = {
  BoardSchema: new BoardSchema(),
};
