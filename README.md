# Exploring Data Source

Exploring Data is a showcase of interactive data visualizations. The Logo should show the letters E and D and be roughly square.

[Exploring Data](https://exploring-data.com/) is a website that showcases a collection of interactive data visualizations. The repository contains the website source files for building it with the [static site generator Logya](https://ramiro.org/logya/).

## Elevation Diary: Nerja

Commands

    wim/extract_exifdata.py --convert-gps ~/data/photos/nerja-dataset/*.jpg

    bin/exifgps2csv.py

    wim ~/data/photos/nerja-dataset/*.jpg --format webp --outdir ~/repos/pub/exploringdata/website/static/img/nerja-dataset --output-label '' --scale 600 800 --strip --watermark ~/repos/pub/exploringdata/website/src/img/ed-20.png
