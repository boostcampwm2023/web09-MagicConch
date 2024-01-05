#!/bin/bash

DEBUG_LOG="debug.log"
NPM_PROD="npm run start:prod"

run_docker() {
  local RUN_TARGET="$1"

  DOCKER_COMPOSE_FILE="compose.$RUN_TARGET-deploy.yml"

  echo "<<< Run docker compose : $DOCKER_COMPOSE_FILE" > $DEBUG_LOG

  docker-compose -f "$DOCKER_COMPOSE_FILE" pull
  docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

  echo ">>> Run complete" >> $DEBUG_LOG
}

reload_nginx() {
  local RUN_TARGET="$1"
  local STOP_TARGET="$2"
  local WAS_RUN_PORT="$3"
  local WAS_STOP_PORT="$4"

  echo "<<< Reload nginx" >> $DEBUG_LOG

  NGINX_ID=$(docker ps --filter "name=nginx" -q)
  NGINX_CONFIG="/etc/nginx/conf.d/default.conf"

  docker exec $NGINX_ID /bin/bash -c "sed -i 's/was-$STOP_TARGET:$WAS_STOP_PORT/was-$RUN_TARGET:$WAS_RUN_PORT/' $NGINX_CONFIG"
  docker exec $NGINX_ID /bin/bash -c "sed -i 's/signal-$STOP_TARGET:$((WAS_STOP_PORT + 1))/signal-$RUN_TARGET:$((WAS_RUN_PORT + 1))/' $NGINX_CONFIG"
  docker exec $NGINX_ID /bin/bash -c "nginx -s reload"

  echo ">>> Reload complete" >> $DEBUG_LOG
}

blue_green() {
  local RUN_TARGET="$1"
  local STOP_TARGET="$2"
  local WAS_RUN_PORT="$3"
  local WAS_STOP_PORT="$4"
  
  run_docker "$RUN_TARGET"

  sleep 30
  
  reload_nginx "$RUN_TARGET" "$STOP_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT

  echo "* Delete .env file" >> $DEBUG_LOG
  rm .env

  echo "* Down old version" >> $DEBUG_LOG
  STOP_CONTAINER_ID=$(docker ps --filter "name=$STOP_TARGET" --quiet)
  if [ -n "$STOP_CONTAINER_ID" ]; then
    docker stop $STOP_CONTAINER_ID
    docker rm $STOP_CONTAINER_ID
  fi
}

if docker ps --filter "name=blue" --format '{{.ID}}' | grep -E .; then
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

blue_green "$RUN_TARGET" "$STOP_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT
