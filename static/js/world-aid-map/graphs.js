// adapt containerwidth to screen size
var containerwidth = function(selector) {
  return parseInt(d3.select(selector).style('width'))
};

var mapselect = '#map',
  width = containerwidth(mapselect),
  height = width * .65,
  legendh = 60,
  pathopacity = .4,
  selected,
  centered,
  relation, // Population or GDP
  proj = d3.geo.equirectangular().scale(1).translate([0, 0]),
  arc = d3.geo.greatArc().precision(1),
  centroid = function(d) {return path.centroid(d.geometry)},
  format = d3.format(',d'),
  color = d3.scale.category20(),
  projection = d3.geo.mercator().scale(width).translate([0, 0]),
  path = d3.geo.path().projection(projection);

//FIXME
var colorscale = function(basecolor, val) {
  var c = d3.rgb(basecolor);
  //c.darker(2).toString(); // "#743f74" - even darker
  //c.brighter(0.1).toString(); // "#f686f6" - only slightly brighter
};

//FIXME use min and max of total
var scalelinks = d3.scale.sqrt().domain([-10000000,10000000]);

//FIXME implement country select
var click = function(d) {
  console.log(d);
}

var tf = function() {
  return 'translate(' + width / 2 + ',' + height / 2 + ')'
};

var linkcoords = function(d) {
  d.source = countryinfo[d.source];
  d.target = countryinfo[d.target];
  return d;
};

var dollarval = function(d) {
  var usd = d.usd;
  if (relation) usd = usd / d[relation];
  return Math.sqrt(usd) / 10000;
};

var rescale = function() {
  svg.attr('transform', 'translate(' + d3.event.translate + ')'
    + ' scale(' + d3.event.scale + ')')
}

/************** SVG stuff **************/
var svg = d3.select(mapselect).append('svg')
  .attr('width', width)
  .attr('height', height)
  .call(d3.behavior.zoom().on('zoom', function() {rescale()}))
    .append('svg:g');

svg.append('rect')
  .attr('class', 'background')
  .attr('width', width)
  .attr('height', height);

var gcountries = svg.append('g')
  .attr('transform', tf)
  .append('g')
    .attr('id', 'countries');

var garcs = svg.append('g')
  .attr('transform', tf)
  .attr('id', 'arcs');

var drawmap = function(data) {
  geocountries = data.features;
  gcountries.selectAll('path')
    .data(geocountries)
    .enter().append('path')
      .attr('d', path)
      .on('click', click);

  // draw circles for capitals
  gcountries.selectAll('circle')
    .data(geocountries.filter(function(d){
      // ignore countries with missing data for now
      return ('undefined' === typeof countryinfo[d.id]) ? false : true;
    }))
    .enter().append('circle')
      .attr('cx', function(d) {return projection(countryinfo[d.id].coords)[0]})
      .attr('cy', function(d) {return projection(countryinfo[d.id].coords)[1]})
      .attr('r', 1.8)
      .append('title')
        .text(function(d) {return countryinfo[d.id].name + ', ' + d.properties.name});
};

var drawlinks = function(links) {
  garcs.selectAll('path')
    .data(links)
    .enter().append('path')
      .style('opacity', pathopacity)
      .style('stroke', function(d) {return color(d.source)})
      .style('stroke-width', function(d) {return dollarval(d)})
      .style('fill', 'none')
      .attr('d', function(d) {
        d = linkcoords(d);
        var p = {source:d.source.coords, target:d.target.coords};
        return path(arc(p))
      })
      .on('mouseover', function(d) {
        garcs.selectAll('path').style('opacity', pathopacity / 10);
        d3.select(this).style('stroke', 'red').style('opacity', pathopacity);
      })
      .on('mouseout', function(d) {
        garcs.selectAll('path').style('opacity', pathopacity);
        d3.select(this).style('stroke', color(d.source));
      })
      .append('title')
        .text(function(d) {return format(d.usd) + ' USD from ' + d.source.name + ' to ' + d.target.name});
}

var tooltip = function(text) {
  var x, y;
  if (d3.event.pageX != undefined && d3.event.pageY != undefined) {
    x = d3.event.pageX;
    y = d3.event.pageY;
  } else {
    x = d3.event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft;
    y = d3.event.clientY + document.body.scrollTop + document.documentElement.scrollTop;
  }
  y -= 32;
  var tt = '<div id="tooltip" style="position:absolute; top:' + y + 'px; left:'
    + x + 'px; z-index: 1000;">' + text + '</div>';
  $('body').append(tt);
};

var drawlegend = function(isos) {
  // add a rect to cover lines at the bottom of the map to not disturb legend
  var grect = svg.append('rect')
    .attr('class', 'bglegend')
    .attr('y', height - legendh - 15)
    .attr('width', width)
    .attr('height', legendh + 15)

  var glegend = svg.append('g')
    .attr('transform', 'translate(0,' + (height - legendh) +')')
    .attr('id', 'legend');

  glegend.append('svg:text')
    .text('Aid Flow from Donors')
    .attr('class', 'heading');

  var countrywidth = 60;
  glegend.selectAll('text.country')
    .data(isos).enter()
    .append('svg:text')
      .attr('class', 'country')
      .attr('x', function(d, i) {return countrywidth * i})
      .attr('dx', 20)
      .attr('dy', 20)
      .text(function(d) {return d})
      .on('mouseover', function(d,i) {tooltip(countryinfo[d].name)})
      .on('mouseout', function(d,i) {$('#tooltip').remove()});

  glegend.selectAll('line.country')
    .data(isos).enter()
    .append('svg:line')
      .attr('class', 'country')
      .attr('x1', function(d, i) {return countrywidth * i})
      .attr('y1', 16)
      .attr('x2', function(d, i) {return 14 + countrywidth * i})
      .attr('y2', 16)
      .attr('stroke', function(d) {return color(d)})
      .attr('stroke-width', 4);

  var ltext = glegend.append('svg:text')
    .attr('class', 'footer')
    .attr('dy', 40);
   ltext.append('svg:tspan')
    .text('Click on a country for information on donations, technology spread and transparency.')
    .attr('x', 0);
   ltext.append('svg:tspan')
    .attr('x', 0)
    .attr('dy', 12)
    .text('Zoom the map with the mousewheel, drag it with the mouse button pressed, highlight donations with mouse over.');
}

// render bar chart
var bar = function(selector, data) {
  maxval = d3.max(data, function(d) { return d.val });
  var loff = 130,
    barw = containerwidth(selector) - loff,
    barh = 20 * data.length,
    xoff = 10,
    yoff = 15,
    y = 20,
    format = d3.format(',d'),
    wscale = d3.scale.linear().domain([0, maxval]).range(['0px', barw + 'px']),
    hscale = d3.scale.ordinal().domain(data).rangeBands([0, barh]),
    xticks = wscale.ticks(4);

  var bar = d3.select(selector);
  bar.selectAll('svg').remove();
  var svg = bar.append('svg')
    .attr('class', 'bar')
    .attr('width', barw + 130)
    .attr('height', barh + yoff)
    // make space for legend
    .append('g')
      .attr('transform', 'translate(' + xoff + ',' + xoff + ')');

  // add lablels
  svg.selectAll('text')
    .data(data)
    .enter().append('text')
      .attr('x', barw + xoff)
      .attr('y', function(d, i) {return i * y + yoff})
      .text(function(d) {return d.iso + ': ' + format(d.val)});

  // add vertical lines
  svg.selectAll('line')
    .data(xticks)
    .enter().append('line')
      .attr('x1', wscale)
      .attr('x2', wscale)
      .attr('y1', 0)
      .attr('y2', barh)
      .style('stroke', '#ccc')
      .style('stroke-dasharray', '5,2');

  // add actual bars
  svg.selectAll('rect')
    .data(data)
    .enter().append('rect')
      .attr('y', function(d, i) {return i * y})
      .attr('width', function(d) {return wscale(d.val)})
      .attr('height', y - 1);

  // add legend to vertical lines
  svg.selectAll('.rule')
    .data(xticks)
    .enter().append('text')
      .attr('class', 'rule')
      .attr('x', wscale)
      .attr('y', 0)
      .attr('dy', -2)
      .attr('text-anchor', 'middle')
      .text(String);
};
