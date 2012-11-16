// year with currently most comprehensive dataset, no newer donations data yet
var year = 2010,
  limit = 20,
  format = d3.format(',r'),
  donors,
  reldonors,
  recipients,
  relrecipients,
  relation,
  scatterrelation,
  maxreceived,
  maxdonated,
  geocountries;

var showLinks = function(cid) {
  var l = donations[year].filter(function(d){
    return ('undefined' !== typeof countryinfo[d.source]
      && 'undefined' !== typeof countryinfo[d.target]
      && (cid == d.source || cid == d.target)) ? true : false
  });
  drawlinks(l)
};

var scalelink = function(d) {
  var usd = d.usd;
//  if (relation) usd = usd / d[relation];
  return Math.sqrt(usd) / 10000; // FIXME use max to scale
};

// format us dollar values
var formatDollar = function(val) {
  var scale = 1000000;
  val = d3.round(val, 2);
  if (val > scale) val = val / scale + 'M';
  return val;
};

// data structure for scatterplot
var spdata = function(xdata, key) {
  var data = [];
  for (i in xdata) {
    var country = xdata[i];
    var x = country.val;
    var iso = country.label;
    if (countrystats[year].hasOwnProperty(iso) && countrystats[year][iso].hasOwnProperty(key)) {
      data.push({
        'title': countryinfo[iso].name,
        'label': iso,
        'x': x,
        'y': countrystats[year][iso][key]
      });
      if (data.length == limit) break;
    }
  }
  return data
};

// country colors
var quantize = function(d) {
  var val;
  var maxval = 10; //RdBu 0 = red, 10 = blue 
  if ('undefined' !== typeof countrystats[year][d.id]) {
    if ('undefined' !== typeof countrystats[year][d.id]['received']) {
      // scale min between 0 (max received) and 4 (min received)
      val = 4 - 4 * countrystats[year][d.id]['received'] / maxreceived
    }
    else if ('undefined' !== typeof countrystats[year][d.id]['donated']) {
      // scale max between 6 (min donated) and 10 (max donated)
      val = 6 + 4 * countrystats[year][d.id]['donated'] / maxdonated
    }
  }
  if (null == val) return null;
  return 'q' + parseInt(~~val) + '-11';
};

// for aid rankings
var aidRanking = function(items, infix) {
  var ranking = [];
  $.each(items, function(idx, item){
    var formatval = formatDollar(item.val);
    ranking.push({
      label: item.label,
      val: item.val,
      title: countryinfo[item.label].name + ' (' + item.label + ') - ' + infix + format(item.val),
      formatval: formatval
    })
  });
  return ranking;
};

// for indicator rankings
var indicatorRanking = function(items, indicator) {
  var ranking = [], val, formatval;
  $.each(items, function(idx, item) {
    if ('undefined' !== typeof countrystats[year][item.label][indicator]) {
      val = countrystats[year][item.label][indicator];
      formatval = format(val);
    } else {
      val = 0;
      formatval = 'NA';
    }
    ranking.push({
      label: item.label,
      val: val,
      title: countryinfo[item.label].name + ' (' + item.label + '): ' + formatval,
      formatval: formatval
    })
  });
  return ranking;
};

// sort descending by val property
var sdesc = function(a, b) {return b.val - a.val};

// get values divided by relation
var getRelation = function(unrelated, relation, sortorder) {
  var related = [];
  $.each(unrelated, function(idx, item){
    if (countrystats[year][item.label].hasOwnProperty(relation)) {
      related.push({
        val: item.val / countrystats[year][item.label][relation],
        label: item.label
      })
    }
  });
  if (sortorder == 'desc')
    related = related.sort(sdesc);
  return related;
};

var setAidRelations = function(source, target) {
  reldonors = source;
  relrecipients = target;
  maxdonated = reldonors[0].val;
  maxreceived = relrecipients[0].val;
};

var showGraphs = function(text) {
  var rd = reldonors.slice(0, limit),
    rr = relrecipients.slice(0, limit);
  bar('#aiddonors', aidRanking(rd, 'aid donated in USD ' + text + ': '));
  bar('#donorstransparency', indicatorRanking(rd, 'aidtransparency'));
  bar('#aidrecipients', aidRanking(rr, 'aid received in USD ' + text + ': '));
  bar('#recipientstransparency', indicatorRanking(rr, 'IQ.CPA.TRAN.XQ'));
  scatterplot('#aidrelations', spdata(relrecipients, scatterrelation));
};

/********** main program flow **********/

(function() {

// lists of donors and recipients sorted by aid sums descending
donors = ranks[year]['donated'].reverse();
recipients = ranks[year]['received'].reverse();

// copy values not reference to array
reldonors = donors.slice();
relrecipients = recipients.slice();

// these values are overwritten when calculating relations and are reset when
// showing totals
maxdonated = reldonors[0].val;
maxreceived = relrecipients[0].val;

// load geo data and draw map
d3.json('/json/world-countries.json', function(error, json) {
  geocountries = json.features;
  drawmap(geocountries, quantize, showLinks);
  drawlegend();
});

var iselect = $('#indicators');
// fill indicators select lists
$.each(indicators, function(i) {
  if ('global' == indicators[i].type)
    iselect.append('<option value="' + indicators[i].id + '">' + indicators[i].label + '</option')
});
// indicator selection
iselect.change(function(e) {
  e.preventDefault();
  scatterrelation = $(this).val();
  scatterplot('#aidrelations', spdata(relrecipients, scatterrelation));
});

// calculate relations and redraw graphs
$('.relate').click(function(e){
  $('.relate').parent('li').removeClass('active');
  $(this).parent('li').attr('class', 'active');
  relation = this.id;
  if ('norelate' == relation) {
    setAidRelations(donors.slice(), recipients.slice());
  } else {
    setAidRelations(getRelation(donors, relation, 'desc'), getRelation(recipients, relation, 'desc'));
  }
  if (!scatterrelation) {
    scatterrelation = iselect.find('option:first')[0].value;
  }
  showGraphs(this.innerHTML);
  drawmap(geocountries, quantize, showLinks);
});

scatterrelation = iselect.find('option:first')[0].value;
showGraphs('total amounts');

})();
