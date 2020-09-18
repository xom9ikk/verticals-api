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
        'cardType',
        'description',
        'color',
        'icon',
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
        'cardType',
        'description',
        'color',
        'icon',
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

  async removeById(boardId) {
    const [removedBoard] = await this.boards
      .where({
        id: boardId,
      })
      .returning([
        'id',
        'title',
        'cardType',
        'description',
        'color',
        'icon',
      ])
      .del();
    return removedBoard;
  }
}

module.exports = {
  BoardService: new BoardService(),
};
