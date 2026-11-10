import Tip from '../models/Tip.js';
export async function listTips(req, res) {
  const tips = await Tip.find({ active: true }).sort({ createdAt: -1 }).select('title content category createdAt');
  res.json({ tips });
}
