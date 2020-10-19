const { BackendError, FileComponent } = require('../../components');
const {
  UserService,
} = require('../../services');

const { CDN_DOMAIN } = process.env;

// TODO: tests
class UserController {
  async me({ userId }) {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new BackendError.NotFound('User not found');
    }

    const avatar = user.avatar ? `http://${CDN_DOMAIN}/${user.avatar}` : user.avatar;

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

    return path;
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
