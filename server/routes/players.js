import express from 'express';
import Player from '../models/Player.js';
const router = express.Router();
let demoPlayers = [
  { _id:'demo-p1', name:'Aarav Menon', sport:'Football', position:'Midfielder', team:'First Team', number:8, status:'Available' },
  { _id:'demo-p2', name:'Maya Iyer', sport:'Basketball', position:'Point Guard', team:'Women’s First Team', number:4, status:'Available' },
  { _id:'demo-p3', name:'Rohan Nair', sport:'Cricket', position:'All-rounder', team:'Senior XI', number:17, status:'Training' },
  { _id:'demo-p4', name:'Ananya Rao', sport:'Football', position:'Defender', team:'First Team', number:3, status:'Unavailable' }
];
const isDemo=()=>!globalThis.mongoConnected;
router.get('/',async(_req,res,next)=>{try{res.json(isDemo()?demoPlayers:await Player.find().sort({createdAt:-1}));}catch(err){next(err);}});
router.post('/',async(req,res,next)=>{try{
 const {name,sport,position='',team='',age,number,jerseyNumber,email='',status='Available'}=req.body;
 if(!name?.trim()||!sport?.trim())return res.status(400).json({message:'Player name and sport are required.'});
 const data={name:name.trim(),sport:sport.trim(),position:String(position||'').trim(),team:String(team||'').trim(),number:Number(number??jerseyNumber??0),jerseyNumber:Number(number??jerseyNumber??0),email:String(email||'').trim(),status:status||'Available'};
 if(age!==undefined&&age!=='')data.age=Number(age);
 const player=isDemo()?{_id:`demo-${Date.now()}`,...data,createdAt:new Date().toISOString()}:await Player.create(data);
 if(isDemo())demoPlayers=[player,...demoPlayers];res.status(201).json(player);
 }catch(err){next(err);}});
router.delete('/:id',async(req,res,next)=>{try{if(isDemo()){demoPlayers=demoPlayers.filter(p=>p._id!==req.params.id);return res.json({message:'Player removed.'});}const deleted=await Player.findByIdAndDelete(req.params.id);if(!deleted)return res.status(404).json({message:'Player not found.'});res.json({message:'Player removed.'});}catch(err){next(err);}});
export default router;
