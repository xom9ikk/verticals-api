const { Database } = require('../database');

class BoardAccessService extends Database {
  async create(userId, boardId) {
    const response = await this.boardsAccess
      .insert({
        userId,
        boardId,
      })
      .returning('id');
    return response[0];
  }

  get(userId, boardId) {
    return this.boardsAccess
      .select([
        'id',
        'userId',
        'boardId',
      ])
      .where({
        userId,
        boardId,
      })
      .first();
  }

  async getAllBoardIdsByUserId(userId) {
    const response = await this.boardsAccess
      .select([
        'boardId',
      ])
      .where({
        userId,
      });
    return response.map((row) => row.boardId);
  }

  removeByBoardId(boardId) {
    return this.boardsAccess
      .where({
        boardId,
      })
      .del();
  }
}

module.exports = {
  BoardAccessService: new BoardAccessService(),
};
