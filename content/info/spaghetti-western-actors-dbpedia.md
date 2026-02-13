---
related: /vis/spaghetti-western-actors-dbpedia/
title: Which Actors Appeared together in Spaghetti Western Films
description: This is an undirected graph of co-occurrences of actors who appeared in one or more Spaghetti Western films based on data from DBpedia retrieved on August 4, 2015.
template: two-column.html
created: 2015-08-06 14:14:54
image: spaghetti-western-actors-dbpedia-graph.png
tags: [network graph, film, sigmajs, gephi, networkx]
---
This [interactive network visualization](/vis/spaghetti-western-actors-dbpedia/) shows an undirected graph of co-occurrences of actors who appeared in one or more Spaghetti Western films based on data from [DBpedia](http://wiki.dbpedia.org/) retrieved on August 4, 2015.

I used DBpedia as a source because of the creative commons license as opposed to IMDB for example. DBpedia's coverage of actors who appeared in the films is very incomprehensive though and while DBpedia is better structured than Wikipedia it still has a lot of inconsistencies. I may revisit this topic using either Wikipedia or yet another data source, that allows for re-use.

Despite, these limitations we get an idea which actors appeared together most often indicated by edge size, i. e. Bud Spencer and Terence Hill and which actors have the highest degree, i. e. Terence Hill and Giuliano Gemma within this dataset.