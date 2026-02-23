#!/usr/bin/env bash

set -euo pipefail

if [ "$#" -lt 3 ]; then
    echo "Usage: $0 <URL> <start_year> <end_year> [wait_seconds]"
    exit 1
fi

URL="$1"
START_YEAR="$2"
END_YEAR="$3"
WAIT=${4:-5}

# Remove trailing slash (if any)
URL_CLEAN="${URL%/}"

# Extract last path segment as slug
SLUG="${URL_CLEAN##*/}"

TARGET_DIR="/media/rg/TREKSTOR/Video/screencasts/exploring-data.com/$SLUG"

mkdir -p "$TARGET_DIR"

# Generate frames (skip existing)
for (( year=START_YEAR; year<=END_YEAR; year++ )); do
    OUT="$TARGET_DIR/frame-$year.png"

    if [ -s "$OUT" ]; then
        echo "Skipping $year (already exists)"
        continue
    fi

    echo "Creating frame for $year..."
    wcap --dimensions 1920x1080 --wait ${WAIT} \
        "$URL/#year=$year" \
        "$OUT"
done

echo "Creating video..."

ffmpeg -y \
    -framerate 1.5 \
    -pattern_type glob \
    -i "$TARGET_DIR/frame-*.png" \
    -c:v libx265 \
    -tag:v hvc1 \
    -pix_fmt yuv420p \
    -crf 28 \
    "$TARGET_DIR/$SLUG-$START_YEAR-$END_YEAR.mp4"

echo "Done: $TARGET_DIR/$SLUG.mp4"
