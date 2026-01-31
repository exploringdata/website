#!/usr/bin/env python
import csv
import json
from pathlib import Path

columns = ['filestem', 'latitude', 'longitude', 'altitude', 'timestamp']
csvfile = 'static/csv/nerja-dataset-gps.csv'
p_data = Path('~/data/photos/nerja-dataset').expanduser()
rows = []

for file in p_data.glob('*.exif.json'):
    data = json.loads(file.read_text())
    if gpsinfo := data.get('GPSInfo'):
        rows.append({
            'filestem': file.name.split('.')[0],
            'latitude': gpsinfo.get('latitude'),
            'longitude': gpsinfo.get('longitude'),
            'altitude': gpsinfo.get('altitude'),
            'timestamp': data.get('DateTime')
        })
    else:
        print(f'No GPSInfo: {file}')

print(f'Writing {len(rows)} rows to {csvfile}')
with open(csvfile, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    writer.writerows(sorted(rows, key=lambda x: x['timestamp']))
