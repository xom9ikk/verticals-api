const { Database } = require('../database');

class BoardService extends Database {
  async create(board) {
    const [boardId] = await this.boards
      .insert(board)
      .returning('id');
    return boardId;
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
    const [boardId] = await this.boards
      .where({
        id,
      })
      .update(board)
      .returning('id');
    return boardId;
  }

  removeById(boardId) {
    return this.boards
      .where({
        id: boardId,
      })
      .del();
  }
}

module.exports = {
  BoardService: new BoardService(),
};
