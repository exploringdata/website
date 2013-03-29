var colors = d3.scale.category20();
var keyColor = function(d, i) {return colors(d.key)};

function getPrevDay(date) {
    return new Date((new Date(date).getTime() / 1000 - 86400) * 1000)
}

// FIXME format query outside this function for more flexibility, also add optional section arg
function getGuardianArticles(query, from, to) {
    var url = "http://content.guardianapis.com/search?callback=?";
    $.getJSON(url, {
        'q': '"' + query + '"',
        'from-date': from,
        'to-date': to,
        'page-size':15,
        'order-by':'relevance',
        'format':'json',
        'show-fields': 'headline,thumbnail'
    })
    .done(function(data) {
        var html = '';
        for (i in data.response.results) {
            var r = data.response.results[i];
            var src = 'undefined' !== typeof r.fields.thumbnail ? r.fields.thumbnail : 'http://placehold.it/70x42';
            html += '<div class="article row"><a href="' + r.webUrl + '"><div class="image span1"><img src="' + src + '"></div><div class="span5"><h3 title="' + r.webTitle + '">' + r.fields.headline + '</h3></div></a></div><hr>';
        }
        html += '<ul class="pager"><li><a href="#">Previous</a></li><li><a href="#">Next</a></li></ul>';
        d3.select('#articles').html(html);
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

function acronymize(s) {
    return s.split(/\s+/).map(function(s){return s.substring(0, 1).toUpperCase()}).join('')
}

// acronymize too long labels in bar charts
function acronymizeBars(labels) {
    labels.text(function(d) {
        if (d && d.length > 18) d = acronymize(d);
        return d;
    });
}

// FIXME add click handler to search for specific articles, also add to update handler
function barChart(selector, data) {
    nv.addGraph(function() {
        var chart = nv.models.multiBarHorizontalChart()
            .x(function(d) { return d.label })
            .y(function(d) { return d.value })
            .margin({top: 0, right: 20, bottom: 50, left: 115})
            .showValues(false)
            .tooltips(true)
            .showLegend(false)
            .showControls(false)
            .color(keyColor);

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var ds = d3.select(selector);
        ds.selectAll('div.bar').remove();
        ds.append('div').attr('class', 'bar').append('svg')
            .datum(data)
            .transition().duration(500)
            .call(chart);

        var labels = ds.selectAll('.nv-x text');
        labels.append('text');
        acronymizeBars(labels);

        nv.utils.windowResize(function() {
            chart.update;
            acronymizeBars(labels);
        });
        return chart;
    });
}

function barValues(freqdata) {
    return freqdata.slice(0, 20).map(function(item){
        return {label: item[0], value: item[1]}
    });
}

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

function historyMultiBar(selector, json,  init) {
    nv.addGraph(function() {
        var data = getHistoryData(json);
        var chart = nv.models.multiBarChart()
            .stacked(true)
            .color(keyColor);

        chart.xAxis
            .showMaxMin(false)
            .tickFormat(function(d) { return d3.time.format('%Y-%m')(new Date(d)) });

        chart.yAxis
            .tickFormat(d3.format(',d'));

        var hist = d3.select(selector).append('div').attr('class', 'history').append('svg');
        hist.datum(data)
            .transition().duration(500).call(chart);

        historyClick(hist, json);

        if ('undefined' !== typeof init && init) {
            // Initialize bars with latest date for "climate change" by
            // triggering click event on corresponding DOM element.
            // Since bars for keys are created consecutively and "climate change"
            // is the first key divide by 6, the number of different queries.
            var rects = hist.selectAll('rect')[0];
            var last_cl = rects[(rects.length-1)/6];
            var evt = document.createEvent('MouseEvents');
            evt.initMouseEvent('click', true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);
            last_cl.dispatchEvent(evt);
        }

        nv.utils.windowResize(function(){
            chart.update;
            historyClick(hist, json);
        });
        return chart;
    });
}

d3.json('/json/climate-changes-decade/articles.json', function(json) {
    historyMultiBar('#history', json, true);
    getGuardianArticles('climate change', '2013-03-01', '2013-03-31');
});