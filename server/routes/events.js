import express from 'express';
import Event from '../models/Event.js';
const router=express.Router();
let demoEvents=[
 {_id:'demo-e1',title:'First Team vs Riverside FC',type:'Match',sport:'Football',date:'2026-10-31',time:'16:00',venue:'Main Ground',location:'Main Ground',status:'Scheduled'},
 {_id:'demo-e2',title:'Senior XI nets',type:'Training',sport:'Cricket',date:'2026-11-01',time:'09:00',venue:'Practice Nets',location:'Practice Nets',status:'Scheduled'},
 {_id:'demo-e3',title:'Women’s First Team vs City Hoops',type:'Match',sport:'Basketball',date:'2026-11-02',time:'18:30',venue:'Indoor Court',location:'Indoor Court',status:'Scheduled'}
];
const isDemo=()=>!globalThis.mongoConnected;
router.get('/',async(_req,res,next)=>{try{res.json(isDemo()?demoEvents:await Event.find().sort({date:1,time:1}));}catch(err){next(err);}});
router.post('/',async(req,res,next)=>{try{
 const {title,type='Training',sport='Football',team='',date,time='16:00',venue='',location='',opponent='',notes='',status='Scheduled'}=req.body;
 const place=String(venue||location||'').trim();
 if(!title?.trim()||!date)return res.status(400).json({message:'Event title and date are required.'});
 const data={title:title.trim(),type,sport,team:String(team||'').trim(),date,time:time||'16:00',venue:place,location:place,opponent,notes,status};
 const event=isDemo()?{_id:`demo-${Date.now()}`,...data}:await Event.create(data);
 if(isDemo())demoEvents=[...demoEvents,event].sort((a,b)=>a.date.localeCompare(b.date));res.status(201).json(event);
 }catch(err){next(err);}});
router.delete('/:id',async(req,res,next)=>{try{if(isDemo()){demoEvents=demoEvents.filter(e=>e._id!==req.params.id);return res.json({message:'Event removed.'});}const deleted=await Event.findByIdAndDelete(req.params.id);if(!deleted)return res.status(404).json({message:'Event not found.'});res.json({message:'Event removed.'});}catch(err){next(err);}});
export default router;
