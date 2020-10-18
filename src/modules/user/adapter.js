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
}

module.exports = {
  UserAdapter: new UserAdapter(),
};
