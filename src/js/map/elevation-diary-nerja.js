const {Deck} = deck;
const {ScatterplotLayer} = deck;
const {TerrainLayer} = deck;
const {CSVLoader} = loaders;

const MAX_ZOOM = 15;
const RADIUS = 20;
const CURRENT_PHOTO_RADIUS = 40;

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

// Journey state
let allPhotos = [];
let currentPhotoIndex = 0;
let isPlaying = false;
let playInterval = null;

// Load and sort photos by timestamp
async function loadPhotos() {
    const response = await fetch('/csv/nerja-dataset-gps.csv');
    const csvText = await response.text();
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    allPhotos = lines.slice(1).map(line => {
        const values = line.split(',');
        return {
            filename: values[0],
            latitude: parseFloat(values[1]),
            longitude: parseFloat(values[2]),
            altitude: parseFloat(values[3]),
            timestamp: values[4]
        };
    });

    // Sort by timestamp
    allPhotos.sort((a, b) => a.timestamp.localeCompare(b.timestamp));

    document.getElementById('total-photos').textContent = allPhotos.length;
    updateDisplay();
}

// Create scatterplot layers
function createPhotoLayers() {
    const visitedPhotos = allPhotos.slice(0, currentPhotoIndex);
    const currentPhoto = allPhotos[currentPhotoIndex];

    const layers = [terrain];

    // Visited photos (dimmed)
    if (visitedPhotos.length > 0) {
        layers.push(new ScatterplotLayer({
            id: 'visited-photos',
            data: visitedPhotos,
            getPosition: d => [d.longitude, d.latitude, d.altitude],
            getFillColor: [150, 150, 150, 150],
            getRadius: RADIUS,
            pickable: false
        }));
    }

    // Current photo (highlighted)
    if (currentPhoto) {
        layers.push(new ScatterplotLayer({
            id: 'current-photo',
            data: [currentPhoto],
            getPosition: d => [d.longitude, d.latitude, d.altitude],
            getFillColor: [255, 140, 0, 255],
            getRadius: CURRENT_PHOTO_RADIUS,
            pickable: true,
            onClick: info => console.log(info.object)
        }));
    }

    return layers;
}

// Update display and camera
function updateDisplay() {
    if (allPhotos.length === 0) return;

    const currentPhoto = allPhotos[currentPhotoIndex];

    // Update UI
    document.getElementById('current-photo').textContent = currentPhotoIndex + 1;
    document.getElementById('timestamp').textContent = currentPhoto.timestamp;
    document.getElementById('altitude').textContent = Math.round(currentPhoto.altitude);
    document.getElementById('photo-preview').setAttribute('src', `/img/nerja-dataset/${currentPhoto.filename}.wim.jpg`);

    // Update progress bar
    const progress = ((currentPhotoIndex + 1) / allPhotos.length) * 100;
    document.getElementById('progress-bar').style.width = progress + '%';

    // Update layers
    deckInstance.setProps({
        layers: createPhotoLayers()
    });

    // Fly to current photo
    deckInstance.setProps({
        initialViewState: {
            longitude: currentPhoto.longitude,
            latitude: currentPhoto.latitude,
            zoom: 16,
            bearing: 180,
            pitch: 60,
            transitionDuration: 2000,
            transitionInterpolator: new deck.FlyToInterpolator()
        }
    });
}

// Navigation functions
function nextPhoto() {
    if (currentPhotoIndex < allPhotos.length - 1) {
        currentPhotoIndex++;
        updateDisplay();
    } else {
        pause();
    }
}

function previousPhoto() {
    if (currentPhotoIndex > 0) {
        currentPhotoIndex--;
        updateDisplay();
    }
}

function play() {
    if (currentPhotoIndex >= allPhotos.length - 1) {
        currentPhotoIndex = 0;
    }
    isPlaying = true;
    document.getElementById('play-btn').textContent = '⏸ Pause';
    playInterval = setInterval(nextPhoto, 3000); // 3 seconds per photo
}

function pause() {
    isPlaying = false;
    document.getElementById('play-btn').textContent = '▶ Play';
    if (playInterval) {
        clearInterval(playInterval);
        playInterval = null;
    }
}

function togglePlay() {
    if (isPlaying) {
        pause();
    } else {
        play();
    }
}

// Initialize deck
let deckInstance = new Deck({
    canvas: document.getElementById('deck'),
    initialViewState: INITIAL_VIEW_STATE,
    controller: true,
    layers: [terrain]
});

// Set up event listeners
document.getElementById('play-btn').addEventListener('click', togglePlay);
document.getElementById('prev-btn').addEventListener('click', previousPhoto);
document.getElementById('next-btn').addEventListener('click', nextPhoto);

// Load photos and start
loadPhotos().then(() => {
    document.getElementById('loading').style.display = 'none';
    document.getElementById('controls').style.display = 'flex';
});