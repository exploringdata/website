let colors = ['#f9ffe2', '#edf0d4', '#e1e1c5', '#d5d2b8', '#c9c3aa', '#bdb59d', '#b2a790', '#a69983', '#9a8b76', '#8e7e6a', '#82715e', '#766453', '#6a5848', '#5e4c3d', '#524033', '#46352a', '#3a2a21', '#2e2019', '#211712', '#0d0d0d'];
let columns = ['1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'];
let data_source = 'https://data.worldbank.org/indicator/EN.ATM.CO2E.PC';
let selected_col = '2014';

let map = d3.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colors)
    .column(selected_col)
    .domain([0, colors.length])
    .legend({width: 120, height: 400})
    .unitId('iso3')
    .postUpdate(() => {
        annotate(map, 115, 120, `CO2 emissions (metric tons per capita) in ${selected_col}`, data_source=data_source);
    });

d3.csv('/csv/co2-emissions.csv').then(data => {
    let selection = d3.select('#map').datum(data);
    map.draw(selection);
    animate(map, columns, interval_length=300);
    colSelect(map, columns);
});
