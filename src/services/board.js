const { Database } = require('../database');
const { tables } = require('../database/tables');

class BoardService extends Database {
  constructor() {
    super(tables.boards);
  }

  async create(board) {
    const response = await this.db
      .insert(board)
      .returning('id');
    return response[0];
  }

  getById(id) {
    return this.db
      .select(['id'])
      .where(
        { id },
      )
      .first();
  }

  async update(id, board) {
    const response = await this.db
      .where({ id })
      .update(board)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.db
      .where({ id })
      .del();
  }
}

module.exports = {
  BoardService: new BoardService(),
};
