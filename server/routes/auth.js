import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import User from '../models/User.js';
import AuthSession from '../models/AuthSession.js';
import { requireAuth } from '../middleware/auth.js';
const router = express.Router();
async function createLoginSession(user) { if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) throw new Error('JWT_SECRET is missing or too short. Configure server/.env.'); const token = jwt.sign({ sub: user._id.toString(), role: user.role }, process.env.JWT_SECRET, { expiresIn: '8h' }); const tokenHash = createHash('sha256').update(token).digest('hex'); await AuthSession.create({ user: user._id, tokenHash, expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000) }); return token; }
function publicUser(user) { return { id: user._id, name: user.name, email: user.email, role: user.role }; }
router.post('/register', async (req, res, next) => { try {
  if (!globalThis.mongoConnected) return res.status(503).json({ message: 'MongoDB Atlas is not connected. Configure server/.env and restart the server.' });
  const name = String(req.body.name || '').trim(), email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
  if (!name || !email || !/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ message: 'Enter your name and a valid email address.' });
  if (password.length < 8) return res.status(400).json({ message: 'Password must be at least 8 characters.' });
  if (await User.exists({ email })) return res.status(409).json({ message: 'An account with this email already exists.' });
  const user = await User.create({ name, email, passwordHash: await bcrypt.hash(password, 12), role: 'user' });
  const token = await createLoginSession(user); res.status(201).json({ token, user: publicUser(user) });
} catch (err) { if (err.code === 11000) return res.status(409).json({ message: 'An account with this email already exists.' }); next(err); } });
router.post('/login', async (req, res, next) => { try {
  if (!globalThis.mongoConnected) return res.status(503).json({ message: 'MongoDB Atlas is not connected. Configure server/.env and restart the server.' });
  const email = String(req.body.email || '').trim().toLowerCase(), password = String(req.body.password || '');
  const user = await User.findOne({ email });
  if (!user || !user.active || !(await bcrypt.compare(password, user.passwordHash))) return res.status(401).json({ message: 'Incorrect email or password.' });
  const token = await createLoginSession(user); res.json({ token, user: publicUser(user) });
} catch (err) { next(err); } });
router.get('/me', requireAuth, (req, res) => res.json({ user: publicUser(req.user) }));
router.post('/logout', requireAuth, async (req, res, next) => { try { req.authSession.revokedAt = new Date(); await req.authSession.save(); res.json({ message: 'Signed out successfully.' }); } catch (err) { next(err); } });
export default router;
