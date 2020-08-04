APP_NAME='verticals-backend.xom9ik.com'
DOCKER_ADDRESS='verticals_backend:3000'
sudo service nginx stop
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='doc.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='verticals_backend_swagger:3002'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='grafana.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='verticals_backend_grafana:4000'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

APP_NAME='prometheus.verticals-backend.xom9ik.com'
DOCKER_ADDRESS='verticals_backend_prometheus:9090'
sh ./generate-conf.sh $APP_NAME $DOCKER_ADDRESS

sudo service nginx start
sh ./rebuild.sh
