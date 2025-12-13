import { Link, useLocation } from 'react-router-dom';

function Navbar() {
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path ? 'active' : '';
  };

  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <Link to="/uas-big-data/">
          <h1>🦟 DBD Analytics</h1>
        </Link>
      </div>
      <ul className="navbar-menu">
        <li className={isActive('/uas-big-data/')}>
          <Link to="/uas-big-data/">Dashboard</Link>
        </li>
        <li className={isActive('/monthly')}>
          <Link to="/monthly">Data Bulanan</Link>
        </li>
        <li className={isActive('/visualizations')}>
          <Link to="/visualizations">Visualisasi</Link>
        </li>
        <li className={isActive('/regional')}>
          <Link to="/regional">Data Regional</Link>
        </li>
        <li className={isActive('/model')}>
          <Link to="/model">Info Model</Link>
        </li>
      </ul>
    </nav>
  );
}

export default Navbar;
