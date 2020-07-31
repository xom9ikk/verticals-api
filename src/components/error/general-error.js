class GeneralError extends Error {
  constructor(
    status = 500,
    msg = 'Internal',
  ) {
    super();
    this.status = status;
    this.msg = msg;
  }
}

module.exports = {
  GeneralError,
};
