const { TodoController } = require('../todo/controller');
const { ColumnController } = require('../column/controller');
const { BoardController } = require('../board/controller');

// TODO: tests
class SearchController {
  async searchInTodo({ userId, query }) {
    const todos = await TodoController.getAll(userId);
    const columns = await ColumnController.getAll(userId);
    const boards = await BoardController.getAll(userId);

    const filteredTodos = todos.filter((todo) => todo.title.includes(query));
    const todoColumnIds = filteredTodos.map((todo) => todo.columnId);
    const filteredColumns = columns.filter((column) => todoColumnIds.includes(column.id));
    const columnBoardIds = filteredColumns.map((column) => column.boardId);
    const filteredBoards = boards.filter((board) => columnBoardIds.includes(board.id));

    return {
      todos: filteredTodos,
      columns: filteredColumns,
      boards: filteredBoards,
    };
  }
}

module.exports = {
  SearchController: new SearchController(),
};
