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
        'position',
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

  update(id, board) {
    return {
      then: async (resolve) => {
        const [boardId] = await this.boards
          .where({
            id,
          })
          .update(board)
          .returning('id');
        return resolve(boardId);
      },
    };
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
