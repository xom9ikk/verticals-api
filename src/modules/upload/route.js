const router = require('express').Router();
const { RequestPart } = require('../../enums');
const { CommentAdapter } = require('../comment/adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FormatterMiddleware,
  FetchMiddleware,
  BusboyMiddleware,
} = require('../../middlewares');

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
 *   UploadFileToCommentRequest:
 *    type: object
 *    required:
 *      - commentId
 *    properties:
 *      commentId:
 *        type: integer
 *   UploadFileToCommentResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           link:
 *             type: string
 *       message:
 *         type: string
 * /v1/upload/comment/:commentId:
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
 *          $ref: '#/definitions/UploadFileToCommentResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

router.post(
  '/comment/:commentId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'uploadFileToCommentParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  BusboyMiddleware.generateFileInfo('uploads'),
  CommentAdapter.saveFile,
);

module.exports = {
  uploadRouter: router,
};
