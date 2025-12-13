function StatCard({ title, value, subtitle, icon }) {
  return (
    <div className="stat-card">
      <div className="stat-icon">{icon}</div>
      <div className="stat-content">
        <h3 className="stat-title">{title}</h3>
        <p className="stat-value">{value}</p>
        {subtitle && <span className="stat-subtitle">{subtitle}</span>}
      </div>
    </div>
  );
}

export default StatCard;
