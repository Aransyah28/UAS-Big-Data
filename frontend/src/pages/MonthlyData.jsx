import { useState, useEffect } from 'react';
import { getMonthlyResults, getAvailableYears } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';



function MonthlyData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [availableYears, setAvailableYears] = useState([]);
  const [selectedYear, setSelectedYear] = useState(null);

  useEffect(() => {
    const fetchYears = async () => {
      try {
        const yearsData = await getAvailableYears();
        setAvailableYears(yearsData.years);
        setSelectedYear(yearsData.default);
      } catch (err) {
        console.error('Error fetching years:', err);
        setSelectedYear(2024);
      }
    };
    fetchYears();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      if (!selectedYear) return;
      
      try {
        setLoading(true);
        const result = await getMonthlyResults(selectedYear);
        setData(result);
      } catch (err) {
        setError('Gagal memuat data bulanan. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="monthly-data">
      <h2 className="page-title">Data Hasil ML Bulanan</h2>
      <p className="page-subtitle">
        Detail analisis faktor-faktor yang mempengaruhi kasus DBD untuk setiap bulan (Tahun {selectedYear})
      </p>

      <div className="year-selector" style={{ marginBottom: '1rem' }}>
        <label htmlFor="year-select" style={{ marginRight: '0.5rem', fontWeight: 'bold' }}>
          Pilih Tahun:
        </label>
        <select
          id="year-select"
          value={selectedYear || ''}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          style={{ padding: '0.5rem', fontSize: '1rem', borderRadius: '4px', border: '1px solid #ccc' }}
        >
          {availableYears.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>Bulan</th>
              <th>Total Kasus</th>
              <th>Faktor Dominan</th>
              <th>Importance</th>
              <th>Akurasi</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.month}>
                <td>{item.month} {item.year}</td>
                <td>{item.total_cases.toLocaleString()}</td>
                <td>
                  <span className="factor-badge">{item.most_influential_factor}</span>
                </td>
                <td>
                  <div className="progress-bar">
                    <div
                      className="progress-fill"
                      style={{ width: `${item.factor_importance * 100}%` }}
                    ></div>
                    <span>{(item.factor_importance * 100).toFixed(0)}%</span>
                  </div>
                </td>
                <td>{(item.prediction_accuracy * 100).toFixed(0)}%</td>
                <td>
                  <button
                    className="btn-detail"
                    onClick={() => setSelectedMonth(selectedMonth === item.month ? null : item.month)}
                  >
                    {selectedMonth === item.month ? 'Tutup' : 'Detail'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {selectedMonth && (
        <div className="detail-modal">
          <div className="detail-content">
            <h3>Detail {selectedMonth} {data.find((d) => d.month === selectedMonth)?.year}</h3>
            {data
              .filter((d) => d.month === selectedMonth)
              .map((item) => (
                <div key={item.month} className="detail-grid">
                  <div className="detail-section">
                    <h4>📊 Faktor Pengaruh</h4>
                    <ul>
                      <li>
                        <strong>1. {item.most_influential_factor}</strong>
                        <span className="importance-badge">
                          {(item.factor_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                      <li>
                        <strong>2. {item.secondary_factor}</strong>
                        <span className="importance-badge secondary">
                          {(item.secondary_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                      <li>
                        <strong>3. {item.tertiary_factor}</strong>
                        <span className="importance-badge tertiary">
                          {(item.tertiary_importance * 100).toFixed(0)}%
                        </span>
                      </li>
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>🌡️ Data Lingkungan</h4>
                    <ul>
                      <li>Curah Hujan: <strong>{item.rainfall_mm.toFixed(2)} mm</strong></li>
                    </ul>
                  </div>
                  <div className="detail-section">
                    <h4>👥 Data Demografis</h4>
                    <ul>
                      <li>Kepadatan Penduduk: <strong>{item.population_density}/km²</strong></li>
                    </ul>
                  </div>
                </div>
              ))}
            <button className="btn-close" onClick={() => setSelectedMonth(null)}>
              Tutup
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MonthlyData;
