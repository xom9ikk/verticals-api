const { Database } = require('../database');

class ColumnPositionsService extends Database {
  async create(boardId, order) {
    const [response] = await this.columnPositions
      .insert({
        boardId,
        order,
      })
      .returning(['boardId', 'order']);
    return response;
  }

  async updatePositions(boardId, order) {
    const [response] = await this.columnPositions
      .where({
        boardId,
      })
      .update({ order })
      .returning(['boardId', 'order']);
    return response;
  }

  async getPositions(boardId) {
    const response = await this.columnPositions
      .select([
        'order',
      ])
      .where({
        boardId,
      })
      .first();
    return response ? response.order : [];
  }
}

module.exports = {
  ColumnPositionsService: new ColumnPositionsService(),
};
