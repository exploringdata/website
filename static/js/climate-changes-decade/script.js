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

function historyStream(selector, data) {
    var colors = d3.scale.category20();
    keyColor = function(d, i) {return colors(d.key)};

    nv.addGraph(function() {
        var chart = nv.models.stackedAreaChart()
            .x(function(d) { return d[0] })
            .y(function(d) { return d[1] })
            .color(keyColor);

        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%x')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',d'));

        d3.select(selector).append('div').attr('class', 'history').append('svg')
            .datum(data)
          .transition().duration(500).call(chart);

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

function historyMultiBar(selector, data) {
    nv.addGraph(function() {
        var data2 = [];
        data.map(function(page){
            values = page.values.map(function(val){
                return {x:val[0], y:val[1]}
            });
            data2.push({'key': page['key'], 'values': values});
        });

        var chart = nv.models.multiBarChart().stacked(true);

        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%Y-%m')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var hist = d3.select(selector).append('div').attr('class', 'history').append('svg');
        hist.datum(data2)
            .transition().duration(500).call(chart);

        // FIXME click doesn't work after nv.utils.windowResize(chart.update)
        hist.selectAll('rect').on('click', function(d, i) {
            var label = data[d.series].key;
            var file = label.replace(' ', '-') + '/' + d.x/1000 + '.json';
            d3.json('/json/climate-changes-decade/' + file, function(json) {
                barChart('#words', [{
                    key: label,
                    values: json.words.slice(0, 20).map(function(item){
                        return {label: item[0], value: item[1]}
                    })
                }]);
                barChart('#sections', [{
                    key: label,
                    values: json.sections.slice(0, 20).map(function(item){
                        return {label: item[0], value: item[1]}
                    })
                }]);
            });
        });

        nv.utils.windowResize(chart.update);
        return chart;
    });
}

function barChart(selector, data) {
    nv.addGraph(function() {
      var chart = nv.models.multiBarHorizontalChart()
          .x(function(d) { return d.label })
          .y(function(d) { return d.value })
          .margin({top: 30, right: 20, bottom: 50, left: 120})
          .showValues(true)
          .tooltips(false)
          .showControls(false);

      chart.yAxis
          .tickFormat(d3.format(',.2f'));

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