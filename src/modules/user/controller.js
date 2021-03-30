const { BackendError, FileComponent, TransformerComponent } = require('../../components');
const {
  UserService,
} = require('../../services');

class UserController {
  async me({ userId }) {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new BackendError.NotFound('User not found');
    }

    const avatar = TransformerComponent.transformLink(user.avatar);

    return {
      ...user,
      avatar,
    };
  }

  async update({ userId, patch }) {
    await UserService.update(userId, patch);
    return true;
  }

  async saveAvatar({ userId, file }) {
    const { path } = await FileComponent.saveFile(FileComponent.folders.avatars, file);

    await UserService.update(userId, {
      avatar: path,
    });

    return TransformerComponent.transformLink(path);
  }

  async removeAvatar({ userId }) {
    await UserService.update(userId, {
      avatar: null,
    });

    return true;
  }
}

module.exports = {
  UserController: new UserController(),
};
