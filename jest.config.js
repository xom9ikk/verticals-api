module.exports = {
  verbose: true,
  globalSetup: './tests/setup.js',
  globalTeardown: './tests/teardown.js',
  setupFilesAfterEnv: ['./tests/dotenv-config.js'],
};
