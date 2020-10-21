const { BackendError, FileComponent } = require('../../components');
const {
  UserService,
} = require('../../services');

const { CDN_DOMAIN } = process.env;

const transformAvatarLink = (avatar) => (avatar ? `http://${CDN_DOMAIN}/${avatar}` : avatar);

// TODO: tests
class UserController {
  async me({ userId }) {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new BackendError.NotFound('User not found');
    }

    const avatar = transformAvatarLink(user.avatar);

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

    return transformAvatarLink(path);
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
