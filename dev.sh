#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

CONTAINER_NAME="hbrconnectere-backend"
IMAGE_NAME="hbrconnectere-backend"

echo -e "${YELLOW}Stopping existing container...${NC}"
docker stop $(docker ps -q --filter "ancestor=$IMAGE_NAME") 2>/dev/null || true

echo -e "${YELLOW}Removing old container...${NC}"
docker rm $(docker ps -a -q --filter "ancestor=$IMAGE_NAME") 2>/dev/null || true

echo -e "${YELLOW}Building Docker image...${NC}"
docker build -t $IMAGE_NAME .

if [ $? -eq 0 ]; then
  echo -e "${GREEN}Build successful!${NC}"
  echo -e "${YELLOW}Starting container...${NC}"
  docker run -p 8080:8080 --env-file .env -v ${PWD}:/usr/src/app $IMAGE_NAME
else
  echo -e "${RED}Build failed!${NC}"
  exit 1
fi
