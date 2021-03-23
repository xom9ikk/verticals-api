const { BackendResponse } = require('../../components');
const { SubTodoController } = require('./controller');

class SubTodoAdapter {
  async create(req, res) {
    const { userId } = req;

    const todo = await SubTodoController.create(userId, req.body);

    return BackendResponse.Created(res, 'Subtodo successfully created', todo);
  }

  async get(req, res) {
    const { userId } = req;
    const { subTodoId } = req.params;

    const todo = await SubTodoController.get(userId, subTodoId);

    return BackendResponse.Success(res, 'Subtodo information successfully received', todo);
  }

  async getAll(req, res) {
    const { userId } = req;
    const { boardId, columnId } = req.query;

    const subTodos = await SubTodoController.getAll(userId, boardId, columnId);

    return BackendResponse.Success(res, 'Subtodos information successfully received', { subTodos });
  }

  async updatePosition(req, res) {
    const { userId } = req;
    const {
      todoId, sourcePosition, destinationPosition, targetHeadingId,
    } = req.body;

    await SubTodoController.updatePosition({
      userId,
      todoId,
      sourcePosition,
      destinationPosition,
      targetHeadingId,
    });

    return BackendResponse.Success(res, 'Subtodo position successfully updated');
  }

  async update(req, res) {
    const { userId } = req;
    const { subTodoId } = req.params;

    await SubTodoController.update({
      userId,
      subTodoId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'Subtodo successfully updated');
  }

  async duplicate(req, res) {
    const { userId } = req;
    const { subTodoId } = req.body;

    const subTodo = await SubTodoController.duplicate({ userId, subTodoId });

    return BackendResponse.Success(res, 'Subtodo successfully duplicated', subTodo);
  }

  async remove(req, res) {
    const { userId } = req;
    const { subTodoId } = req.params;

    await SubTodoController.remove({
      userId,
      subTodoId,
    });

    return BackendResponse.Success(res, 'Subtodo successfully removed');
  }
}

module.exports = {
  SubTodoAdapter: new SubTodoAdapter(),
};
