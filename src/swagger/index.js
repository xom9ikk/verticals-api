const swaggerJSDoc = require('swagger-jsdoc');
const { version } = require('../../package.json');

const {
  SWAGGER_JSON_ROUTE,
  SWAGGER_TITLE,
  SWAGGER_DESCRIPTION,
  SWAGGER_HOST,
  SWAGGER_BASE_PATH,
} = process.env;

module.exports = {
  swagger: (fastify) => fastify.get(SWAGGER_JSON_ROUTE, (req, res) => {
    const apis = [
      `${__dirname}/../modules/**/*.js`,
    ];
    const options = {
      definition: {
        info: {
          title: SWAGGER_TITLE,
          version,
          description: SWAGGER_DESCRIPTION,
        },
        host: SWAGGER_HOST,
        basePath: SWAGGER_BASE_PATH,
      },
      apis,
    };
    const data = swaggerJSDoc(options);
    return res.code(200).send(data);
  }),
};
