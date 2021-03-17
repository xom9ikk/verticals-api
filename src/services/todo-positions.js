const { Database } = require('../database');

class TodoPositionsService extends Database {
  async create(headingId, order) {
    const [response] = await this.todoPositions
      .insert({
        headingId,
        order,
      })
      .returning(['headingId', 'order']);
    return response;
  }

  async updatePositions(headingId, order) {
    const [response] = await this.todoPositions
      .where({
        headingId,
      })
      .update({ order })
      .returning(['headingId', 'order']);
    return response;
  }

  async getPositions(headingId) {
    const response = await this.todoPositions
      .select([
        'order',
      ])
      .where({
        headingId,
      })
      .first();
    return response ? response.order : [];
  }

  getPositionsByHeadingIds(headingIds) {
    return this.todoPositions
      .select([
        'headingId',
        'order',
      ])
      .whereIn(
        'headingId',
        headingIds,
      );
  }
}

module.exports = {
  TodoPositionsService: new TodoPositionsService(),
};
