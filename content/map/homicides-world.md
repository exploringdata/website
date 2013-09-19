---
url: /vis/homicides-world/
title: World Map of Intentional Homicides
description: A geographic map showing the number of intentional homicides per 100k people of the world countries rendered with the D3 JavaScript library.
template: map/worldbank.html
created: 2013-09-19 23:37:53
scripts: [/js/homicides-world/map.js]
styles: [/css/worldbank.css]
image: /img/preview/earthquakes.jpg
tags: [map, d3, homicides, world, worldbank]
---

## Resources

* https://vis4.net/labs/multihue/

##################################

<p>This map of the world displays recent earthquakes as red circles. The circle sizes correspond to the magnitudes of the earthquakes taking into account that the <a href="https://en.wikipedia.org/wiki/Richter_magnitude_scale">Richter magnitude scale</a> is a logarithmic scale, where an earthquake that measures 5.0 has a shaking amplitude 10 times larger than one that measures 4.0.</p>
<p>Earthquake data is retrieved via <a href="http://earthquake.usgs.gov/earthquakes/feed/">real-time feeds</a> from the U.S. Geological Survey (USGS). By default data is loaded once. When Auto update data in the top menu is checked, data will be refreshed every minute. Moreover, you can choose different time and earthquake magnitude ranges from the select list in the top menu.</p>
<p>You can zoom in and out the map with the mouse wheel and drag it around with the mouse button clicked. When you move the mouse over a circle a tooltip with magnitude and location information is displayed, when you click on a circle you are sent to the earthquake's corresponding detail page on the USGS Web site.</p>
<p>The visualization is rendered with the <a href="http://d3js.org/">D3 JavaScript library</a> using <a href="https://github.com/johan/world.geo.json">GeoJSON data for countries</a>.</p>
