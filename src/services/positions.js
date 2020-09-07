const { Database } = require('../database');

class PositionsService extends Database {
  async create(userId, positions) {
    const [response] = await this.positions
      .insert({
        userId,
        ...positions,
      })
      .returning(['userId', 'boards', 'columns', 'todos']);
    return response;
  }

  async updateBoardPositions(userId, boards) {
    const [response] = await this.positions
      .where({
        userId,
      })
      .update({ boards })
      .returning(['userId', 'boards']);
    return response;
  }

  async updateColumnPositions(userId, columns) {
    const [response] = await this.positions
      .where({
        userId,
      })
      .update({ columns })
      .returning(['userId', 'columns']);
    return response;
  }

  async updateTodoPositions(userId, todos) {
    const [response] = await this.positions
      .where({
        userId,
      })
      .update({ todos })
      .returning(['userId', 'todos']);
    return response;
  }

  async getBoardPositions(userId) {
    const response = await this.positions
      .select([
        'boards',
      ])
      .where({
        userId,
      })
      .first();
    return response.boards;
  }

  async getColumnPositions(userId) {
    const response = await this.positions
      .select([
        'columns',
      ])
      .where({
        userId,
      })
      .first();
    return response.columns;
  }

  async getTodoPositions(userId) {
    const response = await this.positions
      .select([
        'todos',
      ])
      .where({
        userId,
      })
      .first();
    return response.todos;
  }
}

module.exports = {
  PositionsService: new PositionsService(),
};
