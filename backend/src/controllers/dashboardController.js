import Calculation from '../models/Calculation.js';
import User from '../models/User.js';
export async function summary(req, res) {
  const [latest, history, user] = await Promise.all([
    Calculation.findOne({ user: req.userId }).sort({ createdAt: -1 }),
    Calculation.find({ user: req.userId }).sort({ createdAt: 1 }).select('totalKgCo2eMonth createdAt'),
    User.findById(req.userId).select('name points')
  ]);
  res.json({ user, latest, history });
}
