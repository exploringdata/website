#!/bin/bash
set -euo pipefail

logya gen
git clone git@github.com:exploringdata/exploringdata.github.com.git
mv exploringdata.github.com/.git deploy/
cd deploy/
git add .
git commit -am 'new deployment'
git push
cd ..
rm -rf deploy/.git exploringdata.github.com/
