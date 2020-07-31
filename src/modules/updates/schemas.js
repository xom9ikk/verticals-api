class WssUpdatesSchema {
  wsUpdateBoard = {
    type: 'object',
    properties: {
      a: {
        type: 'number',
        minimum: 0,
      },
      b: {
        type: 'number',
        minimum: 0,
      },
      c: {
        type: 'number',
        minimum: 0,
      },
    },
    required: ['a', 'b', 'c'],
  }
}

module.exports = {
  WssUpdatesSchema: new WssUpdatesSchema(),
};
