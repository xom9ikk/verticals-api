const { Database } = require('../database');

class ColumnService extends Database {
  async create(column) {
    const [columnId] = await this.columns
      .insert(column)
      .returning('id');
    return columnId;
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
    const [columnId] = await this.columns
      .where({
        id,
      })
      .update(column)
      .returning('id');
    return columnId;
  }

  async removeById(id) {
    const [removedColumn] = await this.columns
      .where({
        id,
      })
      .returning([
        'id',
        'boardId',
        'title',
        'description',
        'color',
        'isCollapsed',
      ])
      .del();
    return removedColumn;
  }

  getBoardIdSubQuery(id) {
    return this.columns
      .select([
        'boardId',
      ])
      .where({
        id,
      })
      .first();
  }

  async getBoardId(id) {
    const res = await this.getBoardIdSubQuery(id);
    return res.boardId;
  }
}

module.exports = {
  ColumnService: new ColumnService(),
};
