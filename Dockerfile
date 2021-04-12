FROM keymetrics/pm2:12-alpine

WORKDIR /app

ARG NODE_ENV='development'

ENV NODE_ENV=$NODE_ENV

ENV NODE_OPTIONS="--max-old-space-size=1024"

COPY / /app

RUN npm i --production
RUN chmod +x ./start.sh

CMD ["./start.sh"]
