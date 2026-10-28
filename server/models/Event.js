import mongoose from 'mongoose';
const eventSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true },
  type: { type: String, enum: ['Match','Training','Tournament','Club event','Meeting','Other'], default: 'Training' },
  sport: { type: String, default: 'Football', trim: true },
  team: { type: String, default: '', trim: true },
  date: { type: String, required: true },
  time: { type: String, default: '16:00' },
  venue: { type: String, default: '', trim: true },
  location: { type: String, default: '', trim: true },
  opponent: { type: String, default: '' },
  status: { type: String, default: 'Scheduled' },
  notes: { type: String, default: '' }
}, { timestamps: true });
export default mongoose.model('Event', eventSchema);
