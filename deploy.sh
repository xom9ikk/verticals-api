sudo service nginx stop

APP_NAME='verticals-backend.xom9ik.com'
DOCKER_ADDRESS='172.50.15.1:8080'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='doc.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='172.50.15.1:8082'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='grafana.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='172.50.14.1:3000'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='prometheus.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='172.50.14.1:9090'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

sudo service nginx start
sh ./rebuild.sh
