var routes = [];
var route = {};
$('.datenhellgrau td').each(function(idx, item){
    if ('sp1_1' == $(item).attr('headers')) {
        route = {};
        route['name'] = $(item).text();
    }
    else if ('sp1_2' == $(item).attr('headers')) {
        route['gpx'] = $($(item).find('.download a')[0]).attr('href')
            .replace('../../download/gps_tracks/', '/gpx/');
        routes.push(route);
    }
});
JSON.stringify(routes);