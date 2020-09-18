const { Database } = require('../database');

class TodoPositionsService extends Database {
  async create(columnId, order) {
    const [response] = await this.todoPositions
      .insert({
        columnId,
        order,
      })
      .returning(['columnId', 'order']);
    return response;
  }

  async updatePositions(columnId, order) {
    const [response] = await this.todoPositions
      .where({
        columnId,
      })
      .update({ order })
      .returning(['columnId', 'order']);
    return response;
  }

  async getPositions(columnId) {
    const response = await this.todoPositions
      .select([
        'order',
      ])
      .where({
        columnId,
      })
      .first();
    return response ? response.order : [];
  }

  getPositionsByColumnIds(columnIds) {
    return this.todoPositions
      .select([
        'columnId',
        'order',
      ])
      .whereIn(
        'columnId',
        columnIds,
      );
  }
}

module.exports = {
  TodoPositionsService: new TodoPositionsService(),
};
