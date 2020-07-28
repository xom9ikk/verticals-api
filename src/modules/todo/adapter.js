const { BackendResponse } = require('../../components');
const { TodoController } = require('./controller');

class TodoAdapter {
  async create(req, res) {
    const { userId } = req;
    const todoId = await TodoController.create(userId, req.body);
    return BackendResponse.Created(res, 'Todo successfully created', { todoId });
  }

  async get(req, res) {
    const { userId } = req;
    const { todoId } = req.params;
    const todo = await TodoController.get(userId, todoId);
    return BackendResponse.Success(res, 'Todo information successfully received', todo);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId } = req.query;
    const todos = await TodoController.getAll(userId, boardId, columnId);
    return BackendResponse.Success(res, 'Todos information successfully received', { todos });
  }

  async update(req, res) {
    const { userId } = req;
    const { todoId } = req.params;

    await TodoController.update({
      userId,
      todoId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Todo successfully updated');
  }

  async remove(req, res) {
    const { userId } = req;
    const { todoId } = req.params;

    await TodoController.remove({
      userId,
      todoId,
    });

    return BackendResponse.Success(res, 'Todo successfully removed');
  }
}

module.exports = {
  TodoAdapter: new TodoAdapter(),
};
