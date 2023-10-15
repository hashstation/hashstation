#! /bin/bash
#
# Destroys running hashstation container, related volumes and networks
#

docker kill $(docker ps --no-trunc --filter name=hashstation -q) > /dev/null 2>&1
docker rm $(docker ps -a --no-trunc --filter name=hashstation -q) > /dev/null 2>&1
docker network rm $(docker network ls -q --no-trunc --filter name=hashstation) > /dev/null 2>&1
docker volume rm $(docker volume ls --filter name=hashstation) --force > /dev/null 2>&1
docker container prune --force
docker volume prune --force
rm -rf logs
