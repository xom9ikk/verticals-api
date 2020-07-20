class BoardSchema {
  createBoard = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 256,
      },
      position: {
        type: 'integer',
        minimum: 0,
      },
      cardType: {
        type: 'integer',
        enum: [0, 1, 2, 3, 4],
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
    },
    required: ['title', 'position'],
  }
  getBoard = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
    },
    required: ['boardId'],
  }
  patchBoardBody = {
    type: 'object',
    properties: {
      title: {
        type: 'string',
        minLength: 1,
        maxLength: 256,
      },
      position: {
        type: 'integer',
        minimum: 0,
      },
      cardType: {
        type: 'integer',
        enum: [0, 1, 2, 3, 4],
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
    },
    anyOf: [
      {
        required: [
          "title"
        ]
      },
      {
        required: [
          "position"
        ]
      },
      {
        required: [
          "cardType"
        ]
      },
      {
        required: [
          "description"
        ]
      },
      {
        required: [
          "color"
        ]
      },
    ]
  }
  patchBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
    },
    required: ['boardId'],
  }
  deleteBoardParams = {
    type: 'object',
    properties: {
      boardId: {
        type: 'integer',
      },
    },
    required: ['boardId'],
  }
}

module.exports = {
  BoardSchema: new BoardSchema(),
};
