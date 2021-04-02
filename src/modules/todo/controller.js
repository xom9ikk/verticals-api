/* eslint-disable no-restricted-syntax */
const {
  TodoService, HeadingService, BoardAccessService, TodoPositionsService, SubTodoPositionsService,
} = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');
const { HeadingType } = require('../../constants');
const { SubTodoController } = require('../sub-todo/controller');

class TodoController {
  async create(userId, { belowId, ...todo }) {
    if (belowId) {
      const isAccessToBelowTodoId = await BoardAccessService.getByTodoId(userId, belowId);
      if (!isAccessToBelowTodoId) {
        throw new BackendError.Forbidden('This account is not allowed to create todo below this todo');
      }
    }

    const { headingId } = todo;
    const isAccess = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create todo for this heading');
    }

    const todoId = await TodoService.create(todo);

    const todoPositions = await TodoPositionsService.getPositions(headingId);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(todoPositions, todoId, belowId);

    await TodoPositionsService.updatePositions(headingId, newPositions);
    await SubTodoPositionsService.create(todoId, []);

    return { todoId, position: newPosition };
  }

  async getRemoved(userId) {
    const boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);

    if (!boardIdsWithAccess.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    const removedTodos = await TodoService.getRemovedByBoardIds(boardIdsWithAccess);

    return {
      entities: removedTodos,
      positions: {},
    };
  }

  async get(userId, todoId) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this todo');
    }

    const headingId = await TodoService.getHeadingId(todoId);
    const todoPositions = await TodoPositionsService.getPositions(headingId);

    const todo = await TodoService.getById(todoId);

    return {
      ...todo,
      position: PositionComponent.getPositionById(todoPositions, todo.id),
    };
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive todos for this board');
      }

      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    let todos;
    if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive todos for this column');
      }
      todos = await TodoService.getByColumnId(columnId);
    } else {
      todos = await TodoService.getByBoardIds(boardIdsWithAccess);
    }

    if (!todos.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    let headings;
    if (columnId) {
      headings = await HeadingService.getByColumnId(columnId);
    } else {
      headings = await HeadingService.getByBoardIds(boardIdsWithAccess);
    }

    const headingIdsMap = new Set();

    headings.forEach((heading) => {
      headingIdsMap.add(heading.id);
    });
    const headingIds = [...headingIdsMap];

    const todoPositionsByHeadingIds = await TodoPositionsService.getPositionsByHeadingIds(headingIds);

    const normalizedPositions = todoPositionsByHeadingIds.reduce((acc, { headingId: id, order }) => ({
      ...acc,
      [id]: order,
    }), {});

    return {
      entities: todos,
      positions: normalizedPositions,
    };
  }

  async updatePosition({
    userId, headingId, sourcePosition, destinationPosition, targetHeadingId,
  }) {
    const isAccessToSourceHeading = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccessToSourceHeading) {
      throw new BackendError.Forbidden('This account does not have access to source heading');
    }

    const todoPositions = await TodoPositionsService.getPositions(headingId);

    if (targetHeadingId) {
      const isAccessToTargetHeading = await BoardAccessService.getByHeadingId(
        userId, targetHeadingId,
      );

      if (!isAccessToTargetHeading) {
        throw new BackendError.Forbidden('This account does not have access to target heading');
      }

      const targetTodoPositions = await TodoPositionsService.getPositions(targetHeadingId);

      if (!PositionComponent.isValidSource(todoPositions, sourcePosition)
        || !PositionComponent.isValidDestination(targetTodoPositions, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const todoId = todoPositions[sourcePosition];
      await TodoService.update(todoId, { headingId: targetHeadingId });
      const newTargetTodoPositions = PositionComponent.insertInPosition(
        targetTodoPositions, destinationPosition, todoId,
      );
      await TodoPositionsService.updatePositions(targetHeadingId, newTargetTodoPositions);

      const newSourceTodoPositions = PositionComponent.removeByPosition(
        todoPositions, sourcePosition,
      );
      await TodoPositionsService.updatePositions(headingId, newSourceTodoPositions);
    } else {
      if (!PositionComponent.isValidSource(todoPositions, sourcePosition, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const newTodoPositions = PositionComponent.move(
        todoPositions, sourcePosition, destinationPosition,
      );

      await TodoPositionsService.updatePositions(headingId, newTodoPositions);
    }

    return destinationPosition;
  }

  async update({ userId, todoId, patch }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this todo');
    }

    const { headingId: newHeadingId } = patch;

    if (newHeadingId) {
      const isAccessToNewHeading = await BoardAccessService.getByHeadingId(userId, newHeadingId);
      if (!isAccessToNewHeading) {
        throw new BackendError.Forbidden('This account is not allowed to set this headingId for this todo');
      }
    }

    await TodoService.update(todoId, patch);

    return true;
  }

  async duplicate({ userId, todoId, newHeadingId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this todo');
    }

    const { id, expirationDate, ...todoToDuplicate } = await TodoService.getById(todoId);

    const dataForCreate = {
      ...todoToDuplicate,
    };

    if (expirationDate) {
      dataForCreate.expirationDate = new Date(expirationDate);
    }

    if (newHeadingId !== undefined) {
      dataForCreate.headingId = newHeadingId;
    } else {
      dataForCreate.belowId = todoId;
    }

    const {
      todoId: newTodoId,
      position,
    } = await this.create(userId, dataForCreate);

    const subTodoPositions = await SubTodoPositionsService.getPositions(todoId);

    for await (const subTodoId of subTodoPositions) {
      await SubTodoController.duplicate({
        userId,
        subTodoId,
        newTodoId,
      });
    }

    return {
      ...todoToDuplicate,
      todoId: newTodoId,
      position,
    };
  }

  async switchArchived({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to switch archived this todo');
    }

    const headingId = await TodoService.getHeadingId(todoId);
    const heading = await HeadingService.getById(headingId);
    const todoPositions = await TodoPositionsService.getPositions(headingId);
    const sourcePosition = PositionComponent.getPositionById(todoPositions, todoId);
    const columnId = await HeadingService.getColumnId(headingId);

    let targetHeadingId;
    if (heading.type === HeadingType.archived) {
      targetHeadingId = await HeadingService.getDefaultIdByColumnId(columnId);
    } else {
      targetHeadingId = await HeadingService.getArchivedIdByColumnId(columnId);
    }

    if (!targetHeadingId) {
      throw new BackendError.BadRequest('Todo is not in any of the heading type');
    }

    const destinationPosition = 0;

    await this.updatePosition({
      userId,
      headingId,
      sourcePosition,
      destinationPosition,
      targetHeadingId,
    });

    return true;
  }

  async switchRemoved({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to switch removed this todo');
    }

    const headingId = await TodoService.getHeadingId(todoId);
    const heading = await HeadingService.getById(headingId);
    const todoPositions = await TodoPositionsService.getPositions(headingId);
    const sourcePosition = PositionComponent.getPositionById(todoPositions, todoId);
    const columnId = await HeadingService.getColumnId(headingId);

    let targetHeadingId;
    if (heading.type === HeadingType.removed) {
      targetHeadingId = await HeadingService.getDefaultIdByColumnId(columnId);
    } else {
      targetHeadingId = await HeadingService.getRemovedIdByColumnId(columnId);
    }

    if (!targetHeadingId) {
      throw new BackendError.BadRequest('Todo is not in any of the heading type');
    }

    const destinationPosition = 0;

    await this.updatePosition({
      userId,
      headingId,
      sourcePosition,
      destinationPosition,
      targetHeadingId,
    });

    return true;
  }

  async remove({ userId, todoId }) {
    const isAccess = await BoardAccessService.getByTodoId(userId, todoId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this todo');
    }

    const removedTodo = await TodoService.removeById(todoId);
    const { id: removedId, headingId } = removedTodo;
    const todoPositions = await TodoPositionsService.getPositions(headingId);
    const newPositions = PositionComponent.removeById(todoPositions, removedId);
    await TodoPositionsService.updatePositions(headingId, newPositions);

    return true;
  }
}

module.exports = {
  TodoController: new TodoController(),
};
