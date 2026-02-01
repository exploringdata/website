#!/bin/bash
set -euo pipefail

deploy_repo=~/repos/deploy/exploringdata.github.com

npm run build
logya gen
logya clean

rsync -aruvz --exclude=.git --exclude=.gitignore --delete public/ "$deploy_repo"

cd "$deploy_repo"
git add .
git commit -am'new deployment'
git push
