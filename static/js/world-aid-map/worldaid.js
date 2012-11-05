(function() {

var width = 660,
  height = 495,
  legendh = 60,
  pathopacity = .5,
  selected,
  centered,
  geocountries,
  relation, // Population or GDP
  proj = d3.geo.equirectangular().scale(1).translate([0, 0]),
  arc = d3.geo.greatArc().precision(1),
  centroid = function(d) {return path.centroid(d.geometry)},
  format = d3.format(',d'),
  color = d3.scale.category20(),
  projection = d3.geo.mercator().scale(width).translate([0, 0]),
  path = d3.geo.path().projection(projection)
  // unused
  minarrowwidth = .3;

var tf = function() {
  return 'translate(' + width / 2 + ',' + height / 2 + ')'
};

var svg = d3.select('#map').append('svg')
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

var glegend = svg.append('g')
  .attr('transform', 'translate(0,' + (height - legendh) +')')
  .attr('width', width)
  .attr('height', legendh)
  .attr('id', 'legend');
glegend.append('svg:text')
  .text('World Aid Flow')
  .attr('class', 'heading');

var garcs = svg.append('g')
  .attr('transform', tf)
  .attr('id', 'arcs');

var linkcoords = function(d) {
  d.source = capitals[d.source];
  d.target = capitals[d.target];
  return d;
};

var dollarval = function(d) {
  var usd = d.usdollars;
  if (relation) usd = usd / d[relation];
  return Math.sqrt(usd) / 10000;
};

var rescale = function() {
  svg.attr('transform', 'translate(' + d3.event.translate + ')'
    + ' scale(' + d3.event.scale + ')')
}

//FIXME use min and max of total
var scalelinks = d3.scale.sqrt().domain([-10000000,10000000]);

//FIXME implement country select
var click = function(d) {
  console.log(d);
}

var drawlinks = function(links) {
  garcs.selectAll('path')
    .data(links)
    .enter().append('path')
      .style('opacity', .5)
      .style('stroke', function(d) {return color(d.source)})
      .style('stroke-width', function(d) {return dollarval(d)})
      .style('fill', 'none')
      .attr('d', function(d) {
        d = linkcoords(d);
        var p = {source:d.source.coords, target:d.target.coords};
        return path(arc(p))
      })
//      .style('fill', function(d) {return color(d.source)})
//      .attr('d', function (d) {
//        var inflow = false;
//        d = linkcoords(d);
//        return curvedarrow(projection(d.source.coords), projection(d.target.coords), inflow, Math.sqrt(d.usdollars) / 1000);
//      })
      .on('mouseover', function(d) {
        garcs.selectAll('path').style('opacity', .1);
        d3.select(this).style('stroke', 'red').style('opacity', pathopacity);
      })
      .on('mouseout', function(d) {
        garcs.selectAll('path').style('opacity', pathopacity);
        d3.select(this).style('stroke', color(d.source));
      })
      .append('title')
        .text(function(d) {return format(d.usdollars) + ' USD from ' + d.source.name + ' to ' + d.target.name});
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

var drawlegend = function(links) {
  var countrywidth = 60;
  glegend.selectAll('text.country')
    .data(links).enter()
    .append('svg:text')
      .attr('class', 'country')
      .attr('x', function(d, i) {return countrywidth * i})
      .attr('dx', 20)
      .attr('dy', 20)
      .text(function(d) {return d.source.iso})
      .on('mouseover', function(d,i) {tooltip(d.source.name)})
      .on('mouseout', function(d,i) {$('#tooltip').remove()});



  glegend.selectAll('line.country')
    .data(links).enter()
    .append('svg:line')
      .attr('class', 'country')
      .attr('x1', function(d, i) {return countrywidth * i})
      .attr('y1', 16)
      .attr('x2', function(d, i) {return 14 + countrywidth * i})
      .attr('y2', 16)
      .attr('stroke', function(d) {return color(d.source.iso)})
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

// main program flow
//var current_sources = ['ESP', 'USA', 'DEU'];
var current_sources = ['AUS', 'DEU', 'ESP', 'FRA', 'GBR', 'USA'];
var current_targets = ['AFG', 'VUT', 'VEN', 'VNM'];
//var current_targets = ['VUT'];

selected = donations.filter(function(d){
  return ('undefined' !== typeof capitals[d.source]
    && 'undefined' !== typeof capitals[d.target]
    && -1 !== current_sources.indexOf(d.source)
    && -1 !== current_targets.indexOf(d.target)
  ) ? true : false
});

drawlinks(selected);
drawlegend(selected);

d3.json('/json/world-countries.json', function(error, json) { // d3 v3
//d3.json('world-countries.json', function(json) { // d3 v2
  geocountries = json.features;
  gcountries.selectAll('path')
    .data(geocountries)
    .enter().append('path')
      .attr('d', path)
      .on('click', click);

  // draw circles for capitals
  gcountries.selectAll('circle')
    .data(geocountries.filter(function(d){
      // ignore countries with missing data for now
      return ('undefined' === typeof capitals[d.id]) ? false : true;
    }))
    .enter().append('circle')
      .attr('cx', function(d) {return projection(capitals[d.id].coords)[0]})
      .attr('cy', function(d) {return projection(capitals[d.id].coords)[1]})
      .attr('r', 1.8)
      .append('title')
        .text(function(d) {return capitals[d.id].name + ', ' + d.properties.name});
});

// unused
// adapted from http://www.uis.unesco.org/Education/Pages/international-student-flow-viz.aspx
// inflow / outflow doesn't work
function curvedarrow(src, trg, inflow, width) {
  var arrowOffset = width;

  if (inflow) arrowOffset = -arrowOffset;

  dx = trg[0] - src[0]; //distance between src and trg
  dy = trg[1] - src[1];
  cx = (src[0]+trg[0])/2; //center of the line
  cy = (src[1]+trg[1])/2;

  ra = Math.sqrt(dx * dx + dy * dy);
  er = ra / (Math.abs(dx / height))*.3; //ellipse radius

  //calculating control point according to er
  lineangle = Math.atan(dy/dx); //angle of the line between src and trg
  erangle = Math.asin((ra/2)/er); // angle of the arc

  if (isNaN(erangle)) {
    console.log(src[0], src[1], dx, dy, ra, er, erangle)
    // FIXME arrow will be missing
    return;
  }

  rc = Math.tan(erangle)*(ra/2); // distance between direct line and control point

  cpx = Math.cos(lineangle-(Math.PI/2))*rc; // absolute coordinates of the ctrl point
  cpy = Math.sin(lineangle-(Math.PI/2))*rc;

  ctrx = cpx+cx; //coords of ctrl point relative to direct line
  ctry = cpy+cy;

  trgangle = Math.atan((ctrx-trg[0])/(ctry-trg[1]));
  angle= Math.PI/2; // set the angle so its always bending upwards

  if (trg[0]-src[0] < 0) angle = -Math.PI/2;
  if (trgangle != 0) arrowOffset = -arrowOffset;

  dTrgX = trg[0]+Math.sin(trgangle)*arrowOffset;
  dTrgY = trg[1]+Math.cos(trgangle)*arrowOffset;

  TinX = dTrgX+(Math.sin(trgangle+angle)*width);
  TinY = dTrgY+(Math.cos(trgangle+angle)*width);
  ToutX = dTrgX+(Math.sin(trgangle-angle)*width);
  ToutY = dTrgY+(Math.cos(trgangle-angle)*width);

  curveOut= 'M'+ TinX + "," +TinY+' Q'+ctrx+','+ctry+' '+src[0] + "," + src[1];
  curveIn = ' Q'+ctrx+','+ctry+' '+ToutX + "," + ToutY;
  arrowHead= ' L' +trg[0] + "," + trg[1]+ ' '+ TinX + "," +TinY;

  finalArrow = curveOut + curveIn + arrowHead;
  return finalArrow ;
}

})();
