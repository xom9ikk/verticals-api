const { Database } = require('../database');
const { HeadingType } = require('../constants');

class HeadingService extends Database {
  async create(heading) {
    const [headingId] = await this.headings
      .insert(heading)
      .returning('id');
    return headingId;
  }

  async getColumnIdByHeadingId(id) {
    const response = await this.headings
      .select([
        'columnId',
      ])
      .where(
        { id },
      )
      .first();
    return response ? response.columnId : undefined;
  }

  getById(id) {
    return this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .where(
        { id },
      )
      .first();
  }

  getByHeadingIds(headingIds) {
    return this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .whereIn(
        'id',
        headingIds,
      );
  }

  getByColumnId(columnId) {
    return this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .where({ columnId })
      .andWhereNot({ type: HeadingType.removed });
  }

  async getArchivedByColumnId(columnId) {
    const response = await this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .where({ columnId, type: HeadingType.archived })
      .first();
    return response;
  }

  async getRemovedByColumnId(columnId) {
    const response = await this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .where({ columnId, type: HeadingType.removed })
      .first();
    return response;
  }

  async getArchivedIdByColumnId(columnId) {
    const response = await this.getArchivedByColumnId(columnId);
    return response ? response.id : undefined;
  }

  async getRemovedIdByColumnId(columnId) {
    const response = await this.getRemovedByColumnId(columnId);
    return response ? response.id : undefined;
  }

  async getDefaultIdByColumnId(columnId) {
    const response = await this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .where({ columnId, type: HeadingType.default })
      .first();
    return response ? response.id : undefined;
  }

  getByColumnIds(columnIds) {
    return this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .whereIn(
        'columnId',
        columnIds,
      );
  }

  getByBoardIds(boardIds) {
    const getColumnIds = this.columns
      .select([
        'id',
      ])
      .whereIn(
        'boardId',
        boardIds,
      );
    return this.headings
      .select([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .whereIn(
        'columnId',
        getColumnIds,
      )
      .andWhereNot({ type: HeadingType.removed });
  }

  async update(id, heading) {
    const [headingId] = await this.headings
      .where({
        id,
      })
      .update(heading)
      .returning('id');
    return headingId;
  }

  async removeById(id) {
    const [removedHeading] = await this.headings
      .where({
        id,
      })
      .returning([
        'id',
        'columnId',
        'title',
        'description',
        'color',
        'isCollapsed',
        'type',
      ])
      .del();
    return removedHeading;
  }

  getColumnIdSubQuery(id) {
    return this.headings
      .select([
        'columnId',
      ])
      .where({
        id,
      })
      .first();
  }

  async getColumnId(id) {
    const res = await this.getColumnIdSubQuery(id);
    return res.columnId;
  }
}

module.exports = {
  HeadingService: new HeadingService(),
};
