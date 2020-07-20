const { Database } = require('../database');

class ColumnService extends Database {
  async create(column) {
    const response = await this.columns
      .insert(column)
      .returning('id');
    return response[0];
  }

  async getBoardIdByColumnId(id) {
    const response = await this.columns
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
    return this.columns
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
    return this.columns
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
    return this.columns
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

  async update(id, column) {
    const response = await this.columns
      .where({
        id,
      })
      .update(column)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.columns
      .where({
        id,
      })
      .del();
  }
}

module.exports = {
  ColumnService: new ColumnService(),
};
