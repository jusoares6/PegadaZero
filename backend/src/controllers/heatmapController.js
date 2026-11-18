import { getHeatmapData } from '../services/electricityMapsService.js';

export async function heatmap(req, res) {
  const data = await getHeatmapData();
  res.json(data);
}