const { HeadingAdapter } = require('./adapter');
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
 *   CreateHeadingRequest:
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
 *      width:
 *        type: number
 *   CreateHeadingResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           headingId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/heading:
 *   post:
 *     tags:
 *       - Heading
 *     description: Create new heading
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
 *          $ref: '#/definitions/CreateHeadingRequest'
 *     responses:
 *       200:
 *         description: "Heading successfully created"
 *         schema:
 *          $ref: '#/definitions/CreateHeadingResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetHeadingResponse:
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
 *           width:
 *             type: number
 *       message:
 *         type: string
 * /v1/heading/:headingId:
 *   get:
 *     tags:
 *       - Heading
 *     description: Get heading info by id
 *     produces:
 *       - application/json
 *     parameters:
 *       - in: header
 *         name: Authorization
 *         type: string
 *         required: true
 *       - in: path
 *         name: headingId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Heading information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetHeadingResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   GetAllHeadingsRequest:
 *    type: object
 *    properties:
 *      boardId:
 *        type: integer
 *   GetAllHeadingsResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           headingId:
 *             type: integer
 *       message:
 *         type: string
 * /v1/heading:
 *   get:
 *     tags:
 *       - Heading
 *     description: Get all headings to which you have access
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
 *          $ref: '#/definitions/GetAllHeadingsRequest'
 *     responses:
 *       200:
 *         description: "Headings information successfully received"
 *         schema:
 *          $ref: '#/definitions/GetAllHeadingsResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   UpdateHeadingRequest:
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
 *      width:
 *        type: number
 *   UpdateHeadingResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/heading/:headingId:
 *   patch:
 *     tags:
 *       - Heading
 *     description: Update heading
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
 *          $ref: '#/definitions/UpdateHeadingRequest'
 *       - in: path
 *         name: headingId
 *         type: integer
 *         required: true
 *     responses:
 *       200:
 *         description: "Heading successfully updated"
 *         schema:
 *          $ref: '#/definitions/UpdateHeadingResponse'
 *       403:
 *         description: "This account is not allowed to edit this heading"
 *         schema:
 *          $ref: '#/definitions/UpdateHeadingResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   DeleteHeadingResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/heading/:headingId:
 *   delete:
 *     tags:
 *       - Heading
 *     description: Delete heading
 *     produces:
 *       - application/json
 *     parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: path
 *        name: headingId
 *        type: integer
 *        required: true
 *     responses:
 *       200:
 *         description: "Heading successfully deleted"
 *         schema:
 *          $ref: '#/definitions/DeleteHeadingResponse'
 *       403:
 *         description: "This account is not allowed to delete this heading"
 *         schema:
 *          $ref: '#/definitions/DeleteHeadingResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  headingRouter: (fastify, opts, done) => {
    fastify.post(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'createHeading'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.create,
    );
    fastify.get(
      '/:headingId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getHeading'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.get,
    );
    fastify.get(
      '/',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'getHeadingsQuery'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.getAll,
    );
    fastify.patch(
      '/position',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'patchHeadingPositionBody'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.updatePosition,
    );
    fastify.patch(
      '/:headingId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.body, 'patchHeadingBody'),
          SchemaValidator.validate(RequestPart.params, 'patchHeadingParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.update,
    );
    fastify.post(
      '/duplicate',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'duplicateHeading'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.duplicate,
    );
    fastify.delete(
      '/:headingId',
      {
        preHandler: [
          FormatterMiddleware.castToInteger(RequestPart.params),
          SchemaValidator.validate(RequestPart.params, 'deleteHeadingParams'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      HeadingAdapter.remove,
    );
    done();
  },
};
