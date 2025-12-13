import { useState, useEffect } from 'react';
import { getModelInfo, getFactorSummary } from '../services/api';
import Loading from '../components/Loading';
import ErrorMessage from '../components/ErrorMessage';

function ModelInfo() {
  const [modelInfo, setModelInfo] = useState(null);
  const [factorSummary, setFactorSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [model, factors] = await Promise.all([
          getModelInfo(),
          getFactorSummary(),
        ]);
        setModelInfo(model);
        setFactorSummary(factors);
      } catch (err) {
        setError('Gagal memuat informasi model. Pastikan backend berjalan.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Loading />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="model-info">
      <h2 className="page-title">Informasi Model Machine Learning</h2>
      <p className="page-subtitle">
        Detail teknis model ML yang digunakan untuk menganalisis faktor-faktor kasus DBD
      </p>

      <div className="info-grid">
        <div className="info-card">
          <h3>🤖 Spesifikasi Model</h3>
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">Tipe Model:</span>
              <span className="info-value">{modelInfo?.model_type}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Periode Training:</span>
              <span className="info-value">{modelInfo?.training_period}</span>
            </div>
            <div className="info-row">
              <span className="info-label">Total Data Points:</span>
              <span className="info-value">{modelInfo?.total_data_points?.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="info-card">
          <h3>🎯 Performa Model</h3>
          <div className="info-content">
            <div className="info-row">
              <span className="info-label">Training Accuracy:</span>
              <span className="info-value highlight">
                {(modelInfo?.training_accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Test Accuracy:</span>
              <span className="info-value highlight">
                {(modelInfo?.test_accuracy * 100).toFixed(1)}%
              </span>
            </div>
            <div className="info-row">
              <span className="info-label">Cross-Validation Score:</span>
              <span className="info-value highlight">
                {(modelInfo?.cross_validation_score * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        </div>

        <div className="info-card full-width">
          <h3>📊 Features yang Digunakan</h3>
          <div className="features-grid">
            {modelInfo?.features_used.map((feature, index) => (
              <div key={index} className="feature-tag">
                {feature}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="factors-section">
        <h3>📋 Deskripsi Faktor-Faktor</h3>
        <div className="factors-grid">
          {factorSummary?.factors.map((factor, index) => (
            <div key={index} className="factor-card">
              <div className="factor-header">
                <h4>{factor.name}</h4>
                <span className="importance-badge">
                  Avg: {(factor.avg_importance * 100).toFixed(0)}%
                </span>
              </div>
              <p>{factor.description}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="methodology-section">
        <h3>📖 Metodologi</h3>
        <div className="methodology-content">
          <h4>Pengumpulan Data</h4>
          <p>
            Data dikumpulkan dari berbagai sumber termasuk Kementerian Kesehatan RI, BMKG, dan BPS
            untuk periode 2016-2024. Data mencakup jumlah kasus DBD, variabel cuaca (curah hujan), dan faktor demografis (kepadatan penduduk).
          </p>

          <h4>Preprocessing Data</h4>
          <p>
            Data dibersihkan dari nilai yang hilang dan outlier. Normalisasi dilakukan pada fitur
            numerik untuk memastikan skala yang seragam. Feature engineering dilakukan untuk
            membuat variabel turunan yang relevan.
          </p>

          <h4>Model Training</h4>
          <p>
            Random Forest Regressor dipilih karena kemampuannya menangani hubungan non-linear
            dan memberikan feature importance. Model dilatih dengan 80% data dan divalidasi dengan
            20% data testing. Cross-validation 5-fold digunakan untuk memastikan robustness model.
          </p>

          <h4>Interpretasi Hasil</h4>
          <p>
            Feature importance dari Random Forest digunakan untuk mengidentifikasi faktor yang
            paling berpengaruh terhadap kasus DBD. Analisis dilakukan per bulan untuk menangkap
            variasi musiman dalam faktor-faktor yang mempengaruhi penyebaran DBD.
          </p>
        </div>
      </div>
    </div>
  );
}

export default ModelInfo;
