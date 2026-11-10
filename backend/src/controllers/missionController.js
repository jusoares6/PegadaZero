import Mission from '../models/Mission.js';
import User from '../models/User.js';
import UserMission from '../models/UserMission.js';
export async function listMissions(req, res) {
  const missions = await Mission.find({ active: true }).lean();
  const completed = await UserMission.find({ user: req.userId }).select('mission').lean();
  const done = new Set(completed.map(item => String(item.mission)));
  res.json({ missions: missions.map(m => ({ ...m, completed: done.has(String(m._id)) })) });
}
export async function completeMission(req, res) {
  const mission = await Mission.findOne({ _id: req.params.id, active: true });
  if (!mission) return res.status(404).json({ message: 'Missão não encontrada.' });
  try {
    await UserMission.create({ user: req.userId, mission: mission.id });
    const user = await User.findByIdAndUpdate(req.userId, { $inc: { points: mission.points } }, { new: true });
    return res.json({ message: 'Missão concluída!', points: user.points });
  } catch (error) {
    if (error.code === 11000) return res.status(409).json({ message: 'Esta missão já foi concluída.' });
    throw error;
  }
}
