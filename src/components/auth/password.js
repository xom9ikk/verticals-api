const { compare, hash } = require('bcryptjs');

class PasswordComponent {
  hash(password) {
    return hash(password, 10);
  }

  compare(userInput, password) {
    return compare(userInput, password);
  }
}

module.exports = {
  PasswordComponent: new PasswordComponent(),
};
