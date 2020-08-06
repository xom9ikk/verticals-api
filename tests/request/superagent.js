const superagent = require('superagent');
const superagentAbsolute = require('superagent-absolute');

class SuperagentRequest {
  constructor(baseUrl) {
    return {
      request: () => superagentAbsolute(superagent.agent())(baseUrl),
    };
  }
}

module.exports = {
  SuperagentRequest,
};
