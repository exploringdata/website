jQuery(function($){
    $('#map').height($(window).height() - $('.navbar').height() - 20);
//      init();
});


function init() {
    map = new OpenLayers.Map({
        div: "map",
        allOverlays: true
    });

    var gmap = new OpenLayers.Layer.Google("Google Streets");
    var osm = new OpenLayers.Layer.OSM("OSM", {visibility: false});

    // note that first layer must be visible
    map.addLayers([gmap, osm]);
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    map.setCenter(new OpenLayers.LonLat(13.4127, 52.5233).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()), 11);
}

var map = new OpenLayers.Map({
    div: "map",
    projection: "EPSG:900913",
    layers: [
        new OpenLayers.Layer.XYZ(
            "OpenStreetMap",
            [
                "http://otile1.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile2.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile3.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png",
                "http://otile4.mqcdn.com/tiles/1.0.0/osm/${z}/${x}/${y}.png"
            ],
            {
                attribution: "Data, imagery and map information provided by <a href='http://www.mapquest.com/'  target='_blank'>MapQuest</a>, <a href='http://www.openstreetmap.org/' target='_blank'>Open Street Map</a> and contributors, <a href='http://creativecommons.org/licenses/by-sa/2.0/' target='_blank'>CC-BY-SA</a>  <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
                transitionEffect: "resize"
            }
        ),
        new OpenLayers.Layer.XYZ(
            "Imagery",
            [
                "http://oatile1.mqcdn.com/naip/${z}/${x}/${y}.png",
                "http://oatile2.mqcdn.com/naip/${z}/${x}/${y}.png",
                "http://oatile3.mqcdn.com/naip/${z}/${x}/${y}.png",
                "http://oatile4.mqcdn.com/naip/${z}/${x}/${y}.png"
            ],
            {
                attribution: "Tiles Courtesy of <a href='http://open.mapquest.co.uk/' target='_blank'>MapQuest</a>. Portions Courtesy NASA/JPL-Caltech and U.S. Depart. of Agriculture, Farm Service Agency. <img src='http://developer.mapquest.com/content/osm/mq_logo.png' border='0'>",
                transitionEffect: "resize"
            }
        )
    ],
    zoom: 5
});

map.addControl(new OpenLayers.Control.LayerSwitcher());
map.setCenter(new OpenLayers.LonLat(13.4127, 52.5233).transform(
        new OpenLayers.Projection("EPSG:4326"),
        map.getProjectionObject()), 11);