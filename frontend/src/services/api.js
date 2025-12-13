import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const getMonthlyResults = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/monthly-results', { params });
  return response.data;
};

export const getMonthlyResultByMonth = async (month) => {
  const response = await api.get(`/api/monthly-results/${month}`);
  return response.data;
};

export const getFactorSummary = async () => {
  const response = await api.get('/api/factor-summary');
  return response.data;
};

export const getModelInfo = async () => {
  const response = await api.get('/api/model-info');
  return response.data;
};

export const getRegionalData = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/regional-data', { params });
  return response.data;
};

export const getScatterPlotData = async (factor, year = null) => {
  const params = year ? { year } : {};
  const response = await api.get(`/api/scatter-plot/${factor}`, { params });
  return response.data;
};

export const getStatistics = async () => {
  const response = await api.get('/api/statistics');
  return response.data;
};

export const getLineChartData = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/line-chart-data', { params });
  return response.data;
};

export const getBarChartData = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/bar-chart-data', { params });
  return response.data;
};

export const getAvailableYears = async () => {
  const response = await api.get('/api/available-years');
  return response.data;
};

export const getAvailableRegions = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/available-regions', { params });
  return response.data;
};

export const getRainfallScatterByRegion = async (region, year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/scatter-rainfall-by-region', { 
    params: { ...params, region } 
  });
  return response.data;
};

export const getPopulationScatterAllRegions = async (year = null) => {
  const params = year ? { year } : {};
  const response = await api.get('/api/scatter-population-all-regions', { params });
  return response.data;
};

export default api;
