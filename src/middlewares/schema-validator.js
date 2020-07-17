const ajv = require('ajv');
const { BackendError } = require('../components');

const { AuthSchema } = require('../modules/auth/schemas');

class SchemaValidator {
  constructor() {
    this.RequestPart = {
      body: 'body',
      query: 'query',
      params: 'params',
    };
    this.ajv = ajv({
      allErrors: true,
      removeAdditional: 'all',
    });
    Object.keys(AuthSchema).map((key) => this.ajv.addSchema(AuthSchema[key], key));
  }

  errorResponse(schemaErrors) {
    const [firstError] = schemaErrors;
    const fieldWithError = firstError.dataPath.slice(1);
    throw new BackendError.BadRequest(`Field '${fieldWithError}' in request do not match expected`);
  }

  validate(type, schemaName) {
    return (req, res, next) => {
      const valid = this.ajv.validate(schemaName, req[type]);
      if (!valid) {
        this.errorResponse(this.ajv.errors);
      } else {
        next();
      }
    };
  }
}

module.exports = {
  SchemaValidator: new SchemaValidator(),
};
