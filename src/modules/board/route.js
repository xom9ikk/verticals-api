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
 *    required:
 *      - title
 *      - cardType
 *    properties:
 *      title:
 *        type: string
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
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
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

/**
 * @swagger
 * definitions:
 *   GetBoardResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *           title:
 *             type: string
 *           position:
 *             type: integer
 *           cardType:
 *             type: string
 *             enum: [0, 1, 2, 3, 4]
 *           description:
 *             type: string
 *           color:
 *             type: integer
 *             enum: [0, 1, 2, 3, 4, 5, 6]
 *       message:
 *         type: string
 * /v1/board/:boardId:
 *   get:
 *     tags:
 *       - Board
 *     description: Get board info by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: boardId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Board information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetAllBoardsResponse:
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
 *   get:
 *     tags:
 *       - Board
 *     description: Get all boards to which you have access
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *     responses:
 *       200:
 *         description: "Boards information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetAllBoardsResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   UpdateBoardRequest:
 *    type: object
 *    required:
 *      - title
 *      - position
 *      - cardType
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
 *   UpdateBoardResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/board/:boardId:
 *   patch:
 *     tags:
 *       - Board
 *     description: Update board
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
 *          $ref: '#/definitions/UpdateBoardRequest'
 *       - in: path
 *         name: boardId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Board successfully updated"
 *         schema:
 *          $ref: '#/definitions/UpdateBoardResponse'
 *       403:
 *         description: "This account is not allowed to edit this board"
 *         schema:
 *          $ref: '#/definitions/UpdateBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteBoardResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/board/:boardId:
 *   delete:
 *     tags:
 *       - Board
 *     description: Delete board
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: boardId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Board successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteBoardResponse'
 *       403:
 *         description: "This account is not allowed to delete this board"
 *         schema:
 *          $ref: '#/definitions/DeleteBoardResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  boardRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createBoard'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      BoardAdapter.create,
    );
    fastify.get(
      '/:boardId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getBoard'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      BoardAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      BoardAdapter.getAll,
    );
    fastify.patch(
      '/:boardId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchBoardBody'),
          SchemaValidator.validate(RequestPart.params, 'patchBoardParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      BoardAdapter.update,
    );
    fastify.delete(
      '/:boardId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteBoardParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      BoardAdapter.remove,
    );
    done();
  },
};
