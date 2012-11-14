// year with currently most comprehensive dataset, no newer donations data yet
var year = 2010,
  limit = 20,
  format = d3.format(',r'),
  recipients,
  donors,
  max_received,
  max_donated;

var showlinks = function(cid) {
  var l = donations[year].filter(function(d){
    return ('undefined' !== typeof countryinfo[d.source]
      && 'undefined' !== typeof countryinfo[d.target]
      && (cid == d.source || cid == d.target)) ? true : false
  });
  drawlinks(l)
};

// format us dollar values
var formatdollar = function(val) {
  var scale = 1000000;
  if (val > scale) val = d3.round(val / scale, 2) + 'M';
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
      val = 4 - 4 * countrystats[year][d.id]['received'] / max_received
    }
    else if ('undefined' !== typeof countrystats[year][d.id]['donated']) {
      // scale max between 6 (min donated) and 10 (max donated)
      val = 6 + 4 * countrystats[year][d.id]['donated'] / max_donated
    }
  }
  if (null == val) return null;
  return 'q' + parseInt(~~val) + '-11';
};

// for aid rankings
var aidranking = function(items, infix) {
  var ranking = [];
  $.each(items, function(idx, item){
    ranking.push({
      label: item.label,
      val: item.val,
      title: countryinfo[item.label].name + ' (' + item.label + '): ' + infix + format(item.val),
      formatval: formatdollar(item.val)
    })
  });
  return ranking;
};

// for indicator rankings
var indicatorranking = function(items, indicator) {
  var ranking = [], val, formatval;
  $.each(items, function(idx, item) {
    if ('undefined' !== typeof countrystats[year][item.label][indicator]) {
      val = countrystats[year][item.label][indicator];
      formatval = format(val);
    } else {
      val = 'NA';
      formatval = '';
    }
    ranking.push({
      label: item.label,
      val: val,
      title: countryinfo[item.label].name + '(' + item.label + '): ' + format(val),
      formatval: formatval
    })
  });
  return ranking;
};

// sort descending by val property
var sdesc = function(a, b) {return b.val - a.val};

/********** main program flow **********/

(function() {

donors = ranks[year]['donated'].reverse();
recipients = ranks[year]['received'].reverse();

//TODO reset these values with calculated max after calculating relations
max_received = donors[0].val;
max_donated = recipients[0].val;

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
  scatterplot('#aidrelations', spdata(recipients.slice(0, limit), $(this).val()));
});

// donor rankings
bar('#aiddonors', aidranking(donors.slice(0, limit), ' - total aid donated in USD: '));
bar('#donorstransparency', indicatorranking(donors.slice(0, limit), 'aidtransparency'));

// recipients rankings
bar('#aidrecipients', aidranking(recipients.slice(0, limit), ' - total aid received in USD: '));
bar('#recipientstransparency', indicatorranking(recipients.slice(0, limit), 'IQ.CPA.TRAN.XQ'));

// scatterplot with aid relations to indicators
scatterplot('#aidrelations', spdata(recipients, 'IT.NET.USER.P2'));

// load geo data and draw map
d3.json('/json/world-countries.json', function(error, json) {
  drawmap(json, quantize, showlinks);
  drawlegend();
});

})();
