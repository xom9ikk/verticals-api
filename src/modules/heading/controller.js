/* eslint-disable no-restricted-syntax */
const {
  HeadingService, BoardAccessService, HeadingPositionsService, TodoPositionsService, TodoService,
} = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');
const { TodoController } = require('../todo/controller');
const { HeadingType } = require('../../constants');

// TODO: write tests
class HeadingController {
  async create(userId, { belowId, ...heading }) {
    if (belowId) {
      const isAccessToBelowTodoId = await BoardAccessService.getByHeadingId(userId, belowId);
      if (!isAccessToBelowTodoId) {
        throw new BackendError.Forbidden('This account is not allowed to create todo below this todo');
      }
    }

    const { columnId } = heading;
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create heading for this column');
    }

    const type = heading.type === undefined ? HeadingType.custom : heading.type;
    const headingId = await HeadingService.create({
      ...heading,
      type,
    });
    const headingPositions = await HeadingPositionsService.getPositions(columnId);
    await TodoPositionsService.create(headingId, []);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(headingPositions, headingId, belowId);

    await HeadingPositionsService.updatePositions(columnId, newPositions);

    return { headingId, position: newPosition };
  }

  async get(userId, headingId) {
    const isAccess = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this heading');
    }

    const columnId = await HeadingService.getColumnId(headingId);
    const headingPositions = await HeadingPositionsService.getPositions(columnId);

    const heading = await HeadingService.getById(headingId);

    return {
      ...heading,
      position: PositionComponent.getPositionById(headingPositions, heading.id),
    };
  }

  async getAll(userId, boardId, columnId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive headings for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any boards');
    }

    let headings;
    if (columnId) {
      const isAccessToColumn = await BoardAccessService.getByColumnId(userId, columnId);
      if (!isAccessToColumn) {
        throw new BackendError.Forbidden('This account is not allowed to receive headings for this column');
      }
      headings = await HeadingService.getByColumnId(columnId);
    } else {
      headings = await HeadingService.getByBoardIds(boardIdsWithAccess);
    }

    if (!headings.length) {
      return {
        entities: [],
        positions: {},
      };
    }

    if (columnId) {
      const headingPositions = await HeadingPositionsService.getPositions(columnId);
      return {
        entities: headings,
        positions: {
          [columnId]: headingPositions,
        },
      };
    }

    const columnIdsMap = new Set();
    headings.forEach((heading) => {
      columnIdsMap.add(heading.columnId);
    });
    const columnIds = [...columnIdsMap];

    const headingPositionsByColumnIds = await HeadingPositionsService.getPositionsByColumnIds(columnIds);

    const normalizedPositions = headingPositionsByColumnIds.reduce((acc, { columnId: id, order }) => ({
      ...acc,
      [id]: order,
    }), {});

    return {
      entities: headings,
      positions: normalizedPositions,
    };
  }

  // TODO: write tests for updatePosition
  async updatePosition({
    userId, columnId, sourcePosition, destinationPosition, targetColumnId,
  }) {
    const isAccessToSourceColumn = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccessToSourceColumn) {
      throw new BackendError.Forbidden('This account does not have access to source column');
    }

    const headingPositions = await HeadingPositionsService.getPositions(columnId);

    if (targetColumnId) {
      const isAccessToTargetColumn = await BoardAccessService.getByColumnId(
        userId, targetColumnId,
      );

      if (!isAccessToTargetColumn) {
        throw new BackendError.Forbidden('This account does not have access to target column');
      }

      const targetHeadingPositions = await HeadingPositionsService.getPositions(targetColumnId);

      if (!PositionComponent.isValidSource(headingPositions, sourcePosition)
        || !PositionComponent.isValidDestination(targetHeadingPositions, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const headingId = headingPositions[sourcePosition];
      await HeadingService.update(headingId, { columnId: targetColumnId });
      const newTargetHeadingPositions = PositionComponent.insertInPosition(
        targetHeadingPositions, destinationPosition, headingId,
      );
      await HeadingPositionsService.updatePositions(targetColumnId, newTargetHeadingPositions);

      const newSourceHeadingPositions = PositionComponent.removeByPosition(
        headingPositions, sourcePosition,
      );
      await HeadingPositionsService.updatePositions(columnId, newSourceHeadingPositions);
    } else {
      if (!PositionComponent.isValidSource(headingPositions, sourcePosition, destinationPosition)) {
        throw new BackendError.BadRequest('Invalid source or destination position');
      }

      const newHeadingPositions = PositionComponent.move(
        headingPositions, sourcePosition, destinationPosition,
      );

      await HeadingPositionsService.updatePositions(columnId, newHeadingPositions);
    }

    return destinationPosition;
  }

  async update({ userId, headingId, patch }) {
    const isAccess = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this heading');
    }

    const { columnId: newColumnId } = patch;
    if (newColumnId) {
      const isAccessToNewColumn = await BoardAccessService.getByColumnId(userId, newColumnId);
      if (!isAccessToNewColumn) {
        throw new BackendError.Forbidden('This account is not allowed to set this columnId for this heading');
      }
    }

    await HeadingService.update(headingId, patch);

    return true;
  }

  // TODO: write tests
  async duplicate({ userId, headingId, newHeadingId }) {
    const isAccess = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this heading');
    }

    const { id, ...headingToDuplicate } = await HeadingService.getById(headingId);

    if (!newHeadingId) {
      const data = await this.create(userId, { belowId: headingId, ...headingToDuplicate });
      // eslint-disable-next-line no-param-reassign
      newHeadingId = data.headingId;
    }

    const todos = await TodoService.getByHeadingId(headingId);
    const todoPositions = await TodoPositionsService.getPositions(headingId);

    const orderedTodos = [];
    todoPositions.forEach((todoId) => {
      const targetTodo = todos.find((todo) => todo.id === todoId);
      orderedTodos.push(targetTodo);
    });

    const todosToDuplicate = orderedTodos.map((todo) => {
      const newTodo = { ...todo, headingId: newHeadingId };
      delete newTodo.id;
      delete newTodo.commentsCount;
      delete newTodo.imagesCount;
      delete newTodo.attachmentsCount;
      return newTodo;
    });

    for await (const todo of todosToDuplicate) {
      await TodoController.create(userId, todo);
    }

    // const duplicatedTodos = await TodoController.getAll(userId, undefined, newHeadingId);

    return {
      ...headingToDuplicate,
      headingId: newHeadingId,
      // position,
      // todos: duplicatedTodos,
    };
  }

  // TODO: write tests for reverseOrder
  async reverseOrder({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to reverse headings in this column');
    }

    const headingPositions = await HeadingPositionsService.getPositions(columnId);

    const newHeadingPositions = PositionComponent.reverse(headingPositions);

    await HeadingPositionsService.updatePositions(columnId, newHeadingPositions);

    return true;
  }

  async remove({ userId, headingId }) {
    const isAccess = await BoardAccessService.getByHeadingId(userId, headingId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this heading');
    }

    const removedHeading = await HeadingService.removeById(headingId);
    const { id: removedId, columnId } = removedHeading;
    const headingPositions = await HeadingPositionsService.getPositions(columnId);
    const newPositions = PositionComponent.removeById(headingPositions, removedId);
    await HeadingPositionsService.updatePositions(columnId, newPositions);

    return true;
  }
}

module.exports = {
  HeadingController: new HeadingController(),
};
