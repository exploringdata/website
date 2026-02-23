---
created: 2026-02-24 00:14:42
description: Interactive world map of annual inflation (%) from 1960 to 2024, showing consumer price changes per country in constant 2015 US dollars.
image: /img/preview/inflation-consumer-prices-annual.png
template: worldbank-map.html
title: 'World Inflation Map - Annual Consumer Price Changes (%)'
---
<script type="module">
  import { createMap } from '/compiled/worldbank-map.js';

  createMap(document.getElementById('app'), {
    indicator:   'FP.CPI.TOTL.ZG',
    clampPercentile: 3,   // clip the most extreme % from each end
    topoUrl:     '/topojson/world/countries.json',
    topoObject:  'units',
    title:       'Inflation, consumer prices',
    emoji:       '💸',
    unit:        'annual %',
    colorScheme: 'Greens'
  });
</script>