const { PositionComponent } = require('../../components');
const { TodoController } = require('../todo/controller');
const { ColumnController } = require('../column/controller');
const { HeadingController } = require('../heading/controller');
const { BoardController } = require('../board/controller');

class SearchController {
  async searchInTodo({ userId, query }) {
    const todos = await TodoController.getAll(userId);
    const columns = await ColumnController.getAll(userId);
    const headings = await HeadingController.getAll(userId);
    const boards = await BoardController.getAll(userId);

    const normalizedQuery = query.toLowerCase();
    const filteredTodoEntities = todos.entities.filter((todo) => {
      const normalizedTitle = todo.title.toLowerCase();
      return normalizedTitle.includes(normalizedQuery);
    });

    const filteredTodoPositions = PositionComponent.mapEntitiesOnPositions(
      filteredTodoEntities, todos.positions,
    );

    const todoHeadingIds = filteredTodoEntities.map((todo) => todo.headingId);
    const filteredHeadingEntities = headings.entities
      .filter((heading) => todoHeadingIds.includes(heading.id));

    const filteredHeadingPositions = PositionComponent.mapEntitiesOnPositions(
      filteredHeadingEntities, headings.positions,
    );

    const todoColumnIds = filteredHeadingEntities.map((todo) => todo.columnId);
    const filteredColumnEntities = columns.entities
      .filter((column) => todoColumnIds.includes(column.id));

    const filteredColumnPositions = PositionComponent.mapEntitiesOnPositions(
      filteredColumnEntities, columns.positions,
    );

    const columnBoardIds = filteredColumnEntities.map((column) => column.boardId);
    const filteredBoardEntities = boards.entities
      .filter((board) => columnBoardIds.includes(board.id));

    const filteredBoardPositions = [];
    boards.positions.forEach((boardId) => {
      const hasBoard = filteredBoardEntities.findIndex((board) => board.id === boardId) !== -1;
      if (hasBoard) {
        filteredBoardPositions.push(boardId);
      }
    });

    return {
      todos: {
        entities: filteredTodoEntities,
        positions: filteredTodoPositions,
      },
      headings: {
        entities: filteredHeadingEntities,
        positions: filteredHeadingPositions,
      },
      columns: {
        entities: filteredColumnEntities,
        positions: filteredColumnPositions,
      },
      boards: {
        entities: filteredBoardEntities,
        positions: filteredBoardPositions,
      },
    };
  }
}

module.exports = {
  SearchController: new SearchController(),
};
