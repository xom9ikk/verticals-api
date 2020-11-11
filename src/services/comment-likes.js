const { Database } = require('../database');

class CommentLikesService extends Database {
  async create(like) {
    const [commentLikeId] = await this.commentLikes
      .insert(like)
      .returning('id');
    return commentLikeId;
  }

  getByUserAndCommentId(userId, commentId) {
    return this.commentLikes
      .select([
        'id',
        'userId',
        'commentId',
      ])
      .where({
        userId,
        commentId,
      })
      .first();
  }

  removeByUserAndCommentId(userId, commentId) {
    return this.commentLikes
      .where({
        userId,
        commentId,
      })
      .del();
  }
}

module.exports = {
  CommentLikesService: new CommentLikesService(),
};
