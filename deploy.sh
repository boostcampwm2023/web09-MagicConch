#!/bin/bash

GITHUB_SHA=$1
MAIN_SCRIPT="src/main.ts"
DEBUG_LOG="debug.log"
NPM_BUILD="npm run build"
NPM_PROD="npm run start:prod"

if docker ps --filter "name=was-blue" --format '{{.ID}}' | grep -E .; then
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

DOCKER_COMPOSE_FILE="docker-compose.$GITHUB_SHA.$RUN_TARGET.yml"

docker-compose -f "$DOCKER_COMPOSE_FILE" pull
docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

reload_application() {
  local CONTAINER_NAME="$1"
  local RUN_PORT="$2"
  local STOP_PORT="$3"
  local CMD="$4"

  CONTAINER_ID=$(docker ps --filter "name=$CONTAINER_NAME" -q)

  PID=$(docker exec $CONTAINER_ID /bin/bash -c "lsof -t -i:$RUN_PORT")
  docker exec $CONTAINER_ID /bin/bash -c "kill -9 $PID"

  docker exec $CONTAINER_ID /bin/bash -c "sed -i 's/port: number = $STOP_PORT/port: number = $RUN_PORT/' $MAIN_SCRIPT"
  docker exec $CONTAINER_ID /bin/bash -c "$CMD"
}

reload_application "was-$RUN_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT "$NPM_BUILD && $NPM_PROD"
reload_application "signal-$RUN_TARGET" $((WAS_RUN_PORT + 1)) $((WAS_STOP_PORT + 1)) "$NPM_BUILD && $NPM_PROD"

NGINX_ID=$(docker ps --filter "name=nginx" -q)
NGINX_CONFIG="/etc/nginx/conf.d/default.conf"

docker exec $NGINX_ID /bin/bash -c "sed -i 's/was-$STOP_TARGET:$WAS_STOP_PORT/was-$RUN_TARGET:$WAS_RUN_PORT/' $NGINX_CONFIG"
docker exec $NGINX_ID /bin/bash -c "sed -i 's/signal-$STOP_TARGET:$((WAS_STOP_PORT + 1))/signal-$RUN_TARGET:$((WAS_RUN_PORT + 1))/' $NGINX_CONFIG"
docker exec $NGINX_ID nginx -s reload

while [ -z "$(docker ps --filter "name=was-$RUN_TARGET" --quiet)" ]; do
  sleep 3
done

sleep 60
rm .env

STOP_CONTAINER_ID=$(docker ps --filter "name=$STOP_TARGET" --quiet)
if [ -n "$STOP_CONTAINER_ID" ]; then
  docker rm -f $STOP_CONTAINER_ID
fi