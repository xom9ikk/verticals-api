const { Database } = require('../database');

class CommentFilesService extends Database {
  async create(todo) {
    const response = await this.commentFiles
      .insert(todo)
      .returning('id');
    return response[0];
  }

  removeById(id) {
    return this.commentFiles
      .where({
        id,
      })
      .del();
  }

  async getPathById(id) {
    const response = await this.commentFiles
      .select([
        'path',
      ])
      .where({
        id,
      })
      .first();
    return response ? response.path : undefined;
  }

  getCommentId(id) {
    return this.commentFiles
      .select([
        'commentId',
      ])
      .where({
        id,
      })
      .first();
  }
}

module.exports = {
  CommentFilesService: new CommentFilesService(),
};
