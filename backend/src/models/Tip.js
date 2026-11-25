
import mongoose from 'mongoose';

const tipSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: true
  },
  category: {
    type: String,
    default: 'Geral'
  },
  source: {
    type: String,
    default: ''
  },
  active: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });

export default mongoose.model('Tip', tipSchema);