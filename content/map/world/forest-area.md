---
created: 2019-09-19 14:14:10
description: "These choropleth maps show the forest area percentage of land area for the world's countries based on data from the Food and Agriculture Organization."
image: /img/preview/forest-area.png
related: /info/forest-area/
template: worldbank-map.html
title: World Map of Countries by Forest Area Percentage of Land Area
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