---
created: 2019-09-24 20:30:21
description: These choropleth maps show CO2 emissions in metric tons per capita based on data from the Carbon Dioxide Information Analysis Center and Oak Ridge National Laboratory.
image: /img/preview/co2-emissions.png
related: /info/co2-emissions/
template: worldbank-map.html
title: 'World Map of Countries by CO2 Emissions per Capita'
---
<script type="module">
  import { createMap } from '/compiled/worldbank-map.js';

  createMap(document.getElementById('app'), {
    indicator:   'EN.GHG.CO2.PC.CE.AR5',
    clampPercentile: 2,   // clip the most extreme % from each end
    topoUrl:     '/topojson/world/countries.json',
    topoObject:  'units',
    title:       'CO2 Emissions',
    emoji:       '👣',
    unit:        'Tonnes per Capita',
    colorScheme: 'Oranges'
  });
</script>