import cron from 'node-cron';
import { getOrCreateWeeklyMission } from './weeklyMissionService.js';

export function startWeeklyMissionScheduler() {
  cron.schedule(
    '0 0 * * 1',
    async () => {
      try {
        const weeklyMission = await getOrCreateWeeklyMission();

        console.log(
          'Missões semanais verificadas:',
          weeklyMission.weekStart
        );
      } catch (error) {
        console.error(
          'Erro ao verificar as missões semanais:',
          error
        );
      }
    },
    {
      timezone: 'America/Sao_Paulo'
    }
  );

  console.log('Agendador de missões semanais iniciado.');
}
