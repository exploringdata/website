# Exploring Data Source

Source repository for the data visualization showcase [Exploring Data](https://exploring-data.com/), a web site built with the [static site generator Logya](https://ramiro.org/logya/).

## Elevation Diary: Nerja

Commands

    wim/extract_exifdata.py --convert-gps ~/data/photos/nerja-dataset/*.jpg

    bin/exifgps2csv.py

    wim ~/data/photos/nerja-dataset/*.jpg --format webp --outdir ~/repos/pub/exploringdata/website/static/img/nerja-dataset --output-label '' --scale 600 800 --strip --watermark ~/repos/priv/pankeisnotdead/logo/watermark-40.png
