const {Deck} = deck;
const {ScatterplotLayer} = deck;
const {TerrainLayer} = deck;
const {CSVLoader} = loaders;

const MAX_ZOOM = 15;
const RADIUS = 20;

const INITIAL_VIEW_STATE = {
    latitude: 36.77,
    longitude: -3.88,
    zoom: 13.5,
    bearing: 180,
    pitch: 60,
    maxPitch: 89
};

// Terrarium Terrain Tiles (AWS/Mapzen)
const TERRARIUM_ELEVATION = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const TERRARIUM_DECODER = {
    rScaler: 256,
    gScaler: 1,
    bScaler: 1/256,
    offset: -32768
};

const ESRI_SATELLITE = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';

const terrain = new TerrainLayer({
    id: 'terrain',
    minZoom: 0,
    maxZoom: MAX_ZOOM,
    strategy: 'no-overlap',
    elevationDecoder: TERRARIUM_DECODER,
    elevationData: TERRARIUM_ELEVATION,
    texture: ESRI_SATELLITE,
    wireframe: false,
    color: [255, 255, 255]
});

const scatterplot = new ScatterplotLayer({
    id: 'photos',
    data: '/csv/nerja-dataset-gps.csv',
    loaders: [CSVLoader],
    getPosition: d => [d.longitude, d.latitude, d.altitude],
    getFillColor: [255, 140, 0, 200],
    getRadius: RADIUS,
    pickable: true,
    onClick: info => console.log(info.object)
});

let deckInstance = new Deck({
    canvas: document.getElementById('deck'),
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [terrain, scatterplot]
});
document.getElementById('loading').style.display = 'none';
