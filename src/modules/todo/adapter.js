const { BackendResponse } = require('../../components');
const { TodoController } = require('./controller');

class TodoAdapter {
  async create(req, res, next) {
    try {
      const { userId } = res.locals;
      const todoId = await TodoController.create(userId, req.body);
      return BackendResponse.Created(res, 'Todo successfully created', { todoId });
    } catch (e) {
      next(e);
    }
  }

  async get(req, res, next) {
    try {
      const { userId } = res.locals;
      const { todoId } = req.params;
      const todo = await TodoController.get(userId, todoId);
      return BackendResponse.Success(res, 'Todo information successfully received', todo);
    } catch (e) {
      next(e);
    }
  }

  async getAll(req, res, next) {
    try {
      const { userId } = res.locals;
      const { boardId, columnId } = req.query;
      const todos = await TodoController.getAll(userId, boardId, columnId);
      return BackendResponse.Success(res, 'Todos information successfully received', { todos });
    } catch (e) {
      next(e);
    }
  }

  async update(req, res, next) {
    try {
      const { userId } = res.locals;
      const { todoId } = req.params;

      await TodoController.update({
        userId,
        todoId,
        patch: req.body,
      });

      return BackendResponse.Success(res, 'Todo successfully updated');
    } catch (e) {
      next(e);
    }
  }

  async remove(req, res, next) {
    try {
      const { userId } = res.locals;
      const { todoId } = req.params;

      await TodoController.remove({
        userId,
        todoId,
      });

      return BackendResponse.Success(res, 'Todo successfully removed');
    } catch (e) {
      next(e);
    }
  }
}

module.exports = {
  TodoAdapter: new TodoAdapter(),
};
