const router = require('express').Router();
const { BoardAdapter } = require('./adapter');
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
 *   CreateBoardRequest:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      position:
 *        type: integer
 *      cardType:
 *        type: string
 *        enum: [0, 1, 2, 3, 4]
 *      description:
 *        type: string
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *   CreateBoardResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           boardId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/board:
 *   post:
 *     tags:
 *       - Board
 *     description: Create new board
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/CreateBoardRequest'
 *     responses:
 *       200:
 *         description: "Board successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
router.post(
  '/',
  SchemaValidator.validate(RequestPart.body, 'createBoard'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  BoardAdapter.create,
);

/**
 * @swagger
 * definitions:
 *   PatchBoardRequest:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      position:
 *        type: integer
 *      cardType:
 *        type: string
 *        enum: [0, 1, 2, 3, 4]
 *      description:
 *        type: string
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *   PatchBoardResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/board:
 *   post:
 *     tags:
 *       - Board
 *     description: Create new board
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/PatchBoardRequest'
 *     responses:
 *       200:
 *         description: "Board successfully updated"
 *         schema:
 *          $ref: '#/definitions/CreateBoardResponse'
 *       403:
 *         description: "This account is not allowed to edit this board"
 *         schema:
 *          $ref: '#/definitions/PatchBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
router.patch(
  '/:boardId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.body, 'patchBoardBody'),
  SchemaValidator.validate(RequestPart.params, 'patchBoardParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  BoardAdapter.update,
);

/**
 * @swagger
 * definitions:
 *   PatchBoardRequest:
 *    type: object
 *    properties:
 *      title:
 *        type: string
 *      position:
 *        type: integer
 *      cardType:
 *        type: string
 *        enum: [0, 1, 2, 3, 4]
 *      description:
 *        type: string
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *   PatchBoardResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/board:
 *   post:
 *     tags:
 *       - Board
 *     description: Create new board
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/PatchBoardRequest'
 *     responses:
 *       200:
 *         description: "Board successfully updated"
 *         schema:
 *          $ref: '#/definitions/CreateBoardResponse'
 *       403:
 *         description: "This account is not allowed to edit this board"
 *         schema:
 *          $ref: '#/definitions/PatchBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
router.delete(
  '/:boardId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'deleteBoardParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  BoardAdapter.remove,
);

module.exports = {
  board: router,
};
