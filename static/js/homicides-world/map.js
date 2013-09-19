var map = {
    year: {
        default: 2010,
        min: 1995,
        max: 2012
    },
    legend: {
        title: 'Intentional Homicides by 100,000 People',
        width: 400,
        height: 75
    },
    source: {
        url: 'http://data.worldbank.org/indicator/VC.IHR.PSRC.P5',
        title: 'World Bank Intentional Homicides'
    },
    data: {
        geo: null,
        wb: null
    }
};

queue()
    .defer(d3.json, '/json/topo/countries.topo.json')
    .defer(d3.csv, '/csv/homicides.csv')
    .await(init);


function init(error, geo_data, wb_data) {
    if (error) {
        alert('An error occurred when loading the data.')
        return;
    }

    // make data available to other functions
    map.data.geo = geo_data;
    geo_data.wb = wb_data;

    var series = [];
    for (i in wb_data) {
        var country_data = wb_data[i];
        var val = parseFloat(country_data[map.year.default]);
        series.push({key: country_data['Country Code'], value: val})
    }
    renderMap('#map', geo_data, series, map.year.default);
}


function getCountryVal(iso3, wb_data) {
    cc_data = wb_data.filter(function(d){ return d.key === iso3 }).shift();
    if (cc_data)
        return cc_data.value;
}


function renderMap(selector, geo_data, wb_data, year) {
    var svg,
        width = containerDim(selector, 'width'),
        height = width * .52,
        f = d3.format('.2f');

    var max_val = d3.max(wb_data, function(d) { return d.value })
    var min_val = d3.min(wb_data, function(d) { return d.value })

    var quantize = d3.scale.quantize()
        .domain([1, max_val])
        .range(d3.range(colors.length).map(function(i) { return colors[i] }));

    var projection = d3.geo.naturalEarth()
        .scale(width/5.2)
        // hide most of Antarctica and move a little to the left
        .translate([(width / 2.12), (height / 1.8)])
        .precision(.1);

    var path = d3.geo.path()
        .projection(projection);

    svg = d3.select(selector).append('svg')
        .attr('width', width)
        .attr('height', height);
    svg.append('g')
        .attr('class', 'countries')
    .selectAll('path')
        .data(topojson.feature(geo_data, geo_data.objects.subunits).features)
    .enter().append('path')
        .attr('class', 'country')
        .style('fill', function(d) {return quantize(getCountryVal(d.id, wb_data)) })
        .attr('d', path)
        .append('title')
            .text(function (d) {
                var title = d.properties.name;
                if (val = getCountryVal(d.id, wb_data))
                    title += ': ' + f(val)
                return title;
            });

    svg.insert('path', '.graticule')
        .datum(topojson.mesh(geo_data, geo_data.objects.subunits, function(a, b) { return a !== b; }))
        .attr('class', 'boundary')
        .attr('d', path);

    // legend
    var lg = svg.append('g')
        .attr('width', map.legend.width)
        .attr('height', map.legend.height)
        .attr('transform', 'translate(' + (width - map.legend.width) + ', ' + (height - map.legend.height) +  ')');

    lg.append('rect')
        .attr('class', 'legend-box')
        .attr('width', map.legend.width)
        .attr('height', map.legend.height);

    lg.append('text')
        .text(map.legend.title + ' in ' + year)
        .attr('class', 'legend-title')
        .attr('x', 10)
        .attr('y', 25)

    // color scale
    var cscale = {w: 1, h: 10, offset_x: 40, offset_y: 22};
    sg = lg.append('g')
        .attr('transform', 'translate(10,' + (map.legend.height - cscale.h - cscale.offset_y) + ')');

    sg.append('text')
        .text(f(min_val))
        .attr('x', 0)
        .attr('y', 9);

    sg.append('text')
        .text(f(max_val))
        .attr('x', colors.length * cscale.w + cscale.offset_x + 5)
        .attr('y', 9);

    sg.append('text')
        .attr('class', 'source')
        .text('Data Source: ' + map.source.title)
        .attr('x', 0)
        .attr('y', cscale.offset_y + 8)
        .on('click', function() { window.open(map.source.url) });

    // draw color scale
    sg.selectAll('rect')
        .data(colors)
    .enter().append('rect')
        .attr('x', function(d, i) { return (i * cscale.w) + cscale.offset_x })
        .attr('fill', function(d, i) { return colors[i] })
        .attr('width', cscale.w)
        .attr('height', cscale.h);
}