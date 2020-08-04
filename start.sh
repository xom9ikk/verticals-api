#!/bin/sh
echo 'env from sh'
echo $NODE_ENV
sleep 10
npm run knex migrate:latest --env $NODE_ENV
pm2-runtime start /app/ecosystem.config.js --env $NODE_ENV
