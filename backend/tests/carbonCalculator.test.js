import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateCarbonFootprint } from '../src/services/carbonCalculator.js';

test('calcula o total mensal usando os fatores internos', () => {
  const result = calculateCarbonFootprint({ carKmPerWeek: 10, electricityKwhPerMonth: 100, meatMealsPerWeek: 2, wasteKgPerWeek: 1 });
  assert.equal(result.totalKgCo2eMonth, 39.64);
}); 

test('rejeita valores negativos', () => {
  assert.throws(() => calculateCarbonFootprint({ carKmPerWeek: -1, electricityKwhPerMonth: 0, meatMealsPerWeek: 0, wasteKgPerWeek: 0 }));
});
