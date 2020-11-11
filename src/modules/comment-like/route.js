const { CommentLikeAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FormatterMiddleware,
  FetchMiddleware,
} = require('../../middlewares');

const { RequestPart } = require('../../enums');
/**
 * @swagger
 * definitions:
 *   ErrorResponse:
 *    type: object
 *    properties:
 *      message:
 *        type: string
 */

/**
 * @swagger
 * definitions:
 *   CreateCommentLikeRequest:
 *    type: object
 *    required:
 *      - commentId
 *    properties:
 *      commentId:
 *        type: integer
 *   CreateCommentLikeResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           commentId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/comment-like:
 *   post:
 *     tags:
 *       - Comment like
 *     description: Like comment
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/CreateCommentLikeRequest'
 *     responses:
 *       200:
 *         description: "Comment like successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateCommentLikeResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteCommentLikeResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/comment-like/:commentId:
 *   delete:
 *     tags:
 *       - Comment like
 *     description: Delete like
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: commentId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Comment like successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteCommentResponse'
 *       403:
 *         description: "This account is not allowed to delete this comment"
 *         schema:
 *          $ref: '#/definitions/DeleteCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  commentLikeRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createCommentLike'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentLikeAdapter.create,
    );
    fastify.delete(
      '/:commentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteCommentLikeParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentLikeAdapter.remove,
    );
    done();
  },
};
