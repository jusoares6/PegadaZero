import { EMISSION_FACTORS as f } from '../data/emissionFactors.js';

export function calculateCarbonFootprint(habits) {
  const values = ['carKmPerWeek', 'electricityKwhPerMonth', 'meatMealsPerWeek', 'wasteKgPerWeek'];
  for (const key of values) {
    if (!Number.isFinite(habits[key]) || habits[key] < 0) throw new Error(`O campo ${key} deve ser um número maior ou igual a zero.`);
  }
  const breakdown = {
    transport: habits.carKmPerWeek * f.carKgCo2ePerKm * f.weeksPerMonth,
    electricity: habits.electricityKwhPerMonth * f.electricityKgCo2ePerKwh,
    food: habits.meatMealsPerWeek * f.meatKgCo2ePerMeal * f.weeksPerMonth,
    waste: habits.wasteKgPerWeek * f.wasteKgCo2ePerKg * f.weeksPerMonth
  };
  const totalKgCo2eMonth = Number(
    Object.values(breakdown)
      .reduce((sum, value) => sum + value, 0)
      .toFixed(2));
  return { breakdown, totalKgCo2eMonth };
}
