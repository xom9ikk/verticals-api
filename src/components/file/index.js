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
      comments: FOLDER_COMMENTS,
      avatars: FOLDER_AVATARS,
    };
  }

  static generateRelativePath(folder) {
    return path.join(FOLDER_UPLOADS, folder);
  }

  createFolders() {
    const folderKeys = Object.keys(this.folders);
    folderKeys.forEach((key) => {
      const relativePath = FileComponent.generateRelativePath(this.folders[key]);
      const absolutePathToFolder = path.resolve(relativePath);
      this.createFolder(absolutePathToFolder);
    });
  }

  createFolder(absolutePathToFolder) {
    fs.mkdirSync(absolutePathToFolder, { recursive: true });
  }

  removeFile(pathPathToFile) {
    if (!pathPathToFile) return;
    const relativePathToFile = FileComponent.generateRelativePath(pathPathToFile);
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

  saveFile(pathToFolder, data) {
    return new Promise((resolve, reject) => {
      const {
        fileName, mimeType, encoding, size, file,
      } = data;

      const extension = mime.extension(mimeType) || 'jpeg';

      const pathToFile = path.join(pathToFolder, `${path.basename(`${uuidV4()}`)}.${extension}`);
      const relativePathToFile = FileComponent.generateRelativePath(pathToFile);

      const fullPath = path.resolve(relativePathToFile);

      const stream = file.pipe(fs.createWriteStream(fullPath));

      stream.on('finish', () => resolve({
        path: pathToFile,
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
