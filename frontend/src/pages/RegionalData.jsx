import { useState, useEffect } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import { getRegionalData, getAvailableYears } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d', '#ffc658', '#ff7300'];
const PIE_LABEL_MIN_PERCENT = 5; // Only show labels for slices above this percentage

function RegionalData() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
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
        const result = await getRegionalData(selectedYear);
        setData(result);
      } catch (err) {
        setError('Gagal memuat data regional. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  const barChartData = data.map((item) => ({
    province: item.province,
    cases: item.total_cases_2023,
    importance: item.factor_importance * 100,
  }));

  const pieChartData = data.map((item) => ({
    name: item.province,
    value: item.total_cases_2023,
  }));

  return (
    <div className="regional-data">
      <h2 className="page-title">Data Regional per Kabupaten/Kota</h2>
      <p className="page-subtitle">
        Analisis kasus DBD dan faktor dominan untuk setiap kabupaten/kota di Jawa Barat (Tahun {selectedYear})
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

      <div className="charts-grid">
        <div className="chart-container">
          <h3>Kasus DBD per Kabupaten/Kota {selectedYear}</h3>
          <ResponsiveContainer width="100%" height={500}>
            <BarChart data={barChartData} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis type="number" />
              <YAxis dataKey="province" type="category" width={150} />
              <Tooltip formatter={(value) => value.toLocaleString()} />
              <Legend />
              <Bar dataKey="cases" name="Total Kasus" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-container">
          <h3>Distribusi Kasus per Kabupaten/Kota</h3>
          <ResponsiveContainer width="100%" height={500}>
            <PieChart>
              <Pie
                data={pieChartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => (percent * 100 > PIE_LABEL_MIN_PERCENT ? `${name}: ${(percent * 100).toFixed(0)}%` : '')}
                outerRadius={120}
                fill="#8884d8"
                dataKey="value"
              >
                {pieChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip formatter={(value) => value.toLocaleString()} />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="table-container">
        <h3>Detail Data Regional</h3>
        <table className="data-table">
          <thead>
            <tr>
              <th>Kabupaten/Kota</th>
              <th>Total Kasus {selectedYear}</th>
              <th>Faktor Dominan</th>
              <th>Factor Importance</th>
              <th>Kepadatan Penduduk</th>
              <th>Curah Hujan Rata-rata</th>
            </tr>
          </thead>
          <tbody>
            {data.map((item) => (
              <tr key={item.province}>
                <td>{item.province}</td>
                <td>{item.total_cases_2023.toLocaleString()}</td>
                <td>
                  <span className="factor-badge">{item.dominant_factor}</span>
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
                <td>
                  {item.population_density}/km²
                </td>
                <td>{item.avg_rainfall.toFixed(2)} mm</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="info-section">
        <h3>📋 Insight Regional</h3>
        <ul>
          <li>
            Data menunjukkan variasi kasus DBD di berbagai kabupaten/kota di Jawa Barat
          </li>
          <li>
            <strong>Kepadatan Penduduk</strong> merupakan faktor dominan yang mempengaruhi kasus DBD di sebagian besar wilayah
          </li>
          <li>
            Curah hujan juga berperan penting dalam penyebaran kasus DBD sebagai faktor sekunder
          </li>
          <li>
            <strong>Catatan:</strong> Data curah hujan rata-rata sama untuk semua kabupaten/kota karena merupakan data tingkat provinsi (Jawa Barat) yang berlaku untuk seluruh wilayah
          </li>
        </ul>
      </div>
    </div>
  );
}

export default RegionalData;
