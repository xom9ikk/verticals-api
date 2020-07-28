const { CommentAdapter } = require('./adapter');
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
 *   CreateCommentRequest:
 *    type: object
 *    required:
 *      - todoId
 *    properties:
 *      todoId:
 *        type: integer
 *      text:
 *        type: string
 *      replyCommentId:
 *        type: string
 *   CreateCommentResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           commentId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/comment:
 *   post:
 *     tags:
 *       - Comment
 *     description: Create new comment
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
 *          $ref: '#/definitions/CreateCommentRequest'
 *     responses:
 *       200:
 *         description: "Comment successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetCommentResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           todoId:
 *             type: integer
 *           text:
 *             type: string
 *           replyCommentId:
 *             type: string
 *       message:
 *         type: string
 * /v1/comment/:commentId
 *   get:
 *     tags:
 *       - Comment
 *     description: Get comment info by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: commentId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Comment information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetAllCommentsRequest:
 *    type: object
 *    properties:
 *      boardId:
 *        type: integer
 *      todoId:
 *        type: integer
 *   GetAllCommentsResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           commentId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/comment
 *   get:
 *     tags:
 *       - Comment
 *     description: Get all comments to which you have access
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - name: query
 *         in: query
 *         required: false
 *         schema:
 *          $ref: '#/definitions/GetAllCommentsRequest'
 *     responses:
 *       200:
 *         description: "Comments information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetAllCommentsResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   UpdateCommentRequest:
 *    type: object
 *    properties:
 *      todoId:
 *        type: integer
 *      text:
 *        type: string
 *      replyCommentId:
 *        type: integer
 *   UpdateCommentResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/comment/:commentId
 *   patch:
 *     tags:
 *       - Comment
 *     description: Update comment
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
 *          $ref: '#/definitions/UpdateCommentRequest'
 *       - in: path
 *         name: commentId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Comment successfully updated"
 *         schema:
 *          $ref: '#/definitions/UpdateCommentResponse'
 *       403:
 *         description: "This account is not allowed to edit this comment"
 *         schema:
 *          $ref: '#/definitions/UpdateCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteCommentResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/comment/:commentId:
 *   delete:
 *     tags:
 *       - Comment
 *     description: Delete comment
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
 *         description: "Comment successfully deleted"
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
  commentRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createComment'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAdapter.create,
    );
    fastify.get(
      '/:commentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getComment'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.query),
          SchemaValidator.validate(RequestPart.query, 'getCommentsQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAdapter.getAll,
    );
    fastify.patch(
      '/:commentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchCommentBody'),
          SchemaValidator.validate(RequestPart.params, 'patchCommentParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAdapter.update,
    );
    fastify.delete(
      '/:commentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteCommentParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAdapter.remove,
    );
    done();
  },
};
