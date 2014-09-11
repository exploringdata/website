#!/bin/bash
orig=$1
basename=`basename "$orig"`
name=`echo ${basename%.*} | sed -e 's/\-\+/-/g'`

newimg=static/img/large/"$name".png
convert -resize 800x600 "$orig" "$newimg"
pngquant -f --ext .png "$newimg"
echo Created $newimg

newimg=static/img/preview/"$name".png
convert -resize 400x300 "$orig" "$newimg"
pngquant -f --ext .png "$newimg"
echo Created $newimg