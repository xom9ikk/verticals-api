const { Database } = require('../database');
const { tables } = require('../database/tables');

class BoardAccessService extends Database {
  constructor() {
    super(tables.boardsAccess);
  }

  async create(userId, boardId) {
    const response = await this.db
      .insert({ userId, boardId })
      .returning('id');
    return response[0];
  }

  get(userId, boardId) {
    return this.db
      .select(['id', 'userId', 'boardId'])
      .where({
        userId,
        boardId,
      })
      .first();
  }

  async getAllBoardIdsByUserId(userId) {
    const response = await this.db
      .select(['boardId'])
      .where({
        userId,
      });
    return response.map((row) => row.boardId);
  }

  removeByBoardId(boardId) {
    return this.db
      .where({ boardId })
      .del();
  }
}

module.exports = {
  BoardAccessService: new BoardAccessService(),
};
