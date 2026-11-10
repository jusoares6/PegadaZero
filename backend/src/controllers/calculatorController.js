import Calculation from '../models/Calculation.js';
import { calculateCarbonFootprint } from '../services/carbonCalculator.js';

export async function calculate(req, res) {
  try {
    const habits = {
      carKmPerWeek: Number(req.body.carKmPerWeek),
      electricityKwhPerMonth: Number(req.body.electricityKwhPerMonth),
      meatMealsPerWeek: Number(req.body.meatMealsPerWeek),
      wasteKgPerWeek: Number(req.body.wasteKgPerWeek)
    };
    if (Object.values(habits).some(value => !Number.isFinite(value) || value < 0)) return res.status(400).json({ message: 'Preencha todos os campos com números iguais ou maiores que zero.' });
    const result = calculateCarbonFootprint(habits);
    const calculation = await Calculation.create({ user: req.userId, habits, ...result });
    return res.status(201).json({ calculation });
  } catch (error) { return res.status(400).json({ message: error.message || 'Erro ao calcular a pegada.' }); }
}

export async function history(req, res) {
  const calculations = await Calculation.find({ user: req.userId }).sort({ createdAt: 1 }).select('totalKgCo2eMonth breakdown createdAt');
  return res.json({ calculations });
}
