#!/usr/bin/env python
# -*- coding: utf-8 -*-
import argparse
import os

import pandas as pd

from datetime import datetime

from logya.core import Logya
from logya.writer import write, encode_content


parser = argparse.ArgumentParser(description='Create data map draft based on input CSV and arguments.')
parser.add_argument('input_file', help='Name of the input file.')
parser.add_argument('output_name', help='Name part of the generated content and CSV files.')
args = parser.parse_args()

L = Logya()
L.init_env()

now = datetime.now()

# World Bank specific data loading and processing
df = pd.read_csv(args.input_file, skiprows=4).dropna(axis='columns', how='all', thresh=10).rename(columns={'Country Code': 'iso3'})

years = [str(year) for year in range(1960, now.year + 1) if str(year) in df]
columns = ['iso3'] + years
df_final = df[columns]

# Determine absolute min and max values for use in JS
abs_min = df.min(numeric_only=True).min()
if abs_min > 0 and abs_min < 1:
    abs_min = 0

abs_max = df.max(numeric_only=True).max()
if abs_max > 90 and abs_max < 100:
    abs_max = 100

# Create CSV
output_csv = os.path.join(L.dir_static, 'csv', args.output_name + '.csv')
df_final.to_csv(output_csv, index=False)

# Create content map
map_doc = {
    'title': 'World Map of Countries by ',
    'description': 'These choropleth maps show .',
    'created': now,
    'related': f'/info/{args.output_name}/',
    'scripts': [f'/compiled/map/{args.output_name}.js'],
    'template': 'map/world/choropleth.html',
    'image': f'/img/preview/{args.output_name}.png'
}
output_map = os.path.join(L.dir_content, 'map', 'world', args.output_name + '.md')
write(output_map, encode_content(map_doc, ''))

# Create content info
info_doc = {
    'title': '',
    'description': 'Information on choropleth maps showing',
    'created': now,
    'related': f'/map/world/{args.output_name}/',
    'tags': ['d3', 'map', 'world', 'worldbank'],
    'template': 'page.html',
    'image': f'/img/preview/{args.output_name}.png'
}
output_info = os.path.join(L.dir_content, 'info', args.output_name + '.md')
write(output_info, encode_content(info_doc, ''))

JS = f"""
let colors = ['#fffff2', '#f8fcda', '#ecf4c1', '#dae8a6', '#c3d88c', '#a7c370', '#87ab55', '#628f39', '#3a6f1d', '#004d00'];
let columns = {years};
let data_source = 'https://data.worldbank.org/indicator/';
let selected_col = '1960';


let map = d3.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colors)
    .column(selected_col)
    .domain([{abs_min}, {abs_max}])
    .legend(true)
    .unitId('iso3')
    .postUpdate(() => {{
        annotate(map, 85, 170, `TITLE ${selected_col}`);
    }});


d3.csv('/csv/{args.output_name}.csv').then(data => {{
    let selection = d3.select('#map').datum(data);
    map.draw(selection);
    animate(map, columns, interval_length=500);
    colSelect(map, columns);
}});
"""

output_js = os.path.join(L.dir_site, 'src', 'js', 'map', args.output_name + '.js')
write(output_js, JS)