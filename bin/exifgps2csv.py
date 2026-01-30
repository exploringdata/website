#!/usr/bin/env python
import csv
import json
from pathlib import Path

columns = ['filename', 'latitude', 'longitude', 'altitude', 'timestamp']
csvfile = 'static/csv/nerja-dataset-gps.csv'
p_data = Path('./static/img/nerja-dataset')
rows = []

for file in p_data.glob('*.exif.json'):
    data = json.loads(file.read_text())
    if gpsinfo := data.get('GPSInfo'):
        rows.append({
            'filename': file.stem.replace('.wim.exif', ''),
            'latitude': gpsinfo.get('latitude'),
            'longitude': gpsinfo.get('longitude'),
            'altitude': gpsinfo.get('altitude'),
            'timestamp': data.get('DateTime')
        })
    else:
        p_img = file.name.split('.')[0]
        p_data.joinpath(f'{p_img}.wim.jpg').rename(p_data.joinpath(f'{p_img}.wim.no-gps.jpg'))
        file.rename(file.with_suffix('.no-gps.exif.json'))

print(f'Writing {len(rows)} rows to {csvfile}')
with open(csvfile, 'w', newline='') as f:
    writer = csv.DictWriter(f, fieldnames=columns)
    writer.writeheader()
    writer.writerows(sorted(rows, key=lambda x: x['timestamp']))
