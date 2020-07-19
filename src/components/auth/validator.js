const { UserService, TokenService } = require('../../services');

class ValidatorComponent {
  async isExistEmail(email) {
    const emailExist = await UserService.getByEmail(email);
    return !!emailExist;
  }

  async isExistUsername(username) {
    const usernameExist = await UserService.getByUsername(username);
    return !!usernameExist;
  }

  async isActiveToken(token) {
    const activeToken = await TokenService.getByToken(token);
    return !!activeToken;
  }
}

module.exports = {
  ValidatorComponent: new ValidatorComponent(),
};
