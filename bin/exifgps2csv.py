#!/usr/bin/env python
import csv
import json
from pathlib import Path

columns = ['filename', 'latitude', 'longitude', 'altitude', 'timestamp']
csvfile = 'static/csv/nerja-dataset-gps.csv'
rows = []
for file in Path('/media/rg/Volume/Data/photos/nerja-dataset').glob('**/*.exif.json'):
    data = json.loads(file.read_text())
    if gpsinfo := data.get('GPSInfo'):
        rows.append({
            'filename': file.stem.replace('.wim.exif', ''),
            'latitude': gpsinfo.get('latitude'),
            'longitude': gpsinfo.get('longitude'),
            'altitude': gpsinfo.get('altitude'),
            'timestamp': data.get('DateTime')
        })

print(f'Writing {len(rows)} rows to {csvfile}')
with open(csvfile, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    writer.writerows(rows)
