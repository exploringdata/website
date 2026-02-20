---
created: 2013-09-19 23:37:53
description: A series of geographic Choropleth maps showing the number of intentional homicides by country per 100,000 people. Created using World Bank data.
image: /img/preview/intentional-homicides.png
related: /info/intentional-homicides/
template: worldbank-map.html
title: World Map of Intentional Homicides
---
<script type="module">
  import { createMap } from '/compiled/worldbank-map.js';

  createMap(document.getElementById('app'), {
    indicator:   'VC.IHR.PSRC.P5',
    topoUrl:     '/topojson/world/countries.json',
    topoObject:  'units',
    title:       'Intentional Homicides',
    emoji:       '☠️',
    unit:        'per 100,000 people',
    colorScheme: 'Reds',
    ocean:       '#140000',
  });
</script>