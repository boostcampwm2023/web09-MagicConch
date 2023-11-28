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

docker-compose -f docker-compose.${RUN_TARGET}.${{ github.sha }}.yml up -d
sed -i "s/was-${STOP_TARGET}:${WAS_STOP_PORT}/was-${RUN_TARGET}:${WAS_RUN_PORT}/" config/nginx/nginx.conf
sed -i "s/signal-${STOP_TARGET}:${WAS_STOP_PORT + 1}/signal-${RUN_TARGET}:${WAS_RUN_PORT + 1}/" config/nginx/nginx.conf
docker-compose -f docker-compose.${RUN_TARGET}.${{ github.sha }}.yml exec nginx nginx -s reload
            
while [ -z "$(docker ps --filter "name=was-${RUN_TARGET}" --quiet)" ]; do
  sleep 5
done
sleep 60

rm .env
docker rm -f $(docker ps --filter "name=${STOP_TARGET}" --quiet)