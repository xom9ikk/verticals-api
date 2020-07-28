const { BackendError } = require('../components/error');

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
