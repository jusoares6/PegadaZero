import test, { beforeEach, afterEach } from 'node:test';
import assert from 'node:assert/strict';
import { getHeatmapData, clearHeatmapCache } from '../src/services/electricityMapsService.js';
import { CARBON_ZONES } from '../src/data/carbonZones.js';

const originalFetch = globalThis.fetch;
let calls;

const jsonResponse = (body, ok = true, status = 200) => ({ ok, status, json: async () => body });

function mockApi(routes) {
  calls = [];
  globalThis.fetch = async (url, options) => {
    calls.push({ url, options });
    const path = url.replace('https://api.electricitymaps.com/v3', '');
    const handler = routes[path];
    if (!handler) return jsonResponse({}, false, 403);
    return typeof handler === 'function' ? handler() : jsonResponse(handler);
  };
}

beforeEach(() => {
  clearHeatmapCache();
  process.env.ELECTRICITYMAPS_TOKEN = 'token-de-teste';
});
afterEach(() => {
  globalThis.fetch = originalFetch;
  delete process.env.ELECTRICITYMAPS_TOKEN;
});

test('sem token usa somente valores de referência e não chama a API', async () => {
  delete process.env.ELECTRICITYMAPS_TOKEN;
  mockApi({});
  const data = await getHeatmapData();
  assert.equal(data.source, 'reference');
  assert.equal(data.zones.length, CARBON_ZONES.length);
  assert.ok(data.zones.every((z) => z.source === 'reference'));
  assert.equal(calls.length, 0);
});

test('plano gratuito (1 zona): mistura dado real com referência e envia o header auth-token', async () => {
  mockApi({
    '/zones': { 'BR-CS': { zoneName: 'Central Brazil' } },
    '/carbon-intensity/latest?zone=BR-CS': { zone: 'BR-CS', carbonIntensity: 91.4, datetime: '2026-11-10T12:00:00.000Z' }
  });
  const data = await getHeatmapData();
  const cs = data.zones.find((z) => z.zone === 'BR-CS');

  assert.equal(data.source, 'partial');
  assert.equal(cs.source, 'api');
  assert.equal(cs.intensity, 91);
  assert.equal(data.zones.find((z) => z.zone === 'DE').source, 'reference');
  assert.ok(calls.every((c) => c.options.headers['auth-token'] === 'token-de-teste'));
  assert.equal(calls.length, 2); 
});

test('respeita o campo "access" quando a API informa permissões por zona', async () => {
  mockApi({
    '/zones': {
      'BR-CS': { access: ['*'] },
      DE: { access: ['power-breakdown/latest'] }
    },
    '/carbon-intensity/latest?zone=BR-CS': { carbonIntensity: 70 }
  });
  const data = await getHeatmapData();
  assert.equal(data.zones.find((z) => z.zone === 'BR-CS').source, 'api');
  assert.equal(data.zones.find((z) => z.zone === 'DE').source, 'reference');
  assert.ok(!calls.some((c) => c.url.includes('zone=DE')));
});

test('segunda chamada usa o cache e não consome a cota da API', async () => {
  mockApi({
    '/zones': { 'BR-CS': {} },
    '/carbon-intensity/latest?zone=BR-CS': { carbonIntensity: 80 }
  });
  await getHeatmapData();
  const antes = calls.length;
  await getHeatmapData();
  assert.equal(calls.length, antes);
});

test('chamadas simultâneas compartilham a mesma requisição (sem duplicar)', async () => {
  mockApi({
    '/zones': { 'BR-CS': {} },
    '/carbon-intensity/latest?zone=BR-CS': { carbonIntensity: 80 }
  });
  await Promise.all([getHeatmapData(), getHeatmapData(), getHeatmapData()]);
  assert.equal(calls.length, 2);
});

test('API fora do ar: mapa continua funcionando com referência', async () => {
  calls = [];
  globalThis.fetch = async () => { throw new Error('rede fora'); };
  const data = await getHeatmapData();
  assert.equal(data.source, 'reference');
  assert.equal(data.zones.length, CARBON_ZONES.length);
});

test('ignora valores inválidos devolvidos pela API', async () => {
  mockApi({
    '/zones': { 'BR-CS': {} },
    '/carbon-intensity/latest?zone=BR-CS': { carbonIntensity: 'abc' }
  });
  const data = await getHeatmapData();
  assert.equal(data.source, 'reference');
  assert.equal(data.zones.find((z) => z.zone === 'BR-CS').intensity, 70);
});
