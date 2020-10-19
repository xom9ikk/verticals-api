const fs = require('fs');
const path = require('path');
const { v4: uuidV4 } = require('uuid');
const mime = require('mime-types');

const {
  FOLDER_UPLOADS,
  FOLDER_COMMENTS,
  FOLDER_AVATARS,
} = process.env;

class FileComponent {
  constructor() {
    this.folders = {
      comments: FileComponent.generateRelativePath(FOLDER_COMMENTS),
      avatars: FileComponent.generateRelativePath(FOLDER_AVATARS),
    };
  }

  static generateRelativePath(folder) {
    return path.join(FOLDER_UPLOADS, folder);
  }

  createFolders() {
    const folderKeys = Object.keys(this.folders);
    folderKeys.forEach((key) => {
      const absolutePathToFolder = path.resolve(this.folders[key]);
      this.createFolder(absolutePathToFolder);
    });
  }

  createFolder(pathToFolder) {
    fs.mkdirSync(pathToFolder, { recursive: true });
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
