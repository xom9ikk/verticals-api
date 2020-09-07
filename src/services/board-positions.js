const { Database } = require('../database');

class BoardPositionsService extends Database {
  async create(userId, positions) {
    const [response] = await this.boardPositions
      .insert({
        userId,
        positions,
      })
      .returning(['userId', 'positions']);
    return response;
  }

  async update(userId, positions) {
    const [response] = await this.boardPositions
      .where({
        userId,
      })
      .update({ positions })
      .returning(['userId', 'positions']);
    return response;
  }

  async getByUserId(userId) {
    const response = await this.boardPositions
      .select([
        'positions',
      ])
      .where({
        userId,
      })
      .first();
    return response.positions;
  }
}

module.exports = {
  BoardPositionsService: new BoardPositionsService(),
};
