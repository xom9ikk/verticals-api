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
      .select([
        'id',
        'title',
        'position',
        'cardType',
        'description',
        'color',
      ])
      .where(
        { id },
      )
      .first();
  }

  getByBoardIds(boardIds) {
    return this.db
      .select([
        'id',
        'title',
        'position',
        'cardType',
        'description',
        'color',
      ])
      .whereIn(
        'id',
        boardIds,
      );
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
