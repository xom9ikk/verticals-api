/* eslint-disable no-restricted-syntax */
const {
  BoardAccessService,
  ColumnService, HeadingService,
  ColumnPositionsService, HeadingPositionsService, TodoPositionsService,
} = require('../../services');
const { BackendError } = require('../../components/error');
const { PositionComponent } = require('../../components');
const { HeadingController } = require('../heading/controller');
const { HeadingType } = require('../../constants');

class ColumnController {
  async create(userId, { belowId, ...column }) {
    // TODO: write tests with belowId
    if (belowId) {
      const isAccessToBelowColumnId = await BoardAccessService.getByColumnId(userId, belowId);
      if (!isAccessToBelowColumnId) {
        throw new BackendError.Forbidden('This account is not allowed to create column below this column');
      }
    }

    const { boardId } = column;
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to create column for this board');
    }

    const columnId = await ColumnService.create(column);
    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    await HeadingPositionsService.create(columnId, []);
    await HeadingController.create(userId, {
      columnId,
      title: 'Default heading',
      type: HeadingType.default,
    });
    const archivedHeadingId = await HeadingService.create({
      columnId,
      title: 'Archived heading',
      type: HeadingType.archived,
    });
    await TodoPositionsService.create(archivedHeadingId, []);

    const removedHeadingId = await HeadingService.create({
      columnId,
      title: 'Removed heading',
      type: HeadingType.removed,
    });
    await TodoPositionsService.create(removedHeadingId, []);

    const {
      newPosition,
      newPositions,
    } = PositionComponent.insert(columnPositions, columnId, belowId);

    await ColumnPositionsService.updatePositions(boardId, newPositions);

    return { columnId, position: newPosition };
  }

  async get(userId, columnId) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to receive this column');
    }

    const boardId = await ColumnService.getBoardId(columnId);

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    const column = await ColumnService.getById(columnId);

    return {
      ...column,
      position: PositionComponent.getPositionById(columnPositions, column.id),
    };
  }

  async getAll(userId, boardId) {
    let boardIdsWithAccess;

    if (boardId) {
      const isAccessToBoard = await BoardAccessService.getByBoardId(userId, boardId);
      if (!isAccessToBoard) {
        throw new BackendError.Forbidden('This account is not allowed to receive columns for this board');
      }
      boardIdsWithAccess = [boardId];
    } else {
      boardIdsWithAccess = await BoardAccessService.getAllBoardIdsByUserId(userId);
    }

    if (!boardIdsWithAccess.length) {
      throw new BackendError.Forbidden('This account does not have access to any baords');
    }

    const columns = await ColumnService.getByBoardIds(boardIdsWithAccess);

    if (boardId) {
      const columnPositions = await ColumnPositionsService.getPositions(boardId);
      return {
        entities: columns,
        positions: {
          [boardId]: columnPositions,
        },
      };
    }

    const columnPositions = await ColumnPositionsService.getPositionsByBoardIds(boardIdsWithAccess);

    // eslint-disable-next-line no-shadow
    const normalizedPositions = columnPositions.reduce((acc, { boardId, order }) => ({
      ...acc,
      [boardId]: order,
    }), {});

    return {
      entities: columns,
      positions: normalizedPositions,
    };
  }

  // TODO: write tests for updatePosition
  async updatePosition({
    userId, boardId, sourcePosition, destinationPosition,
  }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    if (!PositionComponent.isValidSource(columnPositions, sourcePosition, destinationPosition)) {
      throw new BackendError.BadRequest('Invalid source or destination position');
    }

    const newColumnPositions = PositionComponent.move(
      columnPositions, sourcePosition, destinationPosition,
    );

    await ColumnPositionsService.updatePositions(boardId, newColumnPositions);

    return destinationPosition;
  }

  async update({ userId, columnId, patch }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    const { boardId: newBoardId } = patch;
    if (newBoardId) {
      const isAccessToNewBoard = await BoardAccessService.getByBoardId(userId, newBoardId);
      if (!isAccessToNewBoard) {
        throw new BackendError.Forbidden('This account is not allowed to set this boardId for this column');
      }
    }

    const updatedColumn = await ColumnService.update(columnId, patch);

    if (updatedColumn === undefined) {
      throw new BackendError.Forbidden('This account is not allowed to edit this column');
    }

    return true;
  }

  // TODO: write tests
  async duplicate({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to duplicate this column');
    }

    const { id, ...columnToDuplicate } = await ColumnService.getById(columnId);

    const {
      columnId: newColumnId,
      position,
    } = await this.create(userId, { belowId: columnId, ...columnToDuplicate });

    const headings = await HeadingService.getByColumnId(columnId);
    const headingPositions = await HeadingPositionsService.getPositions(columnId);

    const orderedHeadings = [];
    headingPositions.forEach((headingId) => {
      const targetHeading = headings.find((heading) => heading.id === headingId);
      orderedHeadings.push(targetHeading);
    });
    const archivedHeading = await HeadingService.getArchivedByColumnId(columnId);
    const removedHeading = await HeadingService.getRemovedByColumnId(columnId);

    orderedHeadings.push(archivedHeading);
    orderedHeadings.push(removedHeading);

    const headingsToDuplicate = orderedHeadings.map((heading) => ({
      ...heading,
      columnId: newColumnId,
    }));

    for await (const heading of headingsToDuplicate) {
      const headingId = heading.id;
      delete heading.id;

      let newHeadingId;
      if (heading.type === HeadingType.custom) {
        const newHeading = await HeadingController.create(userId, heading);
        newHeadingId = newHeading.headingId;
      } else if (heading.type === HeadingType.default) {
        newHeadingId = await HeadingService.getDefaultIdByColumnId(newColumnId);
      } else if (heading.type === HeadingType.archived) {
        newHeadingId = await HeadingService.getArchivedIdByColumnId(newColumnId);
      } else if (heading.type === HeadingType.removed) {
        newHeadingId = await HeadingService.getRemovedIdByColumnId(newColumnId);
      }

      await HeadingController.duplicate({
        userId,
        headingId,
        newHeadingId,
      });
    }

    // const duplicatedHeadings = await HeadingController.getAll(userId, undefined, newColumnId);

    return {
      ...columnToDuplicate,
      columnId: newColumnId,
      position,
      // headings: duplicatedHeadings,
    };
  }

  // TODO: write tests for reverseOrder
  async reverseOrder({ userId, boardId }) {
    const isAccess = await BoardAccessService.getByBoardId(userId, boardId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to reverse columns in this board');
    }

    const columnPositions = await ColumnPositionsService.getPositions(boardId);

    const newColumnPositions = PositionComponent.reverse(columnPositions);

    await ColumnPositionsService.updatePositions(boardId, newColumnPositions);

    return true;
  }

  async remove({ userId, columnId }) {
    const isAccess = await BoardAccessService.getByColumnId(userId, columnId);

    if (!isAccess) {
      throw new BackendError.Forbidden('This account is not allowed to remove this column');
    }

    const removedColumn = await ColumnService.removeById(columnId);
    const { id: removedId, boardId } = removedColumn;
    const columnPositions = await ColumnPositionsService.getPositions(boardId);
    const newPositions = PositionComponent.removeById(columnPositions, removedId);
    await ColumnPositionsService.updatePositions(boardId, newPositions);

    return true;
  }
}

module.exports = {
  ColumnController: new ColumnController(),
};
