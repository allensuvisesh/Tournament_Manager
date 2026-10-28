import React from "react";
import { LayoutDashboard, Users, CalendarDays, Trophy, Settings, CircleHelp } from "lucide-react";

const items = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "players", label: "Players", icon: Users },
  { id: "events", label: "Schedule", icon: CalendarDays }
];

export default function Sidebar({ page, setPage }) {
  return <aside className="sidebar">
    <div className="brand"><div className="brand-mark"><Trophy size={20}/></div><div><strong>TeamUp</strong><span>SPORTS MANAGEMENT</span></div></div>
    <div className="side-label">WORKSPACE</div>
    <nav>{items.map(item => {
      const Icon = item.icon;
      return <button key={item.id} className={`nav-item ${page === item.id ? "active" : ""}`} onClick={() => setPage(item.id)}><Icon size={18}/><span>{item.label}</span>{item.id === "events" && <span className="nav-dot"/>}</button>;
    })}</nav>
    <div className="sidebar-bottom">
      <div className="help-card"><div className="help-icon"><CircleHelp size={17}/></div><strong>Need a hand?</strong><p>Manage your squad like a pro.</p><button onClick={() => alert("Tip: Use Players to add athletes and Schedule to plan matches or training.")}>Quick tips <span>↗</span></button></div>
      <div className="profile"><div className="avatar">SC</div><div className="profile-info"><strong>Sports Club</strong><span>Team administrator</span></div><Settings size={17} className="muted-icon"/></div>
    </div>
  </aside>;
}
