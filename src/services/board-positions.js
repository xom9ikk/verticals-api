const { Database } = require('../database');

class BoardPositionsService extends Database {
  async create(userId, order) {
    const [response] = await this.boardPositions
      .insert({
        userId,
        order,
      })
      .returning(['userId', 'order']);
    return response;
  }

  async updatePositions(userId, order) {
    const [response] = await this.boardPositions
      .where({
        userId,
      })
      .update({ order })
      .returning(['userId', 'order']);
    return response;
  }

  async getPositions(userId) {
    const response = await this.boardPositions
      .select([
        'order',
      ])
      .where({
        userId,
      })
      .first();
    console.log('getPositions', response);
    return response ? response.order : [];
  }
}

module.exports = {
  BoardPositionsService: new BoardPositionsService(),
};
