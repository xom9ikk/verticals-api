const { CommentAttachmentAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FormatterMiddleware,
  FetchMiddleware,
  BusboyMiddleware,
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
 *   UploadAttachmentToCommentRequest:
 *    type: object
 *    required:
 *      - commentId
 *    properties:
 *      commentId:
 *        type: integer
 *   UploadAttachmentToCommentResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           link:
 *             type: string
 *       message:
 *         type: string
 * /v1/comment-attachment/:commentId:
 *   post:
 *     tags:
 *       - Upload
 *     description: Attach file to comment by comment id
 *     consumes:
 *       - multipart/form-data
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: commentFileId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Successfully uploaded attachment for comment"
 *         schema:
 *          $ref: '#/definitions/UploadAttachmentToCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteAttachCommentResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/comment-attachment/:attachmentId:
 *   delete:
 *     tags:
 *       - Comment
 *     description: Delete attachment from comment
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: attachmentId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Comment successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteAttachCommentResponse'
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
  commentAttachmentRouter: (fastify, opts, done) => {
    fastify.post(
      '/:commentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'uploadAttachmentToCommentParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
          BusboyMiddleware.generateFileInfo,
        ],
      },
      CommentAttachmentAdapter.save,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.query),
          SchemaValidator.validate(RequestPart.params, 'getCommentAttachmentsQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAttachmentAdapter.getAll,
    );
    fastify.delete(
      '/:attachmentId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteAttachmentParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      CommentAttachmentAdapter.remove,
    );
    done();
  },
};
