const { Database } = require('../database');

class BoardService extends Database {
  async create(board) {
    const response = await this.boards
      .insert(board)
      .returning('id');
    return response[0];
  }

  getById(id) {
    return this.boards
      .select([
        'id',
        'title',
        'position',
        'cardType',
        'description',
        'color',
      ])
      .where({
        id,
      })
      .first();
  }

  getByBoardIds(boardIds) {
    return this.boards
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
    const response = await this.boards
      .where({
        id,
      })
      .update(board)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.boards
      .where({
        id,
      })
      .del();
  }
}

module.exports = {
  BoardService: new BoardService(),
};
