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

  decreaseAfterPosition(boardIds, position) {
    return this.boards
      .whereIn(
        'id',
        boardIds,
      )
      .andWhere('position', '>', position)
      .decrement({
        position: 1,
      });
  }
}

module.exports = {
  BoardService: new BoardService(),
};
