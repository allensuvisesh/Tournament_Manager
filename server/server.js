import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import Player from "./models/Player.js";
import Event from "./models/Event.js";
import User from "./models/User.js";
import playersRouter from "./routes/players.js";
import eventsRouter from "./routes/events.js";
import announcementsRouter from "./routes/announcements.js";
import authRouter from "./routes/auth.js";
import { requireAuth, requireAdmin } from "./middleware/auth.js";

dotenv.config();
const app = express();
const PORT = process.env.PORT || 5000;
app.use(cors({ origin: process.env.CLIENT_ORIGIN || "http://localhost:5173" }));
app.use(express.json({ limit: '1mb' }));
globalThis.mongoConnected = false;
app.get("/api/health", (_req, res) => res.json({ status: "ok", database: globalThis.mongoConnected ? "MongoDB connected" : "MongoDB not connected — sign-in disabled" }));
app.use('/api/auth', authRouter);
app.use('/api', requireAuth);
app.use('/api/players', (req,res,next) => ['POST','PUT','PATCH','DELETE'].includes(req.method) ? requireAdmin(req,res,next) : next(), playersRouter);
app.use('/api/events', (req,res,next) => ['POST','PUT','PATCH','DELETE'].includes(req.method) ? requireAdmin(req,res,next) : next(), eventsRouter);
app.use('/api/announcements', requireAdmin, announcementsRouter);
app.get('/api/stats', async (_req,res,next) => { try { const [players,activePlayers,events,matches] = await Promise.all([Player.countDocuments(),Player.countDocuments({status:{$in:['Active','Available','Training']}}),Event.countDocuments(),Event.countDocuments({type:'Match'})]); res.json({players,activePlayers,events,matches}); } catch(err){next(err);} });
app.use((err,_req,res,_next)=>{ console.error(err); res.status(500).json({message:'Something went wrong on the server.'}); });
async function start(){
  if (!process.env.MONGODB_URI) { console.error('MONGODB_URI is missing. Add your MongoDB Atlas connection string to server/.env.'); }
  if (!process.env.JWT_SECRET || process.env.JWT_SECRET.length < 32) console.error('JWT_SECRET must be set to a long random secret in server/.env.');
  if (process.env.MONGODB_URI) {
    try {
      await mongoose.connect(process.env.MONGODB_URI, { serverSelectionTimeoutMS: 10000 });
      globalThis.mongoConnected = true; console.log('MongoDB Atlas connected.');
      if (process.env.ADMIN_EMAIL && process.env.ADMIN_PASSWORD && process.env.ADMIN_PASSWORD.length >= 8) {
        const email = process.env.ADMIN_EMAIL.trim().toLowerCase();
        let admin = await User.findOne({ email });
        if (!admin) { admin = await User.create({ name: process.env.ADMIN_NAME || 'Tournament Administrator', email, passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: 'admin' }); console.log(`Initial admin account created for ${email}. Change its password after first login.`); }
        else if (admin.role !== 'admin') { admin.role = 'admin'; await admin.save(); console.log(`Configured ${email} as administrator.`); }
      } else console.warn('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env to bootstrap the administrator account.');
    } catch (err) { globalThis.mongoConnected = false; console.error('MongoDB connection failed:', err.message); console.error('Check Atlas IP access list, database username/password, and MONGODB_URI. Authentication requires MongoDB.'); }
  }
  app.listen(PORT, () => console.log(`College Sports Tournament API running at http://localhost:${PORT}`));
}
start();
