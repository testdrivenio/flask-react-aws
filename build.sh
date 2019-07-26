#!/bin/sh

CODEBUILD_GIT_BRANCH="$(git branch -a --contains HEAD | sed -n 2p | awk '{ printf $1 }')";

echo building and testing dev images...
docker-compose up -d --build
docker-compose exec -T users pytest "project/tests" -p no:warnings
docker-compose exec -T users flake8 project
docker-compose exec -T users black project --check
docker-compose exec -T users /bin/bash -c "isort project/*/*.py" --check-only
docker-compose exec -T client react-scripts test --watchAll --watchAll=false
docker-compose exec -T client npm run lint
docker-compose exec -T client npm run prettier:check
docker-compose exec -T client npm run prettier:write

if [ "$CODEBUILD_GIT_BRANCH" == "prod" ] then
  echo building prod images...
  docker build \
    -f services/users/Dockerfile.prod \
    -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/test-driven-users:prod \
    ./services/users
  docker build \
    -f services/client/Dockerfile.prod \
    -t $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/test-driven-client:prod \
    --build-arg NODE_ENV=production \
    --build-arg REACT_APP_USERS_SERVICE_URL=$REACT_APP_USERS_SERVICE_URL \
    ./services/client
fi
