---
title: Volcanoes of Planet Earth
description: A 3D globe showing a selection of volcanoes on planet earth.
template: empty-wide.html
created: 2024-09-24 01:32:02
image: /img/preview/volcanoes-globe.png
scripts:
- https://unpkg.com/d3@7
- https://unpkg.com/globe.gl@2
- /compiled/volcanoes-globe.js
---
<div id="vis"></div>
<div id="controls" class="fixed-top">
<button id="play-pause" type="button" class="btn btn-lg" title="Play or Pause Animation">⏯</button>
</div>

<div class="position-absolute top-0 end-0"><div id="info" class="bg-light m-3 opacity-75 p-2"></div></div>
