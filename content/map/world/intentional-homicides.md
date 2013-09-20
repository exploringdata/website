---
url: /map/world/intentional-homicides/
related: /info/intentional-homicides/
title: World Map of Intentional Homicides
description: A series of geographic Choropleth maps showing the number of intentional homicides by country per 100,000 people. Created using World Bank data and D3.js.
template: map/worldbank.html
created: 2013-09-19 23:37:53
scripts: [/js/worldbank.js]
styles: [/css/worldbank.css]
image: /img/preview/homicides-map.png
map:
    year:
        default: 2008
        min: 1995
        max: 2011
        selected: 2008
    legend:
        title: 'Intentional Homicides by 100,000 People'
        width: 500
        height: 75
    source:
        url: 'http://data.worldbank.org/indicator/VC.IHR.PSRC.P5'
        title: 'World Bank Intentional Homicides'
        data: '/csv/homicides.csv'
---