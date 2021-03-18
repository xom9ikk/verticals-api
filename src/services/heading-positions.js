const { Database } = require('../database');

class HeadingPositionsService extends Database {
  async create(columnId, order) {
    const [response] = await this.headingPositions
      .insert({
        columnId,
        order,
      })
      .returning(['columnId', 'order']);
    return response;
  }

  async updatePositions(columnId, order) {
    const [response] = await this.headingPositions
      .where({
        columnId,
      })
      .update({ order })
      .returning(['columnId', 'order']);
    return response;
  }

  async getPositions(columnId) {
    const response = await this.headingPositions
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
    return this.headingPositions
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
  HeadingPositionsService: new HeadingPositionsService(),
};
