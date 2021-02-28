const { PositionComponent } = require('../../components');
const { TodoController } = require('../todo/controller');
const { ColumnController } = require('../column/controller');
const { BoardController } = require('../board/controller');

// TODO: tests
class SearchController {
  async searchInTodo({ userId, query }) {
    const todos = await TodoController.getAll(userId);
    const columns = await ColumnController.getAll(userId);
    const boards = await BoardController.getAll(userId);

    // todos
    const normalizedQuery = query.toLowerCase();
    const filteredTodoEntities = todos.entities.filter((todo) => {
      const normalizedTitle = todo.title.toLowerCase();
      return normalizedTitle.includes(normalizedQuery);
    });

    const filteredTodoPositions = PositionComponent.mapEntitiesOnPositions(
      filteredTodoEntities, todos.positions,
    );

    // columns
    const todoColumnIds = filteredTodoEntities.map((todo) => todo.columnId);
    const filteredColumnEntities = columns.entities
      .filter((column) => todoColumnIds.includes(column.id));

    const filteredColumnPositions = PositionComponent.mapEntitiesOnPositions(
      filteredColumnEntities, columns.positions,
    );

    // boards
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
