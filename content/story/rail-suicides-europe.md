---
url: /story/rail-suicides-europe/
title: 'Rail Suicides in Europe: Absolute vs. Relative'
description: A look at rail suicides data for Europe from 2008 to 2011 highlighting the importance of relating numbers.
created: 2013-09-12 11:39:40
template: page.html
tags: [data story, datawrapper, guardian, europe, pandas, bar chart]
repo: https://github.com/yaph/rail-suicides
image: /img/preview/rail-suicides.jpg
---
Yesterday the Guardian published an article about
[rail suicides](http://www.theguardian.com/news/datablog/2013/sep/11/uk-rail-suicides-decade-data)
in the UK and Europe. It ends with the chart series below, which shows the total
number of rail suicides in several European countries from 2008 to 2011.

<iframe src="http://cf.datawrapper.de/XefBI/1/" width="100%" height="500" frameborder="0" allowtransparency="true"></iframe>

This got me stuck, because of the huge gap between Germany and the other
countries. Is it because Germany has a bigger
[rail transport network](https://en.wikipedia.org/wiki/List_of_countries_by_rail_transport_network_size)
than all other European countries? This is probably a factor, but it doesn't
explain these huge differences.

Looking back at the Guardian chart the Netherlands had 215 suicides in 2011
compared to 853 in Germany, but the Netherlands have about 17 million
inhabitants and Germany about 80 million.

So does it make sense to look at the absolute numbers alone? I think it doesn't
in this case and created the new chart below, which takes the population of the
countries into account.

<iframe src="http://cf.datawrapper.de/vTXHj/2/" width="100%" height="516" frameborder="0" allowtransparency="true"></iframe>

The new chart tells a different story showing the number of suicides by 100,000
inhabitants for each country. It turns out that the Czech Republic is the country
with the highest ratio, then with a considerable gap we see follow-up countries
like Hungary, Luxembourg, Austria, the Netherlands, and Germany.

The UK (GB in my chart), which ranked in the top 3 to 5 in the Guardian charts
actually has a rather low rail suicide rate. Which of course doesn't mean that
this is not a problem.

Another more technical difference regarding the charts is that I chose to use
the same scale across all years, a nice feature [datawrapper](http://datawrapper.de/)
offers. This way it becomes more clear that rail suicides are an increasing
problem in Europe.

As mentioned before the railway density would be another factor to consider.
The main point, however, is to show how important it is to provide context,
especially when doing comparisons. Absolute and relative numbers often tell
very different stories.

## References and Data Sources

* [UK rail suicides: a decade of data](http://www.theguardian.com/news/datablog/2013/sep/11/uk-rail-suicides-decade-data)
  the article published by the Guardian
* [Population, total](http://data.worldbank.org/indicator/SP.POP.TOTL)
  a datset provided by the World Bank
* [Data munging code](https://github.com/exploringdata/rail-suicides)
  the source code to calculate the suicide ratios for each year and country