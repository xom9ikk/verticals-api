const { BackendError } = require('../../components');

class BoardController {
  async create({
    title, position, cardType, description, color,
  }) {
    // TODO:
  }
}

module.exports = {
  BoardController: new BoardController(),
};
