const { BackendError } = require('../components/error');

const config = {
  defCharset: 'utf8',
  limits: {
    fields: 1,
    fileSize: 1048576, // 1 MB
    file: 1,
    parts: 1,
  },
};

class BusboyMiddleware {
  generateFileInfo(folderName = 'uploads') {
    return async (req, res) => {
      if (!req.isMultipart()) {
        throw new BackendError.UnprocessableEntity('Invalid multipart. Change the body and try again');
      }
      await BusboyMiddleware.generateFileInfo(req, res, folderName);
    };
  }

  static generateFileInfo(req) {
    return new Promise((resolve) => {
      req.multipart((fieldName, file, fileName, encoding, mimeType) => {
        req.file = {
          fieldName,
          file,
          fileName,
          encoding,
          mimeType,
          size: req.headers['content-length'],
        };
        resolve();
      }, () => {});
    });
  }
}

module.exports = {
  BusboyMiddleware: new BusboyMiddleware(),
};
