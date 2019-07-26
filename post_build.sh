#!/bin/sh

CODEBUILD_GIT_BRANCH="$(git branch -a --contains HEAD | sed -n 2p | awk '{ printf $1 }')";

if [ "$CODEBUILD_GIT_BRANCH" == "prod" ] then
  echo pushing prod images to ecr...
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/test-driven-users:prod
  docker push $AWS_ACCOUNT_ID.dkr.ecr.$AWS_REGION.amazonaws.com/test-driven-client:prod
fi
