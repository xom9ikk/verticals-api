const { BackendResponse } = require('../../components');
const { UserController } = require('./controller');

class UserAdapter {
  async me(req, res) {
    const { userId } = req;
    const user = await UserController.me({ userId });
    return BackendResponse.Success(res, 'User data successfully received', user);
  }

  async update(req, res) {
    const { userId } = req;

    await UserController.update({
      userId,
      patch: req.body,
    });

    return BackendResponse.Success(res, 'User data successfully updated');
  }

  async saveAvatar(req, res) {
    const { userId, file } = req;
    const avatar = await UserController.saveAvatar({ userId, file });
    return BackendResponse.Success(res, 'Avatar uploaded successfully', { avatar });
  }

  async removeAvatar(req, res) {
    const { userId } = req;
    await UserController.removeAvatar({ userId });
    return BackendResponse.Success(res, 'Avatar successfully removed');
  }
}

module.exports = {
  UserAdapter: new UserAdapter(),
};
