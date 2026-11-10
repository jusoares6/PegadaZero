import mongoose from 'mongoose';
const missionSchema = new mongoose.Schema({
  title: { type: String, required: true }, description: { type: String, required: true },
  points: { type: Number, required: true, min: 1 }, active: { type: Boolean, default: true }
}, { timestamps: true });
export default mongoose.model('Mission', missionSchema);
