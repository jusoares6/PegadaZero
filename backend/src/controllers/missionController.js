
import Mission from '../models/Mission.js';
import User from '../models/User.js';
import UserMission from '../models/UserMission.js';
import { getOrCreateWeeklyMission } from '../services/weeklyMissionService.js';

export async function listMissions(req, res) {
  const weeklyMission = await getOrCreateWeeklyMission();

  const missions = await Mission.find({
    _id: { $in: weeklyMission.missions },
    active: true
  }).lean();

  const completed = await UserMission.find({
    user: req.userId,
    weeklyMission: weeklyMission._id
  }).select('mission').lean();

  const done = new Set(
    completed.map(item => String(item.mission))
  );

  const orderedMissions = weeklyMission.missions
    .map(id => missions.find(mission => String(mission._id) === String(id)))
    .filter(Boolean);

  res.json({
    weekStart: weeklyMission.weekStart,
    weekEnd: weeklyMission.weekEnd,
    missions: orderedMissions.map(mission => ({
      ...mission,
      completed: done.has(String(mission._id))
    }))
  });
}

export async function completeMission(req, res) {
  const weeklyMission = await getOrCreateWeeklyMission();

  const missionIsAvailable = weeklyMission.missions.some(
    id => String(id) === String(req.params.id)
  );

  if (!missionIsAvailable) {
    return res.status(404).json({
      message: 'Missão não encontrada nesta semana.'
    });
  }

  const mission = await Mission.findOne({
    _id: req.params.id,
    active: true
  });

  if (!mission) {
    return res.status(404).json({
      message: 'Missão não encontrada.'
    });
  }

  try {
    await UserMission.create({
      user: req.userId,
      mission: mission._id,
      weeklyMission: weeklyMission._id
    });

    const user = await User.findByIdAndUpdate(
      req.userId,
      { $inc: { points: mission.points } },
      { new: true }
    );

    return res.json({
      message: 'Missão concluída!',
      points: user.points
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        message: 'Esta missão já foi concluída nesta semana.'
      });
    }

    throw error;
  }
}