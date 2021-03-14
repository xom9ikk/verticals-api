module.exports = {
  apps: [{
    name: 'verticals',
    script: './src/index.js',
    exec_mode: 'cluster',
    // instances: 1,
    instances: 'max',
    node_args: '-r dotenv/config',
    env: {
      LOG_FILE_NAME: `app_${new Date().getTime()}`,
    },
    env_development: {
      watch: ['./src'],
      args: [
        '--color',
      ],
    },
    env_production: {
      NODE_ENV: 'production',
    },
  }],
};
