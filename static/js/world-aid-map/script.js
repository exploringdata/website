// year with currently most comprehensive dataset, no newer donations data yet
var year = 2010,
  limit = 20,
  format = d3.format(',r'),
  recipients,
  donors,
  relation,
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
    var formatval = formatdollar(item.val);
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
var indicatorranking = function(items, indicator) {
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
var getrelation = function(unrelated, relation, sortorder) {
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

/********** main program flow **********/

(function() {

// lists of donors and recipients sorted by aid sums descending
donors = ranks[year]['donated'].reverse();
recipients = ranks[year]['received'].reverse();

// these values are overwritten when calculating relations and are reset when
// showing totals
max_donated = donors[0].val;
max_received = recipients[0].val;

// load geo data and draw map
d3.json('/json/world-countries.json', function(error, json) {
  drawmap(json, quantize, showlinks);
  drawlegend();
});

// calculate relations and redraw graphs
$('.relate').click(function(e){
  $('.relate').parent('li').removeClass('active');
  $(this).parent('li').attr('class', 'active');

  var reldonors = [], relrecipients = [];
  var text = this.innerHTML;
  if ('norelate' == this.id) {
    // copy values not reference to array
    reldonors = donors.slice();
    relrecipients = recipients.slice();
    max_donated = donors[0].val;
    max_received = recipients[0].val;
  } else {
    reldonors = getrelation(donors, this.id, 'desc');
    relrecipients = getrelation(recipients, this.id, 'desc');
    max_donated = reldonors[0].val;
    max_received = relrecipients[0].val;
  }
  bar('#aiddonors', aidranking(reldonors.slice(0, limit), 'aid donated in USD ' + text + ': '));
  bar('#donorstransparency', indicatorranking(reldonors.slice(0, limit), 'aidtransparency'));
  bar('#aidrecipients', aidranking(relrecipients.slice(0, limit), 'aid received in USD ' + text + ': '));
  bar('#recipientstransparency', indicatorranking(relrecipients.slice(0, limit), 'IQ.CPA.TRAN.XQ'));
});


// fill indicators select lists
var iselect = $('#indicators');
$.each(indicators, function(i) {
  if ('global' == indicators[i].type)
    iselect.append('<option value="' + indicators[i].id + '">' + indicators[i].label + '</option')
});
// indicator selection
iselect.change(function(e) {
  e.preventDefault();
  scatterplot('#aidrelations', spdata(recipients.slice(0, limit), $(this).val()));
});

// donor rankings
bar('#aiddonors', aidranking(donors.slice(0, limit), 'total aid donated in USD: '));
bar('#donorstransparency', indicatorranking(donors.slice(0, limit), 'aidtransparency'));

// recipients rankings
bar('#aidrecipients', aidranking(recipients.slice(0, limit), 'total aid received in USD: '));
bar('#recipientstransparency', indicatorranking(recipients.slice(0, limit), 'IQ.CPA.TRAN.XQ'));

// scatterplot with aid relations to indicators
scatterplot('#aidrelations', spdata(recipients.slice(0, limit), iselect.find('option:first')[0].value));

})();
