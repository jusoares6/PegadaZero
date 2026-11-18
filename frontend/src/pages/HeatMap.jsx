import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import api from '../services/api';
import './HeatMap.css';

// Mapa base. Para um visual escuro (tema tecnológico), troque "light_all" por "dark_all".
const TILE_URL = 'https://tile.openstreetmap.org/{z}/{x}/{y}.png';

// Escala de cor em gCO2eq/kWh: verde (energia limpa) -> amarelo -> laranja -> vermelho (intensa)
const SCALE = [
  [0, '#2fbf71'],
  [150, '#9acd32'],
  [300, '#f4c430'],
  [500, '#f08a24'],
  [750, '#e5484d']
];

const STATUS_TEXT = {
  live: 'Dados em tempo quase real',
  partial: 'Parte dos dados em tempo quase real',
  reference: 'Exibindo valores de referência'
};

const hexToRgb = (hex) => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16));

function colorFor(value) {
  if (value <= SCALE[0][0]) return SCALE[0][1];
  for (let i = 1; i < SCALE.length; i += 1) {
    const [maxValue, maxColor] = SCALE[i];
    const [minValue, minColor] = SCALE[i - 1];
    if (value <= maxValue) {
      const t = (value - minValue) / (maxValue - minValue);
      const from = hexToRgb(minColor);
      const to = hexToRgb(maxColor);
      return `rgb(${from.map((c, k) => Math.round(c + (to[k] - c) * t)).join(',')})`;
    }
  }
  return SCALE[SCALE.length - 1][1];
}

function tooltipElement(zone) {
  const box = document.createElement('div');
  const title = document.createElement('strong');
  title.textContent = zone.name;
  const intensity = document.createElement('div');
  intensity.textContent = `${zone.intensity} gCO₂eq/kWh`;
  const origin = document.createElement('div');
  origin.textContent = zone.source === 'api' ? 'Dado em tempo quase real' : 'Valor de referência';
  box.append(title, intensity, origin);
  return box;
}

export default function HeatMap() {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const mapElement = useRef(null);

  useEffect(() => {
    api.get('/heatmap')
      .then((response) => setData(response.data))
      .catch((err) => setError(err.response?.data?.message || 'Não foi possível carregar o mapa.'));
  }, []);

  // Cria o mapa quando os dados chegam e o remove ao sair da página
  useEffect(() => {
    if (!data || !mapElement.current) return undefined;

    const map = L.map(mapElement.current, {
      center: [15, -30],
      zoom: 2,
      minZoom: 2,
      worldCopyJump: true,
      scrollWheelZoom: false
    });

    L.tileLayer(TILE_URL, {
      maxZoom: 19,
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
    }).addTo(map);

    data.zones.forEach((zone) => {
      const color = colorFor(zone.intensity);
      const position = [zone.lat, zone.lon];
      // dois halos suaves criam o efeito de "calor"
      L.circleMarker(position, { radius: 38, stroke: false, fillColor: color, fillOpacity: 0.14, interactive: false }).addTo(map);
      L.circleMarker(position, { radius: 22, stroke: false, fillColor: color, fillOpacity: 0.26, interactive: false }).addTo(map);
      L.circleMarker(position, { radius: 8, color, weight: 2, fillColor: color, fillOpacity: 0.95 })
        .bindTooltip(tooltipElement(zone), { direction: 'top', offset: [0, -6] })
        .addTo(map);
    });

    return () => map.remove();
  }, [data]);

  if (error) return <p className="error">{error}</p>;
  if (!data) return <p className="loading">Carregando mapa...</p>;

  const ranking = [...data.zones].sort((a, b) => a.intensity - b.intensity);
  const statusText = STATUS_TEXT[data.source] || STATUS_TEXT.reference;

  return (
    <section>
      <div className="page-heading">
        <div>
          <span className="eyebrow">MAPA DE CALOR</span>
          <h1>Intensidade de carbono da energia</h1>
          <p>Quanto CO₂ cada kWh de eletricidade emite em cada região. Quanto mais quente a cor, mais carbono a energia carrega.</p>
        </div>
      </div>

      <div className="heatmap-status">
        <span className="points-tag">{statusText}</span>
        <small className="heatmap-updated">Atualizado em {new Date(data.updatedAt).toLocaleString('pt-BR')}</small>
      </div>

      <div className="heatmap-layout">
        <div className="panel">
          <div ref={mapElement} className="heatmap-canvas" role="img" aria-label="Mapa-múndi com a intensidade de carbono da eletricidade por região" />
          <div className="heatmap-legend">
            <span>0</span>
            <div className="legend-bar" style={{ background: `linear-gradient(90deg, ${SCALE.map(([, c]) => c).join(',')})` }} />
            <span>750+ gCO₂eq/kWh</span>
          </div>
        </div>

        <aside className="panel heatmap-ranking">
          <div className="panel-heading">
            <div>
              <h2>Da mais limpa à mais intensa</h2>
              <p>Valores em gCO₂eq/kWh</p>
            </div>
          </div>
          <ol>
            {ranking.map((zone) => (
              <li key={zone.zone}>
                <span className="dot" style={{ background: colorFor(zone.intensity) }} />
                <span className="zone-name">{zone.name}</span>
                <strong>{zone.intensity}</strong>
              </li>
            ))}
          </ol>
          <p className="disclaimer">
            Fonte: Electricity Maps. Regiões sem dado em tempo quase real exibem um valor médio de referência.
            O mapa é apenas informativo e não entra no cálculo da sua pegada.
          </p>
        </aside>
      </div>
    </section>
  );
}