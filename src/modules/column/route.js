const { ColumnAdapter } = require('./adapter');
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
 *   CreateColumnRequest:
 *    type: object
 *    required:
 *      - boardId
 *      - title
 *    properties:
 *      boardId:
 *        type: integer
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isCollapsed:
 *        type: boolean
 *   CreateColumnResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           columnId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/column:
 *   post:
 *     tags:
 *       - Column
 *     description: Create new column
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
 *          $ref: '#/definitions/CreateColumnRequest'
 *     responses:
 *       200:
 *         description: "Column successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateColumnResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetColumnResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           boardId:
 *             type: integer
 *           title:
 *             type: string
 *           position:
 *             type: integer
 *           description:
 *             type: string
 *           color:
 *             type: integer
 *             enum: [0, 1, 2, 3, 4, 5, 6]
 *           isCollapsed:
 *             type: boolean
 *       message:
 *         type: string
 * /v1/column/:columnId:
 *   get:
 *     tags:
 *       - Column
 *     description: Get column info by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: columnId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Column information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetColumnResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetAllColumnsRequest:
 *    type: object
 *    properties:
 *      boardId:
 *        type: integer
 *   GetAllColumnsResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           columnId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/column:
 *   get:
 *     tags:
 *       - Column
 *     description: Get all columns to which you have access
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
 *          $ref: '#/definitions/GetAllColumnsRequest'
 *     responses:
 *       200:
 *         description: "Columns information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetAllColumnsResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   UpdateColumnRequest:
 *    type: object
 *    properties:
 *      boardId:
 *        type: integer
 *      title:
 *        type: string
 *      description:
 *        type: string
 *      color:
 *        type: integer
 *        enum: [0, 1, 2, 3, 4, 5, 6]
 *      isCollapsed:
 *        type: boolean
 *   UpdateColumnResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/column/:columnId:
 *   patch:
 *     tags:
 *       - Column
 *     description: Update column
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
 *          $ref: '#/definitions/UpdateColumnRequest'
 *       - in: path
 *         name: columnId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Column successfully updated"
 *         schema:
 *          $ref: '#/definitions/UpdateColumnResponse'
 *       403:
 *         description: "This account is not allowed to edit this column"
 *         schema:
 *          $ref: '#/definitions/UpdateColumnResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteColumnResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/column/:columnId:
 *   delete:
 *     tags:
 *       - Column
 *     description: Delete column
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: columnId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Column successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteColumnResponse'
 *       403:
 *         description: "This account is not allowed to delete this column"
 *         schema:
 *          $ref: '#/definitions/DeleteColumnResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  columnRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createColumn'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.create,
    );
    fastify.get(
      '/:columnId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getColumn'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getColumnsQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.getAll,
    );
    fastify.patch(
      '/position',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'patchColumnPositionBody'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.updatePosition,
    );
    fastify.patch(
      '/:columnId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchColumnBody'),
          SchemaValidator.validate(RequestPart.params, 'patchColumnParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.update,
    );
    fastify.delete(
      '/:columnId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteColumnParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      ColumnAdapter.remove,
    );
    done();
  },
};
