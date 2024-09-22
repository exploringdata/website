#/bin/bash
set -eou pipefail

svg=${1}

convert -resize '400x300>' $svg output.png
pngquant --speed 1 --quality 65-80 output.png
