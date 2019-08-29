---
created: 2018-04-26 00:32:29
related: /vis/big-sister-cities/
repo: https://github.com/yaph/big-sister-cities
title: "Big Sister Cities: How They Are Related"
description: Big Sister Cities is an interactive network graph showing 279 cities with more than 1 million inhabitants and how they are connected to their sister cities within this set.
template: page.html
tags: [network graph, cities, diplomacy, sigmajs, gephi, networkx, interactive]
image: big-sister-cities.png
poster:
  url: https://www.redbubble.com/people/ramiro/works/31442371
  image: https://ih1.redbubble.net/image.553611499.2371/poster,220x200,ffffff-pad,220x200,ffffff.u13.jpg
  title: Graph of Sister Cities With +1 Million Inhabitants - Poster White Canvas
---
[Big Sister Cities]({{ related }}) is an interactive network graph showing 279 cities with more than 1 million inhabitants and how they are connected to their sister cities within this set. The cities are the nodes which are sized by degree and colored by population and the 852 edges show the sister relations. The data for creating this graph was retrieved from [Wikidata](https://www.wikidata.org/) in April 2018.

## Top 20 cities by number of sister cities

The following list shows the 20 most connected cities within the network. The city name links to the highlighted node in the network, the first number is the count of sister cities and the second the population.

1. [Chongqing]({{ related }}#Chongqing) - 77 - 1,039,000
2. [Istanbul]({{ related }}#Istanbul) - 71 - 14,657,434
3. [Beijing]({{ related }}#Beijing) - 58 - 21,710,000
4. [Rio de Janeiro]({{ related }}#Rio de Janeiro) - 53 - 6,476,631
5. [Shanghai]({{ related }}#Shanghai) - 53 - 23,390,000
6. [Buenos Aires]({{ related }}#Buenos Aires) - 53 - 2,890,151
7. [Moscow]({{ related }}#Moscow) - 51 - 12,500,123
8. [Bangkok]({{ related }}#Bangkok) - 48 - 5,696,409
9. [Chicago]({{ related }}#Chicago) - 42 - 2,722,389
10. [London]({{ related }}#London) - 42 - 8,787,892
11. [Seoul]({{ related }}#Seoul) - 38 - 9,857,426
12. [Taipei]({{ related }}#Taipei) - 38 - 2,684,567
13. [Amman]({{ related }}#Amman) - 38 - 4,995,000
14. [Ankara]({{ related }}#Ankara) - 37 - 5,270,575
15. [Santo Domingo]({{ related }}#Santo Domingo) - 36 - 2,581,827
16. [Abu dhabi]({{ related }}#Abu dhabi) - 35 - 2,502,715
17. [Warsaw]({{ related }}#Warsaw) - 35 - 1,753,977
18. [São Paulo]({{ related }}#São Paulo) - 34 - 12,106,920
19. [Tehran]({{ related }}#Tehran) - 33 - 8,846,782
20. [Jakarta]({{ related }}#Jakarta) - 32 - 9,769,000

## How the graph was created

The data underlying this graph was queried from [Wikidata's Query Service](https://query.wikidata.org/) in April 2018 using [this SPARQL query](https://github.com/yaph/queries/blob/master/wikidata/big-sister-cities.sparql) and transformed to a graph structure in Python, you can find the code [in this repository]({{ repo }}).

I rendered the graph in [Gephi](https://gephi.org/) using the Force Atlas layout. The node colors represent the population values, the darker the larger the city. The size of the nodes represent the degree, i. e. the number of sister cities within this set of cities. The browser version is rendered with the JavaScript library [sigma.js](https://sigmajs.org/).