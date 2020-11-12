const { BackendResponse } = require('../../components');
const { SearchController } = require('./controller');

class SearchAdapter {
  async searchInTodo(req, res) {
    const { userId } = req;
    const { query } = req.query;
    const data = await SearchController.searchInTodo({ userId, query });
    return BackendResponse.Success(res, 'Search in todos was successful', data);
  }
}

module.exports = {
  SearchAdapter: new SearchAdapter(),
};
