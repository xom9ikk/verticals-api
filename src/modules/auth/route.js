const { AuthAdapter } = require('./adapter');
const {
  SchemaValidator,
  CheckMiddleware,
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

/**
 * @swagger
 * definitions:
 *   LoginRequest:
 *    type: object
 *    required:
 *      - email
 *      - password
 *    properties:
 *      email:
 *        type: string
 *        format: email
 *      password:
 *        type: string
 *        format: password
 *      username:
 *        type: string
 *   LoginResponse:
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
 * /v1/auth/login:
 *   post:
 *     tags:
 *       - Authentication
 *     description: User authentication
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/LoginRequest'
 *     responses:
 *       200:
 *         description: "Pair of tokens was generated"
 *         schema:
 *          $ref: '#/definitions/LoginResponse'
 *       403:
 *         description: "Email or password is wrong"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       422:
 *         description: "Field [fieldName] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   RefreshRequest:
 *    type: object
 *    required:
 *      - refreshToken
 *    properties:
 *      refreshToken:
 *        type: string
 *   RefreshResponse:
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
 * /v1/auth/refresh:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Refresh pair of tokens by refresh token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/RefreshRequest'
 *     responses:
 *       200:
 *         description: "Pair of tokens was refreshed"
 *         schema:
 *          $ref: '#/definitions/RefreshResponse'
 *       403:
 *         description: "Invalid refresh token: [refreshToken]"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       422:
 *         description: "Field [fieldName] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

/**
 * @swagger
 * definitions:
 *   LogoutRequest:
 *    type: object
 *    required:
 *      - refreshToken
 *    properties:
 *      refreshToken:
 *        type: string
 *   LogoutResponse:
 *     type: object
 *     properties:
 *       message:
 *         type: string
 * /v1/auth/logout:
 *   post:
 *     tags:
 *       - Authentication
 *     description: Logging out a user by token
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: body
 *         in: body
 *         required: true
 *         schema:
 *          $ref: '#/definitions/LogoutRequest'
 *     responses:
 *       200:
 *         description: "Success logout"
 *         schema:
 *          $ref: '#/definitions/LogoutResponse'
 *       403:
 *         description: "Token does not contain Bearer | Invalid token signature"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 *       422:
 *         description: "Field [fieldName] in request do not match expected"
 *         schema:
 *          $ref: '#/definitions/ErrorResponse'
 */

module.exports = {
  authRouter: (fastify, opts, done) => {
    fastify.post(
      '/register',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'register'),
          CheckMiddleware.isUserExist,
        ],
      },
      AuthAdapter.register,
    );
    fastify.post(
      '/login',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'login'),
        ],
      }, AuthAdapter.login,
    );
    fastify.post(
      '/refresh',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'refresh'),
        ],
      }, AuthAdapter.refresh,
    );
    fastify.post(
      '/logout',
      {
        preHandler: [
          CheckMiddleware.isAuthenticated,
        ],
      }, AuthAdapter.logout,
    );
    fastify.post(
      '/change-password',
      {
        preHandler: [
          SchemaValidator.validate(RequestPart.body, 'changePassword'),
          CheckMiddleware.isAuthenticated,
          FetchMiddleware.getUserId,
        ],
      }, AuthAdapter.changePassword,
    );
    done();
  },
};
