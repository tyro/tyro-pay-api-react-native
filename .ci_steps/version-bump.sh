#!/bin/bash

bump_type=$1
REPO="https://$GITHUB_ACTOR:$TOKEN@github.com/$GITHUB_REPOSITORY.git"

git config user.name "${GITHUB_ACTOR}"
git config user.email "${GITHUB_ACTOR}@users.noreply.github.com"
npm version "$bump_type" -m "update package to version %s [skip cli]"
git push "https://$GITHUB_ACTOR:$TOKEN@github.com/$GITHUB_REPOSITORY.git"