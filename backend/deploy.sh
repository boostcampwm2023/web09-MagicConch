#!/bin/bash

GITHUB_SHA=$1
MAIN_SCRIPT="src/main.ts"
DEBUG_LOG="debug.log"
NPM_BUILD="npm run build"
NPM_PROD="npm run start:prod"

print_line() {
  echo " " >> $DEBUG_LOG
}

run_docker() {
  local RUN_TARGET="$1"

  DOCKER_COMPOSE_FILE="docker-compose.$GITHUB_SHA.$RUN_TARGET.yml"

  echo "<<< Run docker compose : $DOCKER_COMPOSE_FILE" > $DEBUG_LOG

  docker-compose -f "$DOCKER_COMPOSE_FILE" pull
  docker-compose -f "$DOCKER_COMPOSE_FILE" up -d

  echo ">>> Run complete" >> $DEBUG_LOG
  print_line
}

change_port() {
  local CONTAINER_ID="$1"
  local RUN_PORT="$2"
  local STOP_PORT="$3"

  echo "* kill process running on $STOP_PORT" >> $DEBUG_LOG
  docker exec $CONTAINER_ID /bin/bash -c "pkill -f ':$STOP_PORT'"
    
  echo "* change port : $STOP_PORT to $RUN_PORT" >> $DEBUG_LOG
  docker exec $CONTAINER_ID /bin/bash -c "sed -i 's/port: number = $STOP_PORT/port: number = $RUN_PORT/' $MAIN_SCRIPT"

  echo "* restart application : " >> $DEBUG_LOG
  docker exec -d $CONTAINER_ID /bin/bash -c "$NPM_BUILD && $NPM_PROD"
}

reload_application() {
  local CONTAINER_NAME="$1"
  local RUN_PORT="$2"
  local STOP_PORT="$3"

  CONTAINER_ID=$(docker ps --filter "name=$CONTAINER_NAME" -q)
  echo "<<< Reload $CONTAINER_NAME ( $CONTAINER_ID )" >> $DEBUG_LOG

  if ((RUN_PORT > 3001)); then
    change_port "$CONTAINER_ID" $RUN_PORT $STOP_PORT
    echo ">>> Reload complete : $CONTAINER_NAME running on $RUN_PORT" >> $DEBUG_LOG
  else
    echo ">>> Reload pass : $CONTAINER_NAME running on $RUN_PORT" >> $DEBUG_LOG
  fi
  print_line
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
  print_line
}

blue_green() {
  local RUN_TARGET="$1"
  local STOP_TARGET="$2"
  local WAS_RUN_PORT="$3"
  local WAS_STOP_PORT="$4"
  
  reload_application "was-$RUN_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT
  reload_application "signal-$RUN_TARGET" $((WAS_RUN_PORT + 1)) $((WAS_STOP_PORT + 1))

  wait 

  reload_nginx "$RUN_TARGET" "$STOP_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT

  echo "Delete .env file" >> $DEBUG_LOG
  print_line
  rm .env

  echo "Down old version" >> $DEBUG_LOG
  STOP_CONTAINER_ID=$(docker ps --filter "name=$STOP_TARGET" --quiet)
  if [ -n "$STOP_CONTAINER_ID" ]; then
    docker rm -f $STOP_CONTAINER_ID
  fi
}

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

run_docker "$RUN_TARGET"
blue_green "$RUN_TARGET" "$STOP_TARGET" $WAS_RUN_PORT $WAS_STOP_PORT