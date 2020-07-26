const router = require('express').Router();
const { RequestPart } = require('../../enums');
const { CommentAttachmentAdapter } = require('../comment-attachment/adapter');
const {
  SchemaValidator,
  CheckMiddleware,
  FormatterMiddleware,
  FetchMiddleware,
  BusboyMiddleware,
} = require('../../middlewares');

module.exports = {
  uploadRouter: router,
};
