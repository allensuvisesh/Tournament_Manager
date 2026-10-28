import React, { useMemo, useState } from "react";
import { CalendarDays, Plus, MapPin, Clock3, X, Swords } from "lucide-react";

const blank = { title: "", type: "Training", date: "", time: "16:00", location: "", opponent: "", notes: "" };
const prettyDate = date => new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { weekday: "short", day: "numeric", month: "short", year: "numeric" });

export default function Events({ events, onAdd }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(blank);
  const [filter, setFilter] = useState("All");
  const [error, setError] = useState("");
  const filtered = useMemo(() => [...events].filter(e => filter==="All" || e.type===filter).sort((a,b)=>a.date.localeCompare(b.date)), [events,filter]);
  const update = (key,value) => setForm(prev=>({...prev,[key]:value}));
  async function submit(e) {
    e.preventDefault(); setError("");
    try { await onAdd(form); setForm(blank); setShowForm(false); }
    catch(err) { setError(err.message || "Could not add event."); }
  }
  return <div className="page-content">
    <div className="page-title-row"><div><div className="eyebrow">PLAN AHEAD</div><h2>Schedule</h2><p>Organise training sessions, matches, and tournaments.</p></div><button className="primary-btn" onClick={()=>setShowForm(true)}><Plus size={17}/> Add event</button></div>
    <div className="filter-tabs">{["All","Match","Training","Tournament"].map(f=><button key={f} onClick={()=>setFilter(f)} className={filter===f?"selected":""}>{f}</button>)}</div>
    {showForm && <div className="modal-backdrop" onClick={()=>setShowForm(false)}><div className="form-modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><div><h3>Schedule an event</h3><p>Give your team something to prepare for.</p></div><button className="icon-btn" onClick={()=>setShowForm(false)}><X size={18}/></button></div>
      <form className="player-form" onSubmit={submit}>
        <label>Event title<input required value={form.title} onChange={e=>update("title",e.target.value)} placeholder="e.g. Friendly match"/></label>
        <div className="form-two"><label>Event type<select value={form.type} onChange={e=>update("type",e.target.value)}><option>Training</option><option>Match</option><option>Tournament</option></select></label><label>Date<input type="date" required value={form.date} onChange={e=>update("date",e.target.value)}/></label></div>
        <div className="form-two"><label>Time<input type="time" value={form.time} onChange={e=>update("time",e.target.value)}/></label><label>Location<input required value={form.location} onChange={e=>update("location",e.target.value)} placeholder="Ground or venue"/></label></div>
        {form.type==="Match" && <label>Opponent<input value={form.opponent} onChange={e=>update("opponent",e.target.value)} placeholder="Opposing team"/></label>}
        <label>Notes (optional)<textarea rows="2" value={form.notes} onChange={e=>update("notes",e.target.value)} placeholder="Equipment, instructions, or reminders"/></label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="outline-btn" onClick={()=>setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Save event</button></div>
      </form></div></div>}
    {filtered.length ? <div className="schedule-grid">{filtered.map((event,i)=><article className="schedule-card" key={event._id}><div className="schedule-card-top"><div className={`event-symbol ${event.type.toLowerCase()}`}>{event.type==="Match"?<Swords size={20}/>:<CalendarDays size={20}/>}</div><span className={`type-pill ${event.type.toLowerCase()}`}>{event.type}</span></div><h3>{event.title}</h3><div className="schedule-date">{prettyDate(event.date)}</div><div className="event-meta"><span><Clock3 size={15}/>{event.time || "16:00"}</span><span><MapPin size={15}/>{event.location}</span></div>{event.opponent && <div className="opponent-line">VS <strong>{event.opponent}</strong></div>}{event.notes && <p className="event-notes">{event.notes}</p>}</article>)}</div> : <div className="panel empty-state"><CalendarDays size={28}/><strong>No events in this category</strong><span>Add an event to start building your schedule.</span><button className="primary-btn" onClick={()=>setShowForm(true)}><Plus size={16}/> Add event</button></div>}
  </div>;
}
