const ajv = require('ajv');
const { BackendError } = require('../components');

const { AuthSchema } = require('../modules/auth/schemas');
const { BoardSchema } = require('../modules/board/schemas');
const { ColumnSchema } = require('../modules/column/schemas');
const { TodoSchema } = require('../modules/todo/schemas');

class SchemaValidator {
  constructor() {
    this.ajv = ajv({
      allErrors: true,
      removeAdditional: 'all',
    });
    Object.keys(AuthSchema).map((key) => this.ajv.addSchema(AuthSchema[key], key));
    Object.keys(BoardSchema).map((key) => this.ajv.addSchema(BoardSchema[key], key));
    Object.keys(ColumnSchema).map((key) => this.ajv.addSchema(ColumnSchema[key], key));
    Object.keys(TodoSchema).map((key) => this.ajv.addSchema(TodoSchema[key], key));
  }

  errorResponse(schemaErrors) {
    const [firstError] = schemaErrors;
    const fieldWithError = firstError.dataPath.slice(1);
    const {
      keyword,
      params: {
        missingProperty, limit, allowedValues,
      },
      message,
    } = firstError;
    console.log(firstError);
    if (keyword === 'required') {
      throw new BackendError.BadRequest(`The required parameter '${missingProperty}' is missing`);
    }
    if (keyword === 'maxLength') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' should not be longer than ${limit} characters`);
    }
    if (keyword === 'minLength') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' should be longer than ${limit} characters`);
    }
    if (keyword === 'type') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' ${message}`);
    }
    if (keyword === 'enum') {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' ${message}: [${allowedValues}]`);
    }
    if (fieldWithError) {
      throw new BackendError.BadRequest(`Field '${fieldWithError}' do not match expected`);
    }
    throw new BackendError.BadRequest('Request field(s) do not match expected');
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
