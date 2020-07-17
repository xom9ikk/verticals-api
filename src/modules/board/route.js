const router = require('express').Router();
const { BoardAdapter } = require('./adapter');
const { SchemaValidator, CheckMiddleware } = require('../../middlewares');

const { RequestPart } = SchemaValidator;
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
 *    required:
 *      - email
 *      - password
 *      - name
 *      - surname
 *      - username
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
 *       403:
 *         description: ""
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       409:
 *         description: ""
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
router.post(
  '/',
  SchemaValidator.validate(RequestPart.body, 'createBoard'),
  CheckMiddleware.isAuthenticated,
  BoardAdapter.create,
);

module.exports = {
  board: router,
};
