#!/bin/bash

if docker ps --filter "name=was-blue" --quiet; then
  RUN_TARGET="green"
  STOP_TARGET="blue"
  WAS_RUN_PORT=3002
  WAS_STOP_PORT=3000
  echo "WAS_PORT=3002" >> .env
else
  RUN_TARGET="blue"
  STOP_TARGET="green"
  WAS_RUN_PORT=3000
  WAS_STOP_PORT=3002
fi

echo "Start building... >> RUN $RUN_TARGET / STOP $STOP_TARGET" > debug.log
docker-compose -f "docker-compose.${{ github.sha }}.${RUN_TARGET}.yml" pull
docker-compose -f "docker-compose.${{ github.sha }}.${RUN_TARGET}.yml" up -d
echo "Build Complete..." >> debug.log

echo "Start reloading... >> RUN $RUN_TARGET / STOP $STOP_TARGET" >> debug.log
sed -i "s/was-${STOP_TARGET}:${WAS_STOP_PORT}/was-${RUN_TARGET}:${WAS_RUN_PORT}/" config/nginx/default.conf
sed -i "s/signal-${STOP_TARGET}:${WAS_STOP_PORT + 1}/signal-${RUN_TARGET}:${WAS_RUN_PORT + 1}/" config/nginx/default.conf
docker-compose -f "docker-compose.${{ github.sha }}.${RUN_TARGET}.yml" exec nginx nginx -s reload
echo "Reload Complete..." >> debug.log

while [ -z "$(docker ps --filter "name=was-${RUN_TARGET}" --quiet)" ]; do
  sleep 3
done
sleep 60


rm .env
docker rm -f $(docker ps --filter "name=${STOP_TARGET}" --quiet)