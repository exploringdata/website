var histselector = '#history',
    histselection = d3.select(histselector),
    colors = d3.scale.category20(),
    keyColor = function(d, i) {return colors(d.key)},
    getQueryDate = d3.time.format("%Y-%m-%d"),
    defaultGuardianParams = {
        from:'2013-03-01',
        to:'2013-03-31',
        q:'"climate change"'
    };

function getPrevDay(date) {
    return new Date(date - 86400)
}

// FIXME move date formatting here, also add optional section arg and page
// use d3.format if possible
function getGuardianArticles(query, from, to) {
    var url = "http://content.guardianapis.com/search?callback=?";
    $.getJSON(url, {
        'q': query,
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
            var src = 'undefined' !== typeof r.fields.thumbnail ? r.fields.thumbnail : '/img/no-image.70x42.png';
            html += '<div class="article row"><div class="image span1"><a href="' + r.webUrl + '"><img src="' + src + '"></a></div><div class="span5"><div title="' + r.webTitle + '"><a href="' + r.webUrl + '">' + r.fields.headline + '</a></div><span class="meta"><i class="icon-calendar"></i> ' + new Date(r.webPublicationDate).toGMTString() + ' in ' + r.sectionName + '</span></div></div><hr>';
        }
        html += '<ul class="pager"><li><a href="#">Previous</a></li><li><a href="#">Next</a></li></ul>';
        d3.select('#articles').html(html);
        d3.select('#queryinfo').html(query + ' ' + d3.time.format('%Y-%m')(new Date(from)));
    });
}

function getHistoryData(json) {
    return json.map(function(query){
        values = query.values.map(function(val){
            // Add q to know correct series in click handler.
            // Main data index differs from series index, when one or more
            // series are disabled.
            return {x:val[0], y:val[1], q: query['key']}
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

function historyClick() {
    histselection.selectAll('rect').on('click', function(d, i) {
        var label = d.q;
        // milliseconds need to be converted back to seconds
        var file = label.replace(' ', '-') + '/' + d.x / 1000 + '.json';
        var date = new Date(d.x);
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
        from = getQueryDate(date);
        date.setMonth(date.getMonth() + 1);
        to = getQueryDate(getPrevDay(date));
        // enclose phrases in quotes
        getGuardianArticles('"' + label + '"', from, to);
    });
}

function historyMultiBar(json, init) {
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

        var hist = histselection.append('div').attr('class', 'history').append('svg');
        hist.datum(data)
            .transition().duration(500).call(chart);

        // bind click events before and after chart updates
        historyClick();
        // adding event with d3 overrides nvd3 handler, thus use jquery
        $(histselector + ' .nv-legend .nv-series').click(historyClick);
        nv.utils.windowResize(function(){
            chart.update;
            historyClick();
        });

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

        return chart;
    });
}

d3.json('/json/climate-changes-decade/articles.json', function(json) {
    historyMultiBar(json, true);
});