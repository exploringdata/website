# Exploring Data Source

Source repository for the data visualization showcase [Exploring Data](https://exploring-data.com/), a web site built with the [static site generator Logya](https://ramiro.org/logya/).

## Try

* https://pandas-datareader.readthedocs.io/en/latest/remote_data.html#world-bank

## Remove/Replace

* {% block nav_right %}
* <div class="nav navbar-nav pull-right mr-2">

## Fix

### Pages

http://localhost:8080/vis/climate-changes-decade/
http://localhost:8080/vis/exploit-database-platforms-spiral/

http://localhost:8080/info/intentional-homicides/

### Are these resources still used?

/json/topo/countries.topo.json
/vendor/d3/d3.v3.min.js
/vendor/d3/queue.v1.min.js
/vendor/d3/d3.geo.projection.v0.min.js
/vendor/d3/topojson.v1.min.js
/js/colors.js

### Clean up

* Lots of data in static/json/