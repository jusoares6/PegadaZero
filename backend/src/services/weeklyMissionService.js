
import WeeklyMission from '../models/WeeklyMission.js';
import Mission from '../models/Mission.js';

const TIME_ZONE = 'America/Sao_Paulo';

function getSaoPauloDateParts(date = new Date()) {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIME_ZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }).formatToParts(date);

  return Object.fromEntries(
    parts
      .filter(part => part.type !== 'literal')
      .map(part => [part.type, Number(part.value)])
  );
}

function getWeekPeriod(date = new Date()) {
  const { year, month, day } = getSaoPauloDateParts(date);

  const localDate = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = localDate.getUTCDay();

  const daysSinceMonday = (dayOfWeek + 6) % 7;

  localDate.setUTCDate(localDate.getUTCDate() - daysSinceMonday);

  const weekStartDate = localDate.toISOString().slice(0, 10);

  localDate.setUTCDate(localDate.getUTCDate() + 7);

  const weekEndDate = localDate.toISOString().slice(0, 10);

  return {
    weekStart: new Date(`${weekStartDate}T03:00:00.000Z`),
    weekEnd: new Date(`${weekEndDate}T03:00:00.000Z`)
  };
}

export async function getOrCreateWeeklyMission() {
  const { weekStart, weekEnd } = getWeekPeriod();

  let weeklyMission = await WeeklyMission.findOne({ weekStart });

  if (weeklyMission) {
    return weeklyMission;
  }

  const availableMissions = await Mission.find({ active: true });

  if (availableMissions.length < 3) {
    throw new Error('É necessário ter pelo menos 3 missões ativas.');
  }

  const selectedMissions = availableMissions
    .sort(() => Math.random() - 0.5)
    .slice(0, 3)
    .map(mission => mission._id);

  try {
    weeklyMission = await WeeklyMission.create({
      weekStart,
      weekEnd,
      missions: selectedMissions
    });

    return weeklyMission;
  } catch (error) {
    if (error.code === 11000) {
      return WeeklyMission.findOne({ weekStart });
    }

    throw error;
  }
}