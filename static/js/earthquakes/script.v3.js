var current_feed = null,
  timer = null;

var eqradius = function(feature, index) {
  return d3.scale.pow().exponent(10).domain([0, 10]).range([.8, 300])(feature.properties.mag)
}

var mapselect = '#map',
    width = containerwidth(mapselect),
    height = width * .48;

var worldmap = d3.geomap()
    .geofile('/topojson/world/countries.json')
    .projection(d3.geo.mercator)
    .width(width)
    .height(height)
    .scale(width/5.8)
    .translate([width/2, height/2]);

d3.select(mapselect)
    .call(worldmap.draw, worldmap);

var tf = function() {
  return 'translate(' + width/2 + ',' + height/2 + ')scale(' + width/5.8 + ')'
};

var eqgroup = worldmap.svg().append('g')
  .attr('translate', tf)
  .attr('class', 'earthquake');

// earthquake data
function set_eqs(url, title) {
  current_feed = url;
  if (title) d3.select('#eqtitle').text(title);
  $.ajax({
    url: url,
    jsonp: 'eqfeed_callback',
    dataType: 'jsonp'
  });
}

function eqfeed_callback(data) {
  eqgroup.selectAll('path').remove();
  eqgroup.selectAll('path')
    .data(data.features)
  .enter().append('path')
    .attr('d', d3.geo.path().projection(worldmap.properties.projection()).pointRadius(eqradius))
    .on('click', function(d) {document.location.href = d.properties.url})
  .append('title')
    .text(eqtitle);
}

function select_eq(element) {
  d3.selectAll('#eqranges li').classed('active', false);
  var t = d3.select(element);
  d3.select(t.node().parentNode).classed('active', true);
  set_eqs(t.attr('url'), t.text());
}

// set refresh intervall
function refresh() {
  timer = setInterval(function(){set_eqs(current_feed)}, 60000);
}

// load eq data for last menu item by default
select_eq(d3.selectAll('#eqranges a')[0].slice(-1)[0]);

function ready(countries) {
  contriesgroup.selectAll('path')
    .data(countries.features)
  .enter().append('path')
    .attr('class', 'country')
    .attr('d', path);
}

/***** events *****/
// range menu selection
d3.selectAll('#eqranges a').on('click', function() {
  d3.event.preventDefault();
  select_eq(this);
});

// auto update
d3.select('#refresh input').on('change', function() {
  if (this.checked) {
    refresh()
  } else {
    clearInterval(timer)
  }
});