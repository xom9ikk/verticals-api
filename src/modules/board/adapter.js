const { BackendResponse } = require('../../components');
const { BoardController } = require('./controller');

class BoardAdapter {
  async create(req, res, next) {
    try {
      const {
        title, position, cardType, description, color,
      } = req.body;
      await BoardController.create({
        title, position, cardType, description, color,
      });
      return BackendResponse.Created(res, 'Board successfully created');
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { user: { id: userId } } = res.locals;
      const {
        title, position, cardType, description, color,
      } = req.body;
      const { boardId } = req.params;

      await BoardController.update({
        userId,
        boardId,
        patch: {
          title,
          position,
          cardType,
          description,
          color,
        },
      });

      return BackendResponse.Created(res, 'Board successfully updated');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  BoardAdapter: new BoardAdapter(),
};
