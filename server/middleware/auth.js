import jwt from 'jsonwebtoken';
import { createHash } from 'node:crypto';
import User from '../models/User.js';
import AuthSession from '../models/AuthSession.js';
export async function requireAuth(req, res, next) {
  try {
    const header = req.headers.authorization || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : '';
    if (!token) return res.status(401).json({ message: 'Please sign in to continue.' });
    if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) return res.status(503).json({ message: 'Server authentication is not configured. Set JWT_SECRET in server/.env.' });
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    if (!globalThis.mongoConnected) return res.status(503).json({ message: 'MongoDB is not connected. Connect MongoDB Atlas first.' });
    const tokenHash = createHash('sha256').update(token).digest('hex');
    const session = await AuthSession.findOne({ tokenHash, user: payload.sub, revokedAt: null, expiresAt: { $gt: new Date() } }).select('+tokenHash');
    if (!session) return res.status(401).json({ message: 'Your session has expired or been signed out. Please sign in again.' });
    const user = await User.findById(payload.sub).select('_id name email role active');
    if (!user || !user.active) return res.status(401).json({ message: 'This account is unavailable. Please contact the administrator.' });
    req.user = user; req.authSession = session; next();
  } catch (_err) { return res.status(401).json({ message: 'Your session expired or is invalid. Please sign in again.' }); }
}
export function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') return res.status(403).json({ message: 'Administrator access is required for this action.' });
  next();
}
