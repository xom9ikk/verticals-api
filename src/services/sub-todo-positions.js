const { Database } = require('../database');

class SubTodoPositionsService extends Database {
  async create(todoId, order) {
    const [response] = await this.subTodoPositions
      .insert({
        todoId,
        order,
      })
      .returning(['todoId', 'order']);
    return response;
  }

  async updatePositions(todoId, order) {
    const [response] = await this.subTodoPositions
      .where({
        todoId,
      })
      .update({ order })
      .returning(['todoId', 'order']);
    return response;
  }

  async getPositions(todoId) {
    const response = await this.subTodoPositions
      .select([
        'order',
      ])
      .where({
        todoId,
      })
      .first();
    return response ? response.order : [];
  }

  getPositionsByTodoIds(todoIds) {
    return this.subTodoPositions
      .select([
        'todoId',
        'order',
      ])
      .whereIn(
        'todoId',
        todoIds,
      );
  }
}

module.exports = {
  SubTodoPositionsService: new SubTodoPositionsService(),
};
