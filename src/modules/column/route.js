const router = require('express').Router();
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
 *    properties:
 *      boardId:
 *        type: integer
 *      title:
 *        type: string
 *      position:
 *        type: integer
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
router.post(
  '/',
  SchemaValidator.validate(RequestPart.body, 'createColumn'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  ColumnAdapter.create,
);

/**
 * @swagger
 * definitions:
 *   GetColumnResponse:
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
 *            message:
 *              type: string
 * /v1/column/:columnId
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
 *         name: type
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
router.get(
  '/:columnId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'getColumn'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  ColumnAdapter.get,
);

/**
 * @swagger
 * definitions:
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
 * /v1/column
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
router.get(
  '/',
  FormatterMiddleware.castToInteger(RequestPart.query),
  SchemaValidator.validate(RequestPart.query, 'getColumnsQuery'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  ColumnAdapter.getAll,
);

/**
 * @swagger
 * definitions:
 *   PatchColumnResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/column/:columnId
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
 *       - in: path
 *         name: type
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Column successfully updated"
 *         schema:
 *          $ref: '#/definitions/PatchColumnResponse'
 *       403:
 *         description: "This account is not allowed to edit this column"
 *         schema:
 *          $ref: '#/definitions/PatchColumnResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */
router.patch(
  '/:columnId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.body, 'patchColumnBody'),
  SchemaValidator.validate(RequestPart.params, 'patchColumnParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  ColumnAdapter.update,
);

/**
 * @swagger
 * definitions:
 *   DeleteColumnResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/column/:columnId:
 *   post:
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
 *        name: type
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
router.delete(
  '/:columnId',
  FormatterMiddleware.castToInteger(RequestPart.params),
  SchemaValidator.validate(RequestPart.params, 'deleteColumnParams'),
  CheckMiddleware.isAuthenticated,
  FetchMiddleware.getUserId,
  ColumnAdapter.remove,
);

module.exports = {
  columnRouter: router,
};
