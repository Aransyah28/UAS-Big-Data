import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import MonthlyData from './pages/MonthlyData';
import Visualizations from './pages/Visualizations';
import RegionalData from './pages/RegionalData';
import ModelInfo from './pages/ModelInfo';
import './App.css';

function App() {
  return (
    <Router>
      <div className="app">
        <Navbar />
        <main className="main-content">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/monthly" element={<MonthlyData />} />
            <Route path="/visualizations" element={<Visualizations />} />
            <Route path="/regional" element={<RegionalData />} />
            <Route path="/model" element={<ModelInfo />} />
          </Routes>
        </main>
        <footer className="footer">
          <p>© 2023 DBD Analytics - Proyek UAS Big Data Semester 5</p>
        </footer>
      </div>
    </Router>
  );
}

export default App;
