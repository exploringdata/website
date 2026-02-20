/**
 * worldbank-map.js
 *
 * Creates a self-contained, responsive choropleth map for any World Bank
 * indicator. Requires worldbank-map.css to be loaded in the page.
 *
 * Dependencies (must be loaded before this module):
 *   d3           https://cdn.jsdelivr.net/npm/d3@7/dist/d3.min.js
 *   topojson     https://cdn.jsdelivr.net/npm/topojson-client@3/dist/topojson-client.min.js
 *   Plot         https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/dist/plot.umd.min.js
 *
 * The topojson features must use ISO-3 alpha codes as their `id`.
 *
 * @param {HTMLElement} container
 * @param {object}  options
 * @param {string}  options.indicator           World Bank indicator code (required)
 * @param {string}  options.topoUrl             URL of the topojson file (required)
 * @param {string}  options.topoObject          Object name inside the topojson (required)
 * @param {string}  [options.title]             Header display name
 * @param {string}  [options.emoji]             Emoji shown before the title
 * @param {string}  [options.unit]              Unit label for legend and tooltips
 * @param {string}  [options.colorScheme]       d3 sequential scheme name. Default: 'Blues'
 * @param {boolean} [options.colorReverse]      Reverse the color ramp. Default: false
 * @param {string}  [options.initialYear]       Start on this year instead of the most recent
 * @param {number}  [options.animationInterval] ms per animation frame. Default: 800.
 *                                              Set to 0 to hide the play button entirely.
 * @param {number[]} [options.colorDomain]     Explicit [min, max] for the color scale.
 *                                              Overrides automatic domain calculation.
 * @param {string}  [options.ocean]            Ocean fill color. Overrides the theme default.
 * @param {number}  [options.clampPercentile]  Percentile (0–50) to clip from each end of
 *                                              the value distribution when computing the
 *                                              automatic domain. Default: 1. Ignored when
 *                                              colorDomain is set.
 */
export async function createMap(container, options) {
  const config = resolveConfig(options);

  applyTheme(container, buildTheme(config.colorScheme));
  if (config.ocean) container.style.setProperty('--wbm-ocean', config.ocean);

  const ui = buildUI(container, config);

  setStatus(ui.status, 'loading');

  let topoData, indicatorData;
  try {
    [topoData, indicatorData] = await Promise.all([
      fetch(config.topoUrl).then(r => r.json()),
      fetchIndicator(config.indicator),
    ]);
  } catch (err) {
    console.error('[worldbank-map]', err);
    setStatus(ui.status, 'error');
    ui.placeholder.textContent = 'Failed to load data — see console for details.';
    return;
  }

  const { dataByYearCountry, colorDomain, years } = indexData(indicatorData, config);

  populateYearSelect(ui.yearSelect, years, config.initialYear);

  setStatus(ui.status, 'ready');
  ui.placeholder.remove();
  if (config.animationInterval > 0) ui.playBtn.disabled = false;

  renderLegend(ui.legend, colorDomain, config);

  const { draw, resetZoom } = createRenderer(topoData, dataByYearCountry, colorDomain, ui.canvas, config);

  draw(ui.yearSelect.value);

  wireEvents(ui, years, draw, resetZoom, config);
}

// ── Config ────────────────────────────────────────────────────────────────────
function resolveConfig(options) {
  return {
    indicator:         options.indicator,
    topoUrl:           options.topoUrl,
    topoObject:        options.topoObject,
    title:             options.title             ?? options.indicator,
    emoji:             options.emoji             ?? '',
    unit:              options.unit              ?? '',
    colorScheme:       options.colorScheme       ?? 'Blues',
    colorReverse:      options.colorReverse      ?? false,
    initialYear:       options.initialYear       ?? null,
    animationInterval: options.animationInterval ?? 800,
    colorDomain:       options.colorDomain       ?? null,
    ocean:             options.ocean             ?? null,
    clampPercentile:   options.clampPercentile   ?? 1,
  };
}

// ── Theme ─────────────────────────────────────────────────────────────────────
const BASE_THEME = {
  loading: '#d29922',
  error:   '#f85149',
};

const SCHEME_THEMES = {
  Greens:  { bg: '#0d1117', surface: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#8b949e', accent: '#3fb950', accentDim: '#1a3d25', ocean: '#0d2233', graticule: '#1c2333' },
  Blues:   { bg: '#0d1117', surface: '#161b22', border: '#30363d', text: '#e6edf3', muted: '#8b949e', accent: '#58a6ff', accentDim: '#1a2d4a', ocean: '#0a1628', graticule: '#1c2333' },
  Oranges: { bg: '#110c07', surface: '#1c1208', border: '#3d2a14', text: '#f0e6d3', muted: '#a08060', accent: '#f0883e', accentDim: '#3d200a', ocean: '#1a1000', graticule: '#2a1e0e' },
  Purples: { bg: '#0d0a17', surface: '#16122a', border: '#30246d', text: '#e6e0f3', muted: '#8878ae', accent: '#bc8cff', accentDim: '#2d1a4a', ocean: '#110d1e', graticule: '#1e1833' },
  Reds:    { bg: '#110808', surface: '#1c1010', border: '#4a2020', text: '#f3e0e0', muted: '#a07070', accent: '#ff7b72', accentDim: '#4a1a1a', ocean: '#1a0a0a', graticule: '#2e1818' },
  YlOrRd:  { bg: '#110d00', surface: '#1c1600', border: '#3d2e00', text: '#f3ead0', muted: '#a09060', accent: '#ffa657', accentDim: '#3d2500', ocean: '#1a1200', graticule: '#2a2200' },
};

function buildTheme(scheme) {
  return { ...BASE_THEME, ...(SCHEME_THEMES[scheme] ?? SCHEME_THEMES.Blues) };
}

// Maps camelCase token names to their --wbm-* CSS custom property names
function applyTheme(container, theme) {
  const toKebab = s => s.replace(/[A-Z]/g, c => `-${c.toLowerCase()}`);
  Object.entries(theme).forEach(([k, v]) => {
    container.style.setProperty(`--wbm-${toKebab(k)}`, v);
  });
}

// ── DOM ───────────────────────────────────────────────────────────────────────
function buildUI(container, config) {
  container.classList.add('wbm');

  const header = el('header', 'wbm-header');

  const titleBlock = el('div');
  titleBlock.append(
    el('h1', 'wbm-title',    [config.emoji, config.title].filter(Boolean).join(' ')),
    el('p',  'wbm-subtitle', `${config.indicator} · ${config.unit}`),
  );

  const playBtn = el('button', 'wbm-play-btn', '▶');
  playBtn.disabled = true;
  playBtn.title    = 'Play animation';
  if (config.animationInterval === 0) playBtn.classList.add('hidden');

  const yearSelect = el('select', 'wbm-select');
  const status     = el('span',   'wbm-status', 'loading…');

  const controls = el('div', 'wbm-controls');
  controls.append(
    playBtn,
    el('label', 'wbm-label', 'YEAR'),
    yearSelect,
    status,
  );

  const legend = el('div', 'wbm-legend');

  header.append(titleBlock, controls, legend);

  const canvas      = el('div', 'wbm-canvas');
  const placeholder = el('div', 'wbm-placeholder', 'Fetching data…');
  canvas.appendChild(placeholder);

  container.append(header, canvas);

  return { playBtn, yearSelect, status, legend, canvas, placeholder };
}

function el(tag, className, textContent) {
  const node = document.createElement(tag);
  if (className)   node.className   = className;
  if (textContent) node.textContent = textContent;
  return node;
}

function setStatus(statusEl, state) {
  const labels = { loading: 'loading…', ready: 'ready', error: 'error' };
  statusEl.dataset.state = state;
  statusEl.textContent   = labels[state];
}

// ── Data ──────────────────────────────────────────────────────────────────────
async function fetchIndicator(indicator) {
  const base = `https://api.worldbank.org/v2/country/all/indicator/${indicator}`;
  const url  = page => `${base}?${new URLSearchParams({ format: 'json', per_page: 1000, page })}`;

  const [meta, firstPage] = await fetch(url(1)).then(r => r.json());

  const remaining = await Promise.all(
    Array.from({ length: meta.pages - 1 }, (_, i) =>
      fetch(url(i + 2)).then(r => r.json()).then(([, data]) => data)
    )
  );

  return [...firstPage, ...remaining.flat()]
    .filter(d => d.value !== null && d.countryiso3code);
}

function indexData(indicatorData, config) {
  const dataByYearCountry = d3.rollup(
    indicatorData,
    rows => rows[0].value,
    d    => d.date,
    d    => d.countryiso3code
  );

  const years = [...dataByYearCountry.keys()].sort((a, b) => b - a);

  // Use explicit domain if provided, otherwise clip percentile tails to
  // prevent outliers from compressing the rest of the color scale.
  const colorDomain = config.colorDomain ?? percentileDomain(indicatorData, config.clampPercentile);

  return { dataByYearCountry, colorDomain, years };
}

// Returns [low, high] after clipping p% from each end of the value distribution.
function percentileDomain(indicatorData, p) {
  const values = indicatorData.map(d => d.value).sort(d3.ascending);
  const lo     = d3.quantile(values, p / 100);
  const hi     = d3.quantile(values, 1 - p / 100);
  return [lo, hi];
}

function populateYearSelect(yearSelect, years, initialYear) {
  years.forEach(yr => {
    const opt = el('option', null, yr);
    opt.value = yr;
    yearSelect.appendChild(opt);
  });
  yearSelect.value = (initialYear && years.includes(String(initialYear)))
    ? String(initialYear)
    : years[0];
}

// ── Renderer ──────────────────────────────────────────────────────────────────
// Returns a draw(year) function and a resetZoom() function.
// Theme tokens are read once from the DOM at creation time — they never change.
// D3 zoom is set up once and reattached to the new SVG after every render.
// On resize, zoom is reset to identity so stale transforms don't carry over.
function createRenderer(topoData, dataByYearCountry, colorDomain, canvas, config) {
  const countries = topojson.feature(topoData, topoData.objects[config.topoObject]);

  // Read theme tokens once — these are stable for the lifetime of the map
  const style       = getComputedStyle(canvas);
  const token       = name => style.getPropertyValue(`--wbm-${name}`).trim();
  const oceanFill   = token('ocean');
  const graticule   = token('graticule');
  const strokeColor = token('bg');

  const colorScale = {
    type:    'sequential',
    scheme:  config.colorScheme,
    reverse: config.colorReverse,
    domain:  colorDomain,
    unknown: '#999999',
  };

  // D3 zoom — created once, reattached to each new SVG after every draw.
  // Plot renders each mark into its own top-level <g>, so we transform only
  // the direct <g> children of the SVG to avoid cascading the transform down
  // into nested elements.
  const zoom = d3.zoom()
    .scaleExtent([1, 12])
    .on('zoom', ({ transform }) => {
      const svg = canvas.querySelector('svg');
      if (svg) d3.select(svg).selectAll(':scope > g').attr('transform', transform);
    });

  function resetZoom() {
    const svg = canvas.querySelector('svg');
    if (svg) d3.select(svg).call(zoom.transform, d3.zoomIdentity);
  }

  function attachZoom(svg) {
    d3.select(svg)
      .call(zoom)
      // Disable the default dblclick-to-zoom so it doesn't fight with tooltips
      .on('dblclick.zoom', null);
  }

  function draw(year) {
    const yearMap = dataByYearCountry.get(year) ?? new Map();

    // Build a lookup for this frame rather than mutating shared feature properties
    const getValue = f => f.id ? (yearMap.get(f.id) ?? null) : null;

    const svg = Plot.plot({
      width:      canvas.clientWidth,
      height:     canvas.clientHeight,
      projection: { type: 'equal-earth', domain: { type: 'Sphere' } },
      color:      colorScale,
      style:      { background: 'transparent', overflow: 'visible' },
      marks: [
        Plot.sphere({ fill: oceanFill }),
        Plot.graticule({ stroke: graticule, strokeOpacity: 0.5, strokeWidth: 0.4 }),
        Plot.geo(countries, {
          fill:        f => getValue(f),
          stroke:      strokeColor,
          strokeWidth: 0.4,
          title: f => {
            const name     = f.id ?? 'Unknown';
            const value    = getValue(f);
            const valueStr = value !== null
              ? `${value.toFixed(1)}${config.unit ? '  ' + config.unit : ''}`
              : 'no data';
            return `${name}  ${valueStr}`;
          },
          tip: true,
        }),
        Plot.text([config.indicator], {
          frameAnchor: 'bottom',
          text:        d => `data.worldbank.org/indicator/${d}`,
          href:        d => `https://data.worldbank.org/indicator/${d}`,
          target:      '_blank',
          fill:        token('muted'),
          fontSize:    11,
          fontFamily:  style.getPropertyValue('--wbm-mono').trim(),
          dy:          -8,
        }),
      ],
    });

    canvas.querySelectorAll('svg').forEach(s => s.remove());
    canvas.appendChild(svg);
    attachZoom(svg);
  }

  return { draw, resetZoom };
}

function renderLegend(legendEl, colorDomain, config) {
  const cs = getComputedStyle(legendEl);
  legendEl.appendChild(Plot.legend({
    color: {
      type:    'sequential',
      scheme:  config.colorScheme,
      reverse: config.colorReverse,
      domain:  colorDomain,
      label:   config.unit,
      ticks:   5,
    },
    style: {
      background: 'transparent',
      color:      cs.getPropertyValue('--wbm-text').trim(),
      fontFamily: cs.getPropertyValue('--wbm-mono').trim(),
      fontSize:   '11px',
    },
  }));
}

// ── Events ────────────────────────────────────────────────────────────────────
function wireEvents(ui, years, draw, resetZoom, config) {
  const yearsAsc = [...years].reverse();
  let animTimer  = null;

  function step() {
    const next = yearsAsc[(yearsAsc.indexOf(ui.yearSelect.value) + 1) % yearsAsc.length];
    ui.yearSelect.value = next;
    draw(next);
  }

  function play() {
    animTimer              = setInterval(step, config.animationInterval);
    ui.playBtn.textContent = '⏸';
    ui.playBtn.title       = 'Pause animation';
  }

  function pause() {
    clearInterval(animTimer);
    animTimer              = null;
    ui.playBtn.textContent = '▶';
    ui.playBtn.title       = 'Play animation';
  }

  ui.playBtn.addEventListener('click',        () => animTimer ? pause() : play());
  ui.yearSelect.addEventListener('change',    () => draw(ui.yearSelect.value));
  ui.yearSelect.addEventListener('mousedown', () => { if (animTimer) pause(); });

  new ResizeObserver(([entry]) => {
    const { width, height } = entry.contentRect;
    if (width > 0 && height > 0) {
      resetZoom();          // clear stale transform before re-render
      draw(ui.yearSelect.value);
    }
  }).observe(ui.canvas);
}