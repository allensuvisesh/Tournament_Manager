import React from "react";

export default function StatCard({ title, value, subtitle, icon: Icon, tone }) {
  return <div className="stat-card"><div className={`stat-icon ${tone}`}><Icon size={20}/></div><div className="stat-copy"><span>{title}</span><strong>{value}</strong><small>{subtitle}</small></div></div>;
}
