
import mongoose from 'mongoose';

const weeklyMissionSchema = new mongoose.Schema({
  weekStart: {
    type: Date,
    required: true,
    unique: true
  },
  weekEnd: {
    type: Date,
    required: true
  },
  missions: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Mission',
    required: true
  }]
}, { timestamps: true });

export default mongoose.model('WeeklyMission', weeklyMissionSchema);