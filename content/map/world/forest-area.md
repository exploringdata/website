---
created: 2019-09-19 14:14:10
description: "These choropleth maps show the forest area percentage of land area for the world's countries based on data from the Food and Agriculture Organization."
image: /img/preview/forest-area.png
related: /info/forest-area/
template: subjectmap.html
title: World Map of Countries by Forest Area Percentage of Land Area
---
<script type="module">
import { createMap, fetchWorldBank, worldBankUrl } from '/compiled/subjectmap.js';

const INDICATOR = 'AG.LND.FRST.ZS';
const data = await fetchWorldBank(INDICATOR);

createMap(document.getElementById('app'), {
  data,
  topoUrl:     '/topojson/world/countries.json',
  topoObject:  'units',
  title:       'Forest Area',
  emoji:       '🌳',
  subtitle:    `${INDICATOR} · % of land area`,
  unit:        '% of land area',
  colorScheme: 'Greens',
  sourceUrl:   worldBankUrl(INDICATOR),
  sourceLabel: `data.worldbank.org/indicator/${INDICATOR}`,
});
</script>
