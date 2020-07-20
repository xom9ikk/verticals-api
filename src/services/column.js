const { Database } = require('../database');
const { tables } = require('../database/tables');

class ColumnService extends Database {
  constructor() {
    super(tables.columns);
  }

  async create(board) {
    const response = await this.db
      .insert(board)
      .returning('id');
    return response[0];
  }

  async getBoardIdByColumnId(id) {
    const response = await this.db
      .select([
        'boardId',
      ])
      .where(
        { id },
      )
      .first();
    return response ? response.boardId : undefined;
  }

  getById(id) {
    return this.db
      .select([
        'id',
        'boardId',
        'title',
        'position',
        'description',
        'color',
        'isCollapsed',
      ])
      .where(
        { id },
      )
      .first();
  }

  getByColumnIds(columnIds) {
    return this.db
      .select([
        'id',
        'boardId',
        'title',
        'position',
        'description',
        'color',
        'isCollapsed',
      ])
      .whereIn(
        'id',
        columnIds,
      );
  }

  getByBoardIds(boardIds) {
    return this.db
      .select([
        'id',
        'boardId',
        'title',
        'position',
        'description',
        'color',
        'isCollapsed',
      ])
      .whereIn(
        'boardId',
        boardIds,
      );
  }

  async update(id, board) {
    const response = await this.db
      .where({ id })
      .update(board)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.db
      .where({ id })
      .del();
  }
}

module.exports = {
  ColumnService: new ColumnService(),
};
