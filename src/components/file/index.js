const fs = require('fs');
const path = require('path');
const { v4: uuidV4 } = require('uuid');
const mime = require('mime-types');

class FileComponent {
  saveCommentAttachment(data) {
    const relativePathToFolder = path.join(
      'uploads',
      'comments',
    );
    return this.saveFile(relativePathToFolder, data);
  }

  removeFile(relativePathToFile) {
    if (!relativePathToFile) return;
    return new Promise((resolve, reject) => {
      const fullPath = path.resolve(relativePathToFile);
      fs.unlink(fullPath, (e) => {
        if (e) {
          reject(e);
        }
        resolve();
      });
    });
  }

  saveFile(relativePathToFolder, data) {
    return new Promise((resolve, reject) => {
      const {
        fileName, mimeType, encoding, size, file,
      } = data;

      const extension = mime.extension(mimeType) || 'jpeg';

      const relativePathToFile = path.join(
        relativePathToFolder,
        `${path.basename(`${uuidV4()}`)}.${extension}`,
      );

      const fullPath = path.resolve(relativePathToFile);

      const stream = file.pipe(fs.createWriteStream(fullPath));

      stream.on('finish', () => resolve({
        path: relativePathToFile,
        extension,
        name: fileName,
        mimeType,
        encoding,
        size: parseInt(size),
      }));

      stream.on('error', (e) => reject(e));
    });
  }
}

module.exports = {
  FileComponent: new FileComponent(),
};
