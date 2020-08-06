sudo service nginx stop

APP_NAME='backend.verticals.xom9ik.com'
DOCKER_ADDRESS='172.50.15.1:8080'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='doc.backend.verticals.xom9ik.com'
DOCKER_ADDRESS='172.50.15.1:8082'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='grafana.backend.verticals.xom9ik.com'
DOCKER_ADDRESS='172.50.14.1:3000'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='prometheus.backend.verticals.xom9ik.com'
DOCKER_ADDRESS='172.50.14.1:9090'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='cdn.verticals.xom9ik.com'
STATIC_FOLDER=$PWD/uploads
IS_STATIC=true
sh ./generate-conf.sh $APP_NAME $STATIC_FOLDER $IS_STATIC

sudo service nginx start
sh ./rebuild.sh
