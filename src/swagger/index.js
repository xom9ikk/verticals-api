const swaggerJSDoc = require('swagger-jsdoc');

const {
  SWAGGER_JSON_ROUTE,
  SWAGGER_TITLE,
  SWAGGER_VERSION,
  SWAGGER_DESCRIPTION,
  SWAGGER_HOST,
  SWAGGER_BASE_PATH,
} = process.env;

// fastify.post(
//   '/register',
//   {
//     preHandler: [
//       SchemaValidator.validate(RequestPart.body, 'register'),
//       CheckMiddleware.isUserExist,
//     ],
//   },
//   AuthAdapter.register,
// );

module.exports = {
  swagger: [
    (fastify) => fastify.get(SWAGGER_JSON_ROUTE, (req, res) => {
      const apis = [
        `${__dirname}/../modules/**/*.js`,
      ];
      const options = {
        definition: {
          info: {
            title: SWAGGER_TITLE,
            version: SWAGGER_VERSION,
            description: SWAGGER_DESCRIPTION,
          },
          host: SWAGGER_HOST,
          basePath: SWAGGER_BASE_PATH,
        },
        apis,
      };
      // const data = swaggerJSDoc(options);
      // return res.code(200).send(data);
    }),
  ],
};
