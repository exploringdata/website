var colors = d3.scale.category20();
keyColor = function(d, i) {return colors(d.key)};

function getPrevDay(date) {
    return new Date((new Date(date).getTime() / 1000 - 86400) * 1000)
}

function getGuardianArticles(query, from, to) {
    var url = "http://content.guardianapis.com/search?callback=?";
    $.getJSON(url, {
        'q': '"' + query + '"',
        'from-date': from,
        'to-date': to,
        'page-size':10,
        'order-by':'relevance',
        'format':'json',
        'show-fields': 'headline,thumbnail'
    })
    .done(function(data) {
        console.log(data)
    });
}

function getHistoryData(json) {
    return json.map(function(query){
        values = query.values.map(function(val){
            return {x:val[0], y:val[1]}
        });
        return {'key': query['key'], 'values': values};
    });
}

function barValues(freqdata) {
    return freqdata.slice(0, 20).map(function(item){
        return {label: item[0], value: item[1]}
    });
}

// FIXME click doesn't work after nv.utils.windowResize(chart.update)
function historyClick(hist, json) {
    hist.selectAll('rect').on('click', function(d, i) {
        var label = json[d.series].key;
        // milliseconds need to be converted back to seconds
        var file = label.replace(' ', '-') + '/' + d.x / 1000 + '.json';
        d3.json('/json/climate-changes-decade/' + file, function(freqdata) {
            barChart('#words', [{
                key: label,
                values: barValues(freqdata.words)
            }]);
            barChart('#sections', [{
                key: label,
                values: barValues(freqdata.sections)
            }]);
        });
    });
}

function historyMultiBar(selector, json) {
    nv.addGraph(function() {
        var data = getHistoryData(json);
        var chart = nv.models.multiBarChart().stacked(true).color(keyColor);

        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%Y-%m')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var hist = d3.select(selector).append('div').attr('class', 'history').append('svg');
        hist.datum(data)
            .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);
        historyClick(hist, json);
        return chart;
    });
}

// FIXME add click handler to search for specific articles
function barChart(selector, data) {
    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .margin({top: 30, right: 20, bottom: 50, left: 120})
          .showValues(false)
          .tooltips(true)
          .showControls(false)
          .color(keyColor);

      chart.yAxis
          .tickFormat(d3.format(',d'));

      d3.select(selector).selectAll('div.bar').remove();
      d3.select(selector).append('div').attr('class', 'bar').append('svg')
          .datum(data)
        .transition().duration(500)
          .call(chart);

      nv.utils.windowResize(chart.update);
      return chart;
    });
}

d3.json('/json/climate-changes-decade/articles.json', function(json) {
    historyMultiBar('#history', json);
});