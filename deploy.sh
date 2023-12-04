#!/bin/bash

GITHUB_SHA=$1
MAIN_SCRIPT="src/main.ts"
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

echo ">>> Start image building... docker-compose.$GITHUB_SHA.$RUN_TARGET.yml" > debug.log

docker-compose -f "docker-compose.$GITHUB_SHA.$RUN_TARGET.yml" pull
docker-compose -f "docker-compose.$GITHUB_SHA.$RUN_TARGET.yml" up -d

echo "<<< Build Complete..." >> debug.log


echo ">>> Start was reloading..." >> debug.log

WAS_ID=$(docker ps --filter "name=was-$RUN_TARGET" -q)
WAS_PID=$(lsof -t -i:$WAS_RUN_PORT)
kill -9 $WAS_PID

docker exec $WAS_ID /bin/bash -c "sed -i 's/port: number = $WAS_STOP_PORT/port: number = $WAS_RUN_PORT/' $MAIN_SCRIPT"
docker exec $WAS_ID /bin/bash -c "$NPM_BUILD"
docker exec $WAS_ID /bin/bash -c "$NPM_PROD"

echo "<<< Reload Complete..." >> debug.log


echo ">>> Start signal reloading..." >> debug.log

SIGNAL_ID=$(docker ps --filter "name=signal-$RUN_TARGET" -q)
SIGNAL_PID=$(lsof -t -i:$((WAS_RUN_PORT + 1)))
kill -9 $SIGNAL_PID

docker exec $SIGNAL_ID /bin/bash -c "sed -i 's/port: number = $((WAS_STOP_PORT + 1))/port: number = $((WAS_RUN_PORT + 1))/' $MAIN_SCRIPT"
docker exec $SIGNAL_ID /bin/bash -c "$NPM_BUILD"
docker exec $SIGNAL_ID /bin/bash -c "$NPM_PROD"

echo "<<< Reload Complete..." >> debug.log


echo ">>> Start nginx reloading..." >> debug.log

NGINX_ID=$(docker ps --filter "name=nginx" -q)
NGINX_CONFIG="/etc/nginx/conf.d/default.conf"

docker exec $NGINX_ID /bin/bash -c "sed -i 's/was-$STOP_TARGET:$WAS_STOP_PORT/was-$RUN_TARGET:$WAS_RUN_PORT/' $NGINX_CONFIG"
docker exec $NGINX_ID /bin/bash -c "sed -i 's/signal-$STOP_TARGET:$((WAS_STOP_PORT + 1))/signal-$RUN_TARGET:$((WAS_RUN_PORT + 1))/' $NGINX_CONFIG"
docker exec $NGINX_ID nginx -s reload

echo "<<< Reload Complete..." >> debug.log


while [ -z "$(docker ps --filter "name=was-$RUN_TARGET" --quiet)" ]; do
  sleep 3
done

sleep 60
rm .env
docker rm -f $(docker ps --filter "name=$STOP_TARGET" --quiet)
