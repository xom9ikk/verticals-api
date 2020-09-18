const { BackendResponse } = require('../../components');
const { TodoController } = require('./controller');

class TodoAdapter {
  async create(req, res) {
    const { userId } = req;

    const todo = await TodoController.create(userId, req.body);

    return BackendResponse.Created(res, 'Todo successfully created', todo);
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

  async updatePosition(req, res) {
    const { columnId, sourcePosition, destinationPosition } = req.body;

    await TodoController.updatePosition({
      columnId,
      sourcePosition,
      destinationPosition,
    });

    return BackendResponse.Success(res, 'Todo position successfully updated');
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

  async duplicate(req, res) {
    const { userId } = req;
    const { todoId } = req.body;

    const todo = await TodoController.duplicate({ userId, todoId });

    return BackendResponse.Success(res, 'Todo successfully duplicated', todo);
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
