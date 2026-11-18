import { CARBON_ZONES } from '../data/carbonZones.js';
const BASE_URL = 'https://api.electricitymaps.com/v3';
const REQUEST_TIMEOUT_MS = 6000;
const CACHE_LIVE_MS = 30 * 60 * 1000; 
const CACHE_FALLBACK_MS = 5 * 60 * 1000; 
const ZONES_CACHE_MS = 24 * 60 * 60 * 1000;

let cache = null;
let zonesCache = null;
let inflight = null;

export function clearHeatmapCache() {
  cache = null;
  zonesCache = null;
  inflight = null;
}

async function request(path) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const response = await fetch(`${BASE_URL}${path}`, {
      headers: { 'auth-token': process.env.ELECTRICITYMAPS_TOKEN },
      signal: controller.signal
    });
    if (!response.ok) throw new Error(`Electricity Maps respondeu HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timer);
  }
}

const allowsLatestCarbonIntensity = (access) =>
  access.some((item) => item === '*' || String(item).includes('carbon-intensity'));

async function getAccessibleZones() {
  if (zonesCache && zonesCache.expiresAt > Date.now()) return zonesCache.zones;

  const data = await request('/zones');
  const entries = Object.entries(data || {});
  const hasAccessInfo = entries.some(([, info]) => Array.isArray(info?.access));

  let zones = hasAccessInfo
    ? entries.filter(([, info]) => Array.isArray(info.access) && allowsLatestCarbonIntensity(info.access)).map(([code]) => code)
    : entries.map(([code]) => code);
  if (zones.length === 0) zones = null;

  zonesCache = { zones, expiresAt: Date.now() + ZONES_CACHE_MS };
  return zones;
}

async function buildHeatmapData() {
  const points = CARBON_ZONES.map((z) => ({
    zone: z.zone,
    name: z.name,
    lat: z.lat,
    lon: z.lon,
    intensity: z.referenceIntensity,
    source: 'reference',
    datetime: null
  }));
  let source = 'reference';

  if (process.env.ELECTRICITYMAPS_TOKEN) {
    try {
      const accessible = await getAccessibleZones();
      const targets = accessible ? points.filter((p) => accessible.includes(p.zone)) : points;

      const results = await Promise.allSettled(
        targets.map((p) => request(`/carbon-intensity/latest?zone=${encodeURIComponent(p.zone)}`))
      );

      let liveCount = 0;
      results.forEach((result, index) => {
        const value = result.status === 'fulfilled' ? result.value?.carbonIntensity : undefined;
        if (Number.isFinite(value)) {
          targets[index].intensity = Math.round(value);
          targets[index].source = 'api';
          targets[index].datetime = result.value.datetime || null;
          liveCount += 1;
        }
      });

      if (liveCount > 0) source = liveCount === points.length ? 'live' : 'partial';
    } catch (error) {
      console.warn('Electricity Maps indisponível, usando valores de referência:', error.message);
    }
  }

  const value = { source, updatedAt: new Date().toISOString(), zones: points };
  cache = {
    value,
    expiresAt: Date.now() + (source === 'reference' ? CACHE_FALLBACK_MS : CACHE_LIVE_MS)
  };
  return value;
}

export async function getHeatmapData() {
  if (cache && cache.expiresAt > Date.now()) return cache.value;
  if (!inflight) {
    inflight = buildHeatmapData().finally(() => {
      inflight = null;
    });
  }
  return inflight;
}
