const Busboy = require('busboy');
const { BackendError } = require('../components');

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
    return async (req, res, next) => {
      try {
        await BusboyMiddleware.generateFileInfo(req, res, folderName);
        next();
      } catch (e) {
        next(new BackendError.UnprocessableEntity('The request was made incorrectly'));
      }
    };
  }

  static generateFileInfo(req, res) {
    return new Promise((resolve, reject) => {
      const busboy = new Busboy({
        headers: req.headers,
        ...config,
      });

      busboy.on('file', (fieldName, file, fileName, encoding, mimeType) => {
        res.locals.file = {
          fieldName,
          file,
          fileName,
          encoding,
          mimeType,
          size: req.headers['content-length'],
        };
        resolve();
      });

      busboy.on('error', (e) => {
        reject(e);
      });

      req.pipe(busboy);
    });
  }
}

module.exports = {
  BusboyMiddleware: new BusboyMiddleware(),
};
