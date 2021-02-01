class SearchSchema {
  searchInTodoQuery = {
    type: 'object',
    properties: {
      query: {
        type: 'string',
        maxLength: 255,
      },
    },
    required: ['query'],
  }
}

module.exports = {
  SearchSchema: new SearchSchema(),
};
