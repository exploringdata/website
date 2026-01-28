---
title: 'Elevation Diary: Nerja'
created: 2026-01-28 02:10:49
description: description
scripts:
- https://unpkg.com/deck.gl@9.0.16/dist.min.js
- /compiled/map/elevation-diary-nerja.js
styles: [/css/elevation-diary-nerja.css]
template: empty-wide.html
---
<div id="container">
    <canvas id="deck"></canvas>
    <div id="loading">Loading deck.gl...</div>
</div>

## Prompt

I have 483 photos with geo location and altitude information from my recent travel to Nerja in Spain. Come up with interesting ways to visualize the data from the photos. Create a short list of ideas. Keep the small size of the dataset in mind.

Below is a sample from the dataset:

filename,latitude,longitude,altitude,timestamp
IMG_20260106_132810881,36.78705,-3.883663888888889,197.6,2026:01:06 13:28:12
IMG_20260113_162920940,36.757866666666665,-3.8864527777777775,135.9,2026:01:13 16:29:22
IMG_20260108_140227340,36.77321666666666,-3.868297222222222,450.5,2026:01:08 14:02:29
IMG_20260113_161241102,36.75533611111111,-3.8927638888888887,100.0,2026:01:13 16:12:43
IMG_20260110_132318945,36.76155,-3.8540305555555556,170.7,2026:01:10 13:23:20
IMG_20260113_133230431,36.78195,-3.8938555555555556,221.4,2026:01:13 13:32:32
IMG_20260113_160339088,36.75836944444445,-3.891913888888889,132.6,2026:01:13 16:03:42
IMG_20260106_121008276,36.763125,-3.8771166666666668,107.4,2026:01:06 12:10:10
IMG_20260105_125532101,36.74216944444444,-3.887102777777778,54.4,2026:01:05 12:55:33
IMG_20260110_142217936,36.769866666666665,-3.853711111111111,258.0,2026:01:10 14:22:20

## Ideas

### Map-Based Visualizations

**3D Elevation Journey Map** - Plot your photos on a topographic map where each point's height represents the altitude at which it was taken. This would beautifully show your journey from sea level beaches up to the mountains around Nerja, creating a 3D landscape of your travels.

**Heat Map of Photo Density** - Show where you spent the most time photographing, revealing your favorite spots. The Balcón de Europa and Nerja Caves would likely glow bright.

**Temporal Trail Animation** - Animate your journey chronologically, watching a line snake through Nerja's streets and coastline as timestamps progress, with altitude creating a rising/falling effect.

### Altitude-Focused Views

**Altitude Timeline** - A line graph showing elevation changes throughout your trip. You'd see dramatic peaks when hiking, valleys at beaches, and plateaus when exploring the town.

**Altitude Distribution Histogram** - Discover what elevation band you favored most. Did you spend more time at sea level or exploring hillside vantage points?

**Sunrise/Sunset Altitude Correlation** - Plot photos taken during golden hours against their elevations to see if you climbed for sunrise/sunset views.

### Creative/Artistic Approaches

**Photo Mosaic by Elevation** - Arrange thumbnail photos in vertical bands by altitude, creating a gradient from lowest (beaches) to highest (mountain views).

**Clustering Analysis** - Identify distinct "zones" where you spent time based on geographic clustering - perhaps beach area, old town, caves, mountain viewpoints.

**Day-by-Day Comparison** - Small multiples showing each day's geographic coverage and altitude range on separate mini-maps.

## 3D Elevation Journey Map 1

### Core Concept

Imagine a 3D landscape where the base is a satellite/street map of Nerja, and rising from it are vertical "pins" or markers representing each photo location. The height of each pin corresponds to the actual altitude where the photo was taken. Your journey would appear as a flowing path connecting these points, creating a roller-coaster-like trail through the landscape.

### Visual Elements

**The Markers** - Each photo location could be represented as:

- Glowing spheres or pins with size/color varying by time of day
- Thumbnail previews of the actual photos hovering at their true altitudes
- Color gradients showing progression through your trip (start in blue → end in orange)

**The Path** - A continuous line or tube connecting photos chronologically:

- Creates a 3D trajectory showing your physical journey
- Thickness could indicate time spent at each location
- Segments could pulse or animate to show direction of travel

**The Terrain** - The base map would show:

- Streets and coastline of Nerja for orientation
- Actual topographic data could be layered beneath to show real terrain
- The Mediterranean Sea as a flat blue plane at altitude 0

### Interactive Features

- **Rotate and zoom** to view from any angle
- **Click markers** to see the photo and metadata
- **Time slider** to watch your journey unfold day by day
- **Altitude filter** to isolate high/low elevation photos
- **Fly-through animation** following your path in sequence

### What It Would Reveal

You'd instantly see patterns like:

- Dramatic altitude spikes when you visited the Nerja Caves or hiked Sierra Almijara
- Clusters of sea-level photos along the beaches
- The vertical geography of the town itself
- Which viewpoints you returned to multiple times

## 3D Elevation Journey Map 2

The **3D terrain visualization** would create an immersive view of your Nerja trip by combining actual topographic data with your photo locations. Here's how it would work:

**Core Concept**

- Start with a 3D model of Nerja's landscape - hills, valleys, coastline - using elevation data from sources like OpenStreetMap or NASA's terrain datasets
- Place markers at the exact lat/long coordinates where you took each photo
- "Lift" these markers to their recorded altitudes so they sit properly on the terrain surface

**Visual Elements**

- **Terrain mesh**: The landscape itself, textured to show geography (green for vegetation, tan for cliffs, blue for sea)
- **Photo markers**: Small pins, spheres, or thumbnails positioned in 3D space at each photo location
- **Height variation**: Since your photos range from ~54m (beach level) to 450m (hilltop views), the vertical spread would clearly show your elevation changes

**Interactive Features**

- Rotate and tilt the view to see Nerja from different angles
- Zoom in to see clusters of photos at specific viewpoints
- Click markers to see the actual photo or metadata
- Optional: Connect photos chronologically with a 3D path line showing your route through the terrain

**Why It Works for Your Dataset**
With 483 points spread across elevations from sea level to 450m, you'd see clear patterns - likely clusters along the coast, scattered points on hillside walks, and perhaps a concentration at popular viewpoints. The 3D perspective makes altitude differences immediately intuitive in a way flat maps can't.