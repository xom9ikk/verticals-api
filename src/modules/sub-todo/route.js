const { SubTodoAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FormatterMiddleware,
  FetchMiddleware,
} = require('../../middlewares');

const { RequestPart } = require('../../constants');
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
 *   CreateTodoRequest:
 *    type: object
 *    required:
 *      - columnId
 *      - title
 *    properties:
 *      columnId:
 *        type: integer
 *      title:
 *        type: string
 *      position:
 *        type: integer
 *      description:
 *        type: string
 *      status:
 *        type: integer
 *        enum: [0, 1, 2, 3]
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isNotificationsEnabled:
 *        type: boolean
 *      expirationDate:
 *        type: date
 *   CreateTodoResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           subTodoId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/todo:
 *   post:
 *     tags:
 *       - Todo
 *     description: Create new todo
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
 *          $ref: '#/definitions/CreateTodoRequest'
 *     responses:
 *       200:
 *         description: "Todo successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateTodoResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetTodoResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           columnId:
 *             type: integer
 *           title:
 *             type: string
 *           position:
 *             type: integer
 *           description:
 *             type: string
 *           status:
 *             type: integer
 *             enum: [0, 1, 2, 3]
 *           color:
 *             type: integer
 *             enum: [0, 1, 2, 3, 4, 5, 6]
 *           isNotificationsEnabled:
 *             type: boolean
 *           expirationDate:
 *             type: date
 *       message:
 *         type: string
 * /v1/todo/:subTodoId:
 *   get:
 *     tags:
 *       - Todo
 *     description: Get todo info by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: subTodoId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Todo information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetTodoResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetAllTodosRequest:
 *    type: object
 *    properties:
 *      boardId:
 *        type: integer
 *      columnId:
 *        type: integer
 *   GetAllTodosResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           subTodoId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/todo:
 *   get:
 *     tags:
 *       - Todo
 *     description: Get all todos to which you have access
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
 *          $ref: '#/definitions/GetAllTodosRequest'
 *     responses:
 *       200:
 *         description: "Todos information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetAllTodosResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   UpdateTodoRequest:
 *    type: object
 *    properties:
 *      columnId:
 *        type: integer
 *      title:
 *        type: string
 *      position:
 *        type: integer
 *      description:
 *        type: string
 *      status:
 *        type: integer
 *        enum: [0, 1, 2, 3]
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isNotificationsEnabled:
 *        type: boolean
 *      expirationDate:
 *        type: date
 *   UpdateTodoResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/todo/:subTodoId:
 *   patch:
 *     tags:
 *       - Todo
 *     description: Update todo
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
 *          $ref: '#/definitions/UpdateTodoRequest'
 *       - in: path
 *         name: subTodoId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Todo successfully updated"
 *         schema:
 *          $ref: '#/definitions/UpdateTodoResponse'
 *       403:
 *         description: "This account is not allowed to edit this todo"
 *         schema:
 *          $ref: '#/definitions/UpdateTodoResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteTodoResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/todo/:subTodoId:
 *   delete:
 *     tags:
 *       - Todo
 *     description: Delete todo
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: subTodoId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Todo successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteTodoResponse'
 *       403:
 *         description: "This account is not allowed to delete this todo"
 *         schema:
 *          $ref: '#/definitions/DeleteTodoResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  subTodoRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createSubTodo'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.create,
    );
    fastify.get(
      '/:subTodoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getSubTodo'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.query),
          SchemaValidator.validate(RequestPart.query, 'getSubTodosQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.getAll,
    );
    fastify.patch(
      '/position',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'patchSubTodoPositionBody'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.updatePosition,
    );
    fastify.patch(
      '/:subTodoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchSubTodoBody'),
          SchemaValidator.validate(RequestPart.params, 'patchSubTodoParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.update,
    );
    fastify.post(
      '/duplicate',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'duplicateSubTodo'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.duplicate,
    );
    fastify.delete(
      '/:subTodoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteSubTodoParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SubTodoAdapter.remove,
    );
    done();
  },
};
