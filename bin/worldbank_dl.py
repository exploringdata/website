#!/usr/bin/env python
# AG.LND.FRST.ZS
import argparse

import pandas as pd
import wbdata


parser = argparse.ArgumentParser(description='Create CSV file from Worldbank indicator code.')
parser.add_argument('indicator', help='Worldbank indicator code.')
parser.add_argument('output_name', help='Name part of the generated CSV file.')
argv = parser.parse_args()


data = wbdata.get_data(argv.indicator)
df = pd.DataFrame(data).rename(columns={'countryiso3code': 'iso3'})

table = df.pivot_table(
    index='iso3', columns='date', values='value').dropna(axis='columns', thresh=100)

table.to_csv(f'{argv.output_name}.csv')