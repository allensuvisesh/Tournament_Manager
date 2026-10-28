import mongoose from 'mongoose';
const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, lowercase: true, unique: true, index: true },
  passwordHash: { type: String, required: true },
  role: { type: String, enum: ['admin', 'user'], default: 'user' },
  active: { type: Boolean, default: true }
}, { timestamps: true });
userSchema.set('toJSON', { transform: (_doc, ret) => { delete ret.passwordHash; delete ret.__v; return ret; } });
export default mongoose.model('User', userSchema);
