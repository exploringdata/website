#/bin/bash
set -eou pipefail

TEXT='exploring-data.com'


convert -size 400x50 xc:grey30 -font Roboto-Condensed-Bold -pointsize 50 -gravity center \
        -draw "fill grey70 text 0,0 ${TEXT}" \
        watermark_fg.png

convert -size 400x50 xc:black -font Roboto-Condensed-Bold -pointsize 50 -gravity center \
        -draw "fill white text 1,1 ${TEXT} \
              text 0,0 ${TEXT} \
              fill black text -1,-1 ${TEXT}" \
        +matte watermark_mask.png

composite -compose CopyOpacity watermark_mask.png watermark_fg.png watermark.png

mogrify -trim +repage watermark.png
rm watermark_mask.png watermark_fg.png