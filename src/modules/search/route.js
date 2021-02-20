const { SearchAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
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
 *   SearchInTodoTitleRequest:
 *    type: object
 *    required:
 *      - query
 *    properties:
 *      query:
 *        type: string
 *   SearchInTodoTitleResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           todoProperty:
 *             type: integer
 *       message:
 *         type: string
 * /v1/search/todo-title:
 *   get:
 *     tags:
 *       - Search
 *     description: Search by todo title
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
 *          $ref: '#/definitions/SearchInTodoTitleRequest'
 *     responses:
 *       200:
 *         description: "Search was successful"
 *         schema:
 *          $ref: '#/definitions/SearchInTodoTitleResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  searchRouter: (fastify, opts, done) => {
    fastify.get(
      '/todo',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.query, 'searchInTodoQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      SearchAdapter.searchInTodo,
    );
    done();
  },
};
