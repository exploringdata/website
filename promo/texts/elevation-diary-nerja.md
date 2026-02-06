# Elevation Diary: Nerja

## YouTube

GPS Photo Visualization: 3D Journey Through Andalusian Terrain

This sped-up demo shows an interactive 3D visualization mapping vacation photos to their locations on the terrain in and around Nerja, Spain. The video shows the last 15 photos from a collection of 300 GPS-tagged photos that appear on a 3D elevation map, creating a chronological journey through two weeks of travel.

Built with deck.gl, using Terrarium elevation data and Esri satellite imagery. Navigate through photos with smooth camera transitions that fly to each location on the terrain.

🔗 Try it yourself: https://exploring-data.com/map/3d/elevation-diary-nerja/

Features:

- 3D terrain visualization
- 300 GPS-tagged photos
- Chronological journey playback
- Smooth camera transitions
- Keyboard navigation
- Progressive trail showing visited locations

Tech: deck.gl, JavaScript, AWS Terrain Tiles, Esri World Imagery

### Tags

Data Visualization, 3D Mapping, GPS Photos, Web Development, Interactive Map, Spain, Nerja, Geospatial, WebGL, Travel Photography, Elevation Map, Javascript, Coding Project, Photo Mapping

## Commands

    wim/extract_exifdata.py --convert-gps ~/data/photos/nerja-dataset/*.jpg

    bin/exifgps2csv.py

    wim ~/data/photos/nerja-dataset/*.jpg --format webp --outdir ~/repos/pub/exploringdata/website/static/img/nerja-dataset --output-label '' --scale 600 800 --strip --watermark ~/repos/pub/exploringdata/website/src/img/ed-20.png

    ffmpeg -i elevation-diary-nerja.4x-speed.cut.mp4 -vf "drawtext=text='exploring-data.com/map/3d/elevation-diary-nerja/':font=DejaVuSansMono:fontsize=20:fontcolor=white:x=w-tw-10:y=h-th-10" -codec:a copy elevation-diary-nerja.final.mp4
