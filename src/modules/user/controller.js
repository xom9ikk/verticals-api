const { BackendError } = require('../../components');
const {
  UserService,
} = require('../../services');

class UserController {
  async me({ userId }) {
    const user = await UserService.getById(userId);
    if (!user) {
      throw new BackendError.NotFound('User not found');
    }
    return user;
  }

  async update({ userId, patch }) {
    await UserService.update(userId, patch);
    return true;
  }
}

module.exports = {
  UserController: new UserController(),
};
