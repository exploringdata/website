#!/bin/bash
orig=$1
basename=`basename "$orig"`
name=`echo ${basename%.*} | sed -e 's/\-\+/-/g'`

newimg=static/img/large/"$name".png
convert -resize 1200x900 "$orig" "$newimg"
pngquant -f --ext .png "$newimg"
echo Created $newimg

newimg=static/img/preview/"$name".png
convert -resize x300\> "$orig" "$newimg"
pngquant -f --ext .png "$newimg"
echo Created $newimg