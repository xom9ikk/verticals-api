const { BackendResponse } = require('../../components');
const { BoardController } = require('./controller');

class BoardAdapter {
  async create(req, res, next) {
    try {
      const {
        title, position, cardType, description, color,
      } = req.body;
      const board = await BoardController.create({
        title, position, cardType, description, color,
      });
      return BackendResponse.Created(res, 'Board successfully created');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  BoardAdapter: new BoardAdapter(),
};
