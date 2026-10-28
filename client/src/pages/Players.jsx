import React, { useMemo, useState } from "react";
import { Search, Plus, Trash2, Users, X } from "lucide-react";

const initialForm = { name: "", sport: "Football", position: "", age: "", jerseyNumber: "", status: "Active" };

export default function Players({ players, onAdd, onDelete }) {
  const [search, setSearch] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const filtered = useMemo(() => players.filter(p => `${p.name} ${p.sport} ${p.position}`.toLowerCase().includes(search.toLowerCase())), [players, search]);
  const update = (key, value) => setForm(prev => ({ ...prev, [key]: value }));
  async function submit(e) {
    e.preventDefault(); setError("");
    try {
      await onAdd({ ...form, age: Number(form.age), jerseyNumber: Number(form.jerseyNumber || 0) });
      setForm(initialForm); setShowForm(false);
    } catch (err) { setError(err.message || "Could not add player."); }
  }
  return <div className="page-content">
    <div className="page-title-row"><div><div className="eyebrow">YOUR ATHLETES</div><h2>Players</h2><p>Build your roster and keep player details up to date.</p></div><button className="primary-btn" onClick={() => setShowForm(true)}><Plus size={17}/> Add player</button></div>
    <div className="toolbar"><div className="search-box"><Search size={17}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search players, sports, positions..." /></div><span className="result-count">{filtered.length} player{filtered.length!==1?"s":""}</span></div>
    {showForm && <div className="modal-backdrop" onClick={() => setShowForm(false)}><div className="form-modal" onClick={e=>e.stopPropagation()}><div className="modal-heading"><div><h3>Add a player</h3><p>Enter the athlete’s basic details.</p></div><button className="icon-btn" onClick={() => setShowForm(false)}><X size={18}/></button></div>
      <form onSubmit={submit} className="player-form">
        <label>Full name<input required value={form.name} onChange={e=>update("name",e.target.value)} placeholder="e.g. Alex Johnson"/></label>
        <div className="form-two"><label>Sport<select value={form.sport} onChange={e=>update("sport",e.target.value)}><option>Football</option><option>Basketball</option><option>Cricket</option><option>Volleyball</option><option>Badminton</option><option>Hockey</option><option>Athletics</option><option>Other</option></select></label><label>Position<input required value={form.position} onChange={e=>update("position",e.target.value)} placeholder="e.g. Defender"/></label></div>
        <div className="form-two"><label>Age<input type="number" min="5" max="100" required value={form.age} onChange={e=>update("age",e.target.value)} placeholder="21"/></label><label>Jersey number<input type="number" min="0" value={form.jerseyNumber} onChange={e=>update("jerseyNumber",e.target.value)} placeholder="10"/></label></div>
        <label>Status<select value={form.status} onChange={e=>update("status",e.target.value)}><option>Active</option><option>Injured</option><option>Reserve</option></select></label>
        {error && <p className="form-error">{error}</p>}
        <div className="modal-actions"><button type="button" className="outline-btn" onClick={() => setShowForm(false)}>Cancel</button><button className="primary-btn" type="submit"><Plus size={16}/> Save player</button></div>
      </form></div></div>}
    <section className="panel roster-panel"><div className="table-wrap"><table><thead><tr><th>PLAYER</th><th>SPORT</th><th>POSITION</th><th>AGE</th><th>JERSEY</th><th>STATUS</th><th></th></tr></thead><tbody>
      {filtered.map((p,i)=><tr key={p._id}><td><div className="table-player"><div className={`player-avatar color-${i%4}`}>{p.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><strong>{p.name}</strong></div></td><td>{p.sport}</td><td>{p.position}</td><td>{p.age}</td><td><span className="jersey-number">#{p.jerseyNumber ?? 0}</span></td><td><span className={`status-label ${p.status.toLowerCase()}`}>{p.status}</span></td><td><button className="delete-btn" title="Remove player" onClick={()=>{if(window.confirm(`Remove ${p.name} from the roster?`)) onDelete(p._id)}}><Trash2 size={16}/></button></td></tr>)}
    </tbody></table>{filtered.length===0 && <div className="empty-state"><Users size={25}/><strong>No players found</strong><span>Try another search or add a new player.</span></div>}</div></section>
  </div>;
}
