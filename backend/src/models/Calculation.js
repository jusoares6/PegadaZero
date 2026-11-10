import mongoose from 'mongoose';

const calculationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
  habits: {
    carKmPerWeek: { type: Number, min: 0, required: true },
    electricityKwhPerMonth: { type: Number, min: 0, required: true },
    meatMealsPerWeek: { type: Number, min: 0, required: true },
    wasteKgPerWeek: { type: Number, min: 0, required: true }
  },
  breakdown: { transport: Number, electricity: Number, food: Number, waste: Number },
  totalKgCo2eMonth: { type: Number, required: true }
}, { timestamps: true });

export default mongoose.model('Calculation', calculationSchema);
