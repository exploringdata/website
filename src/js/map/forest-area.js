let animation = null;
let colors = ['#fffff2', '#f8fcda', '#ecf4c1', '#dae8a6', '#c3d88c', '#a7c370', '#87ab55', '#628f39', '#3a6f1d', '#004d00'];
let columns = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2015', '2016'];
let interval_length = 300;
let selected_col = '1990';
let source = 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS';

let map = d3.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colors)
    .column(selected_col)
    .domain([0, 100])
    .legend(true)
    .scale(300)
    .height(830)
    .unitId('iso3')
    .postUpdate(() => {
        annotate(90, 150, `Forest Area Percentage of Country Area in the Year ${selected_col}`);
    });

d3.csv('/csv/worldbank-forest-area-1990-2016.csv').then(data => {
    let selection = d3.select('#map').datum(data);
    map.draw(selection);
});

d3.select('#animate').on('click', () => {
    clearInterval(animation);
    let cols = columns.slice();
    animation = setInterval(() => {
        selected_col = cols.shift();
        if (selected_col) {
            map.column(selected_col).update();
        } else {
            clearInterval(animation);
        }
    }, interval_length);
});

d3.select('#year-select').selectAll('li').data(columns).enter()
    .append('li').append('a')
        .text(d => d)
        .on('click', () => {
            clearInterval(animation);
            selected_col = d3.event.target.text;
            map.column(selected_col).update();
        });


function annotate(rect_height=75, x_offset=160, title='') {
    let footer_width = map.width() - x_offset,
        map_source = 'https://exploring-data.com' + document.location.pathname;

    d3.select('g.footer').remove();

    let g = map.svg.append('g')
        .attr('class', 'footer')
        .attr('width', '100%')
        .attr('height', rect_height)
        .attr('transform', `translate(0, ${map.height() - rect_height})`);

    g.append('rect')
        .attr('class', 'footer')
        .attr('width', footer_width)
        .attr('height', rect_height)
        .attr('x', x_offset);

    g.append('text')
        .attr('class', 'title')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 20)
        .text(title || map.column());

    g.append('text')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 36)
        .text('Data: ');

    g.append('svg:a')
        .attr('xlink:href', source)
        .append('svg:text')
            .text(source.replace(/https?:\/\//, ''))
            .attr('class', 'link')
            .attr('x', x_offset + 32)
            .attr('y', 36);

    g.append('text')
        .attr('width', footer_width)
        .attr('x', x_offset)
        .attr('y', 52)
        .text('Source: ');

    g.append('svg:a')
        .attr('xlink:href', map_source)
        .append('svg:text')
            .text(map_source.replace('https://', ''))
            .attr('class', 'link')
            .attr('x', x_offset + 45)
            .attr('y', 52);

    g.append('text')
        .attr('x', x_offset)
        .attr('y', 68)
        .text('Author: ');

    g.append('svg:a')
        .attr('xlink:href', 'https://ramiro.org/')
        .append('svg:text')
            .text('Ramiro Gómez - ramiro.org')
            .attr('class', 'link')
            .attr('x', x_offset + 42)
            .attr('y', 68);
}