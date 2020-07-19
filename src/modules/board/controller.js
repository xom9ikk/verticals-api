const { BoardService } = require('../../services');

class BoardController {
  async create(board) {
    await BoardService.create(board);
  }

  async update({ userId, boardId, patch }) {
    console.log(patch);
  }
}

module.exports = {
  BoardController: new BoardController(),
};
