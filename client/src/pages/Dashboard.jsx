import React from "react";
import { Users, UserCheck, CalendarDays, Trophy, ArrowUpRight, MapPin, Clock3 } from "lucide-react";
import StatCard from "../components/StatCard.jsx";

const fmt = (date) => new Date(`${date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short" });

export default function Dashboard({ players, events, stats, setPage }) {
  const upcoming = [...events].sort((a,b) => a.date.localeCompare(b.date)).slice(0, 3);
  return <div className="page-content">
    <section className="welcome-banner">
      <div className="welcome-text"><div className="eyebrow"><span className="live-dot"/> TEAM OVERVIEW</div><h2>Great teams are built<br/>one day at a time.</h2><p>Keep your squad organised, prepared, and ready to perform.</p><button className="primary-btn" onClick={() => setPage("players")}>Manage your team <ArrowUpRight size={17}/></button></div>
      <div className="banner-art" aria-hidden="true"><div className="art-ring ring-one"/><div className="art-ring ring-two"/><div className="art-ball">✦</div><div className="art-number">01</div><div className="art-caption">PLAY AS ONE</div></div>
    </section>
    <div className="section-heading"><div><h3>Team at a glance</h3><p>Here’s what’s happening with your squad.</p></div><span className="updated-label">● Live overview</span></div>
    <div className="stats-grid">
      <StatCard title="Total players" value={stats.players ?? players.length} subtitle="Registered athletes" icon={Users} tone="purple"/>
      <StatCard title="Active players" value={stats.activePlayers ?? players.filter(p=>p.status==="Active").length} subtitle="Ready for selection" icon={UserCheck} tone="green"/>
      <StatCard title="Scheduled events" value={stats.events ?? events.length} subtitle="Matches & training" icon={CalendarDays} tone="orange"/>
      <StatCard title="Matches planned" value={stats.matches ?? events.filter(e=>e.type==="Match").length} subtitle="Upcoming fixtures" icon={Trophy} tone="blue"/>
    </div>
    <div className="dashboard-columns">
      <section className="panel upcoming-panel"><div className="panel-heading"><div><h3>Upcoming schedule</h3><p>Keep an eye on the next activities.</p></div><button className="text-btn" onClick={() => setPage("events")}>View schedule <ArrowUpRight size={15}/></button></div>
        {upcoming.length ? <div className="event-list">{upcoming.map(event => <div className="event-row" key={event._id}><div className="date-tile"><strong>{fmt(event.date).split(" ")[0]}</strong><span>{fmt(event.date).split(" ")[1]}</span></div><div className="event-info"><strong>{event.title}</strong><span><Clock3 size={13}/> {event.time || "16:00"} <i>·</i> <MapPin size={13}/> {event.location}</span></div><span className={`type-pill ${event.type.toLowerCase()}`}>{event.type}</span></div>)}</div> : <div className="empty-state">No events scheduled yet. Add one from Schedule.</div>}
      </section>
      <section className="panel squad-panel"><div className="panel-heading"><div><h3>Squad snapshot</h3><p>A quick look at your athletes.</p></div><button className="icon-btn" title="View players" onClick={() => setPage("players")}><ArrowUpRight size={17}/></button></div>
        <div className="mini-roster">{players.slice(0,4).map((player, i) => <div className="roster-row" key={player._id}><div className={`player-avatar color-${i%4}`}>{player.name.split(" ").map(n=>n[0]).slice(0,2).join("")}</div><div className="roster-name"><strong>{player.name}</strong><span>{player.position} · {player.sport}</span></div><span className={`status-dot ${player.status.toLowerCase()}`}/></div>)}</div>
        <button className="outline-btn full-width" onClick={() => setPage("players")}>View full roster <ArrowUpRight size={15}/></button>
      </section>
    </div>
    <div className="footer-note"><span>✦</span> Every practice brings the team one step closer.</div>
  </div>;
}
