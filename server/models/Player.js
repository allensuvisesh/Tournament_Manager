import mongoose from 'mongoose';
const playerSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  sport: { type: String, required: true, trim: true },
  position: { type: String, default: '', trim: true },
  team: { type: String, default: '', trim: true },
  age: { type: Number, min: 5, max: 100 },
  number: { type: Number, default: 0, min: 0, max: 999 },
  jerseyNumber: { type: Number, default: 0, min: 0, max: 999 },
  email: { type: String, default: '', trim: true },
  status: { type: String, enum: ['Available','Training','Unavailable','Active','Injured','Reserve'], default: 'Available' }
}, { timestamps: true });
export default mongoose.model('Player', playerSchema);
