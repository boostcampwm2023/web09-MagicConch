#!/bin/bash

if sudo docker ps --filter "name=blue" --format '{{.ID}}' | grep -E .; then
  RUN_TARGET="green"
  STOP_TARGET="blue"
  WAS_RUN_PORT=3002
  WAS_STOP_PORT=3000
else
  RUN_TARGET="blue"
  STOP_TARGET="green"
  WAS_RUN_PORT=3000
  WAS_STOP_PORT=3002
fi

DOCKER_COMPOSE_FILE="compose.$RUN_TARGET-deploy.yml"

sudo docker-compose -f "$DOCKER_COMPOSE_FILE" pull
sudo docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

sleep 10

NGINX_ID=$(sudo docker ps --filter "name=nginx" --quiet)
NGINX_CONFIG="/etc/nginx/conf.d/default.conf"

sudo docker exec $NGINX_ID /bin/bash -c "sed -i 's/was-$STOP_TARGET:$WAS_STOP_PORT/was-$RUN_TARGET:$WAS_RUN_PORT/' $NGINX_CONFIG"
sudo docker exec $NGINX_ID /bin/bash -c "sed -i 's/signal-$STOP_TARGET:$((WAS_STOP_PORT + 1))/signal-$RUN_TARGET:$((WAS_RUN_PORT + 1))/' $NGINX_CONFIG"
sudo docker exec $NGINX_ID /bin/bash -c "nginx -s reload"

rm .env

STOP_CONTAINER_ID=$(sudo docker ps --filter "name=$STOP_TARGET" --quiet)
if [ -n "$STOP_CONTAINER_ID" ]; then
  sudo docker stop $STOP_CONTAINER_ID
  sudo docker rm $STOP_CONTAINER_ID
  sudo docker image prune -af
fi