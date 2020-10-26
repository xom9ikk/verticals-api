const { UserAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FetchMiddleware,
  BusboyMiddleware,
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
 *   RegisterRequest:
 *    type: object
 *    required:
 *      - email
 *      - password
 *      - name
 *      - surname
 *      - username
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *        format: password
 *      name:
 *        type: string
 *      surname:
 *        type: string
 *      username:
 *        type: string
 *   RegisterResponse:
 *     type: object
 *     properties:
 *       data:
 *         type: object
 *         properties:
 *           token:
 *             type: string
 *           refreshToken:
 *             type: string
 *       message:
 *         type: string
 * /v1/auth/register:
 *   post:
 *     tags:
 *       - Authentication
 *     description: User registration
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/RegisterRequest'
 *     responses:
 *       200:
 *         description: "Pair of tokens was generated"
 *         schema:
 *          $ref: '#/definitions/RegisterResponse'
 *       403:
 *         description: "Email or password is wrong"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       409:
 *         description: "User with [name | email] already registered"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       422:
 *         description: "Field [field] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  userRouter: (fastify, opts, done) => {
    fastify.get(
      '/me',
      {
        preHandler: [
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      }, UserAdapter.me,
    );
    fastify.patch(
      '/',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'patchUserBody'),
          CheckMiddleware.isAuthenticated,
          CheckMiddleware.isUserExist,
          FetchMiddleware.getUserId,
        ],
      },
      UserAdapter.update,
    );
    fastify.post(
      '/avatar',
      {
        preHandler: [
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
          BusboyMiddleware.generateFileInfo,
        ],
      },
      UserAdapter.saveAvatar,
    );
    fastify.delete(
      '/avatar',
      {
        preHandler: [
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      },
      UserAdapter.removeAvatar,
    );
    done();
  },
};
