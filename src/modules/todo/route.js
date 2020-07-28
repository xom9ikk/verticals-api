const router = require('express').Router();
const { TodoAdapter } = require('./adapter');
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
 *   CreateTodoRequest:
 *    type: object
 *    required:
 *      - columnId
 *      - title
 *      - position
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
 *        enum: [0, 1, 2]
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isArchived:
 *        type: boolean
 *      isNotificationsEnabled:
 *        type: boolean
 *   CreateTodoResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           todoId:
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
router.post(
  '/',
  SchemaValidator.validate(RequestPart.body, 'createTodo'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  TodoAdapter.create,
);

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
 *             enum: [0, 1, 2]
 *           color:
 *             type: integer
 *             enum: [0, 1, 2, 3, 4, 5, 6]
 *           isArchived:
 *             type: boolean
 *           isNotificationsEnabled:
 *             type: boolean
 *       message:
 *         type: string
 * /v1/todo/:todoId
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
 *         name: todoId
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
router.get(
  '/:todoId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'getTodo'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  TodoAdapter.get,
);

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
 *           todoId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/todo
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
router.get(
  '/',
  FormatterMiddleware.castToInteger(RequestPart.query),
  SchemaValidator.validate(RequestPart.query, 'getTodosQuery'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  TodoAdapter.getAll,
);

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
 *        enum: [0, 1, 2]
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isArchived:
 *        type: boolean
 *      isNotificationsEnabled:
 *        type: boolean
 *   UpdateTodoResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/todo/:todoId
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
 *         name: todoId
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
router.patch(
  '/:todoId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.body, 'patchTodoBody'),
  SchemaValidator.validate(RequestPart.params, 'patchTodoParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  TodoAdapter.update,
);

/**
 * @swagger
 * definitions:
 *   DeleteTodoResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/todo/:todoId:
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
 *        name: todoId
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
router.delete(
  '/:todoId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'deleteTodoParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  TodoAdapter.remove,
);

// module.exports = {
//   todoRouter: router,
// };

module.exports = {
  todoRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createTodo'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      TodoAdapter.create,
    );
    fastify.get(
      '/:todoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getTodo'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      TodoAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.query),
          SchemaValidator.validate(RequestPart.query, 'getTodosQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      TodoAdapter.getAll,
    );
    fastify.patch(
      '/:todoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchTodoBody'),
          SchemaValidator.validate(RequestPart.params, 'patchTodoParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      TodoAdapter.update,
    );
    fastify.delete(
      '/:todoId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteTodoParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      TodoAdapter.remove,
    );
    done();
  },
};
