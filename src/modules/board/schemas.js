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
}

module.exports = {
  BoardSchema: new BoardSchema(),
};
