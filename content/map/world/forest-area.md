---
title: World Map of Countries by Forest Area Percentage of Land Area
description: "This choropleth map shows the forest area percentage of land area for the world's countries based on data from the World Bank."
created: 2019-09-19 14:14:10
related: /info/forest-area/
scripts: [/compiled/map/forest-area.js]
template: worldbank-map.html
image: /img/preview/forest-area.png
---
<script type="module">
  import { createMap } from '/compiled/worldbank-map.js';

  createMap(document.getElementById('app'), {
    indicator:   'AG.LND.FRST.ZS',
    topoUrl:     '/topojson/world/countries.json',
    topoObject:  'units',
    title:       'Forest Area',
    emoji:       '🌳',
    unit:        '% of land area',
    colorScheme: 'Greens',
  });
</script>