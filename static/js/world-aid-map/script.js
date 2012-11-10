(function() {

var year = 2010; // year with currently most comprehensive dataset

d3.json('/json/world-countries.json', function(error, json) { // d3 v3
//d3.json('/json/world-countries.json', function(json) { // d3 v2
  drawmap(json);
});

// tab menu events
$('#tabmenu a').click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});

$('#tabmenu a').on('shown', function(e) {
  e.preventDefault();
  console.log(e.target, e.relatedTarget)
});


//TODO by default choose 5 top giving (or 5 top receiving) countries?
var current_sources = ranks[year]['donated'].slice(-5).reverse();
var current_targets = ranks[year]['received'].slice(-5).reverse();

var current_sources_iso = current_sources.map(function(d) {return d.iso});
var current_targets_iso = current_targets.map(function(d) {return d.iso});
var current_isos = current_sources_iso.concat(current_targets_iso);

// determine selected countries
selected = donations[year].filter(function(d){
  return ('undefined' !== typeof countryinfo[d.source]
    && 'undefined' !== typeof countryinfo[d.target]
    && (-1 !== current_sources_iso.indexOf(d.source) || -1 !== current_targets_iso.indexOf(d.target))
  ) ? true : false
});

drawlinks(selected);
// FIXME call with list based on selection either donors or recipients
drawlegend(current_sources_iso);

bar('#aiddonors', ranks[year]['donated'].slice(-10).reverse());
bar('#aidrecipients', ranks[year]['received'].slice(-10).reverse());

})();
