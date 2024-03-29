let colors = ['#fffff2', '#f8fcda', '#ecf4c1', '#dae8a6', '#c3d88c', '#a7c370', '#87ab55', '#628f39', '#3a6f1d', '#004d00'];
let columns = ['1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2015', '2016'];
let data_source = 'https://data.worldbank.org/indicator/AG.LND.FRST.ZS';
let selected_col = '1990';

let map = d3.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colors)
    .column(selected_col)
    .domain([0, 100])
    .legend({width: 120, height: 295})
    .unitId('iso3')
    .postUpdate(() => {
        annotate(map, 95, 120, `Forest area percentage of land area in ${selected_col}`, data_source=data_source);

        // Indicate in legend that it starts with values > 0
        let legend = map.svg.select('g.legend');
        let text = legend.select('text[class="text-9"]');
        text.text(`> ${text.text()}`);

        // Make zero values white
        map.data.forEach(d => {
            let val = d[map.column()];
            let unit = d3.select(`.unit-${d[map.unitId()]}`);
            if (val && 0 >= Math.round(val, 2)) {
                unit.style('fill', '#ffffff');
            }
        });
    });

d3.csv('/csv/forest-area.csv').then(data => {
    let selection = d3.select('#map').datum(data);
    map.draw(selection);
    animate(map, columns, interval_length=300);
    colSelect(map, columns);
});