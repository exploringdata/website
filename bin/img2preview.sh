#/bin/bash
set -eou pipefail

img=${1}

convert -resize '400x300>' "$img" output.png
pngquant --speed 1 --quality 65-80 output.png
rm output.png