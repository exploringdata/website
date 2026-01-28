const {Deck} = deck;
const {TerrainLayer} = deck;
const MAX_ZOOM = 15;

const INITIAL_VIEW_STATE = {
    latitude: 36.776608333333336,
    longitude: -3.8624916666666667,
    zoom: 12,
    bearing: 180,
    pitch: 60,
    maxPitch: 89
};

// Terrarium Terrain Tiles (AWS/Mapzen) - FREE, NO API KEY
const TERRARIUM_ELEVATION = 'https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png';
const TERRARIUM_DECODER = {
    rScaler: 256,
    gScaler: 1,
    bScaler: 1/256,
    offset: -32768
};

// Free satellite imagery
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

let deckInstance = new Deck({
    canvas: document.getElementById('deck'),
    initialViewState: INITIAL_VIEW_STATE,
    layers: [terrain]
});
document.getElementById('loading').style.display = 'none';
