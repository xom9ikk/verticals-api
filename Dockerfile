FROM keymetrics/pm2:12-alpine

WORKDIR /app

ENV NODE_OPTIONS="--max-old-space-size=6000"

COPY / /app

RUN npm i

CMD [ "pm2-runtime", "start", "/app/ecosystem.config.js", "--env", "production" ]
