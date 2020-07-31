/* eslint-disable no-underscore-dangle */
const ajv = require('ajv');
const { SocketError } = require('../components/error');
const { BackendError } = require('../components/error');

const { AuthSchema } = require('../modules/auth/schemas');
const { BoardSchema } = require('../modules/board/schemas');
const { ColumnSchema } = require('../modules/column/schemas');
const { TodoSchema } = require('../modules/todo/schemas');
const { CommentSchema } = require('../modules/comment/schemas');
const { CommentAttachmentSchema } = require('../modules/comment-attachment/schemas');
const { WssUpdatesSchema } = require('../modules/updates/schemas');

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
    Object.keys(CommentSchema).map((key) => this.ajv.addSchema(CommentSchema[key], key));
    Object.keys(CommentAttachmentSchema).map((key) => this.ajv.addSchema(CommentAttachmentSchema[key], key));
    Object.keys(WssUpdatesSchema).map((key) => this.ajv.addSchema(WssUpdatesSchema[key], key));
  }

  errorResponse(schemaErrors, ErrorInitiator) {
    if (!schemaErrors) {
      throw new ErrorInitiator('Request field(s) do not match expected');
    }
    const [firstError] = schemaErrors;
    const fieldWithError = firstError.dataPath.slice(1);
    const {
      keyword,
      params: {
        missingProperty, limit, allowedValues,
      },
      message,
    } = firstError;
    if (keyword === 'required') {
      throw new ErrorInitiator(`The required parameter '${missingProperty}' is missing`);
    }
    if (keyword === 'maxLength') {
      throw new ErrorInitiator(`Field '${fieldWithError}' should not be longer than ${limit} characters`);
    }
    if (keyword === 'minLength') {
      throw new ErrorInitiator(`Field '${fieldWithError}' should be longer than ${limit} characters`);
    }
    if (keyword === 'type') {
      throw new ErrorInitiator(`Field '${fieldWithError}' ${message}`);
    }
    if (keyword === 'enum') {
      throw new ErrorInitiator(`Field '${fieldWithError}' ${message}: [${allowedValues}]`);
    }
    if (fieldWithError) {
      throw new ErrorInitiator(`Field '${fieldWithError}' do not match expected`);
    }
    throw new ErrorInitiator('Request field(s) do not match expected');
  }

  async _validate(schemaName, data, ErrorInitiator) {
    const valid = this.ajv.validate(schemaName, data);
    if (!valid) {
      return this.errorResponse(this.ajv.errors, ErrorInitiator);
    }
  }

  validate(type, schemaName) {
    return async (req) => {
      await this._validate(schemaName, req[type] || {}, BackendError.BadRequest);
    };
  }

  validateSocketContent(schemaName) {
    return async (context, messageContext) => {
      await this._validate(schemaName, messageContext.content || {}, SocketError.UnsupportedData);
    };
  }
}

module.exports = {
  SchemaValidator: new SchemaValidator(),
};
