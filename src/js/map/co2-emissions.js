let colors = ['#e7ffbe', '#d3de9c', '#bebd7c', '#a79e60', '#8e8148', '#746533', '#5a4a22', '#3f3216', '#241c0b', '#000000'];
let columns = ['1960', '1961', '1962', '1963', '1964', '1965', '1966', '1967', '1968', '1969', '1970', '1971', '1972', '1973', '1974', '1975', '1976', '1977', '1978', '1979', '1980', '1981', '1982', '1983', '1984', '1985', '1986', '1987', '1988', '1989', '1990', '1991', '1992', '1993', '1994', '1995', '1996', '1997', '1998', '1999', '2000', '2001', '2002', '2003', '2004', '2005', '2006', '2007', '2008', '2009', '2010', '2011', '2012', '2013', '2014'];
let data_source = 'https://data.worldbank.org/indicator/EN.ATM.CO2E.PC';
let selected_col = '2014';


let map = d3.choropleth()
    .geofile('/d3-geomap/topojson/world/countries.json')
    .colors(colors)
    .column(selected_col)
    .domain([0, 20])
    .legend(true)
    .unitId('iso3')
    .postUpdate(() => {
        annotate(map, 85, 170, `CO2 emissions (metric tons per capita) in ${selected_col}`, data_source=data_source);
    });


d3.csv('/csv/co2-emissions.csv').then(data => {
    let selection = d3.select('#map').datum(data);
    map.draw(selection);
    animate(map, columns, interval_length=500);
    colSelect(map, columns);
});
