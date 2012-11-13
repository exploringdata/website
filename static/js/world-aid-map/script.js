var year = 2010; // year with currently most comprehensive dataset
var limit = 20;
var current_sources,
  current_targets,
  max_received,
  max_donated,
  current_sources_iso,
  current_targets_iso,
  current_isos;

var spdata = function(key1, key2) {
  var data = [];
  var ranking = ranks[year][key1].reverse();
  for (i in ranking) {
    var country = ranking[i];
    var x = country.val;
    var iso = country.id;
    if (countrystats[year].hasOwnProperty(iso) && countrystats[year][iso].hasOwnProperty(key2)) {
      data.push({
        'title': countryinfo[iso].name,
        'label': iso,
        'x': x,
        'y': countrystats[year][iso][key2]
      });
      if (data.length == limit) break;
    }
  }
console.log(data)
  return data;
};

(function() {

// tab menu events
$('#tabmenu a').click(function(e) {
  e.preventDefault();
  $(this).tab('show');
});
$('#tabmenu a').on('shown', function(e) {
  e.preventDefault();
  console.log(e.target, e.relatedTarget)
});
// fill indicators select lists
var iselcet = $('#indicators');
$.each(indicators, function(k, v) {
  iselcet.append('<option value="' + k + '">' + v + '</option')
});

// indicator selection
iselcet.change(function(e) {
  e.preventDefault();
  scatterplot('#aidrelations', spdata('received', $(this).val()));
});

//TODO by default choose 5 top giving (or 5 top receiving) countries?
current_sources = ranks[year]['donated'].slice(-limit).reverse();
current_targets = ranks[year]['received'].slice(-limit).reverse();

//TODO reset these values with calculated max after calculating relations
max_received = current_targets[0].val;
max_donated = current_sources[0].val;

current_sources_iso = current_sources.map(function(d) {return d.iso});
current_targets_iso = current_targets.map(function(d) {return d.iso});
current_isos = current_sources_iso.concat(current_targets_iso);

// determine selected countries
$('.countryselect').click(function(e){
  e.preventDefault();
  if ('donors' == e.target.href.split('#')[1]) {
    showCountrySelect('donated');
  } else {
    showCountrySelect('received');
  }
});

var showCountrySelect = function(key){
  var li = d3.select('#countryselect').selectAll('li')
    .data(ranks[year][key].reverse());
  li.enter().append('li')
    .append('label')
      .attr('class', 'checkbox')
      .text(function(d){return d.iso})
      .append('input')
        .attr('type', 'checkbox')
        .attr('value', function(d){return d.iso});
      li.exit().remove();
}

var showrecipients = function(){
  console.log(this)
}

selected = donations[year].filter(function(d){
  return ('undefined' !== typeof countryinfo[d.source]
    && 'undefined' !== typeof countryinfo[d.target]
    && (-1 !== current_sources_iso.indexOf(d.source) || -1 !== current_targets_iso.indexOf(d.target))
  ) ? true : false
});

//drawlinks(selected);
// FIXME call with list based on selection either donors or recipients
drawlegend(current_sources_iso);

bar('#aiddonors', ranks[year]['donated'].slice(-limit).reverse());
bar('#aidrecipients', ranks[year]['received'].slice(-limit).reverse());

scatterplot('#aidrelations', spdata('received', 'IT.NET.USER.P2'));

d3.json('/json/world-countries.json', function(error, json) { // d3 v3
//d3.json('/json/world-countries.json', function(json) { // d3 v2
  drawmap(json);
});

})();
