/**
 * API Service for fetching static JSON data
 * All backend endpoints have been converted to static JSON files
 * stored in /public/api directory
 */

// Base path for static JSON files (relative to public directory)
const getBasePath = () => {
  // In production (GitHub Pages), use the repository name as base path
  const base = import.meta.env.BASE_URL || '/';
  return `${base}api/`;
};

/**
 * Fetch JSON file from the public/api directory
 */
const fetchJSON = async (filename) => {
  const url = `${getBasePath()}${filename}`;
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${filename}: ${response.statusText}`);
  }
  return response.json();
};

export const getMonthlyResults = async (year = null) => {
  const filename = year ? `monthly-results-${year}.json` : 'monthly-results.json';
  return fetchJSON(filename);
};

export const getMonthlyResultByMonth = async (month) => {
  // Fetch all monthly results and filter by month
  const data = await fetchJSON('monthly-results-by-month.json');
  const monthKey = month.toLowerCase();
  if (data[monthKey]) {
    return data[monthKey];
  }
  throw new Error(`Data for month '${month}' not found`);
};

export const getFactorSummary = async () => {
  return fetchJSON('factor-summary.json');
};

export const getModelInfo = async () => {
  return fetchJSON('model-info.json');
};

export const getRegionalData = async (year = null) => {
  const filename = year ? `regional-data-${year}.json` : 'regional-data.json';
  return fetchJSON(filename);
};

export const getScatterPlotData = async (factor, year = null) => {
  const filename = year ? `scatter-plot-${factor}-${year}.json` : `scatter-plot-${factor}.json`;
  return fetchJSON(filename);
};

export const getStatistics = async () => {
  return fetchJSON('statistics.json');
};

export const getLineChartData = async (year = null) => {
  const filename = year ? `line-chart-data-${year}.json` : 'line-chart-data.json';
  return fetchJSON(filename);
};

export const getBarChartData = async (year = null) => {
  const filename = year ? `bar-chart-data-${year}.json` : 'bar-chart-data.json';
  return fetchJSON(filename);
};

export const getAvailableYears = async () => {
  return fetchJSON('available-years.json');
};

export const getAvailableRegions = async (year = null) => {
  const filename = year ? `available-regions-year${year}.json` : 'available-regions.json';
  return fetchJSON(filename);
};

export const getRainfallScatterByRegion = async (region, year = null) => {
  // Sanitize region name for filename (same as backend)
  const regionFilename = region.replace(/ /g, '-').replace(/\//g, '-');
  const filename = year 
    ? `scatter-rainfall-by-region-${regionFilename}-year${year}.json`
    : `scatter-rainfall-by-region-${regionFilename}.json`;
  return fetchJSON(filename);
};

export const getPopulationScatterAllRegions = async (year = null) => {
  const filename = year 
    ? `scatter-population-all-regions-year${year}.json`
    : 'scatter-population-all-regions.json';
  return fetchJSON(filename);
};

// For backward compatibility, export a default object (not used anymore)
export default {
  getMonthlyResults,
  getMonthlyResultByMonth,
  getFactorSummary,
  getModelInfo,
  getRegionalData,
  getScatterPlotData,
  getStatistics,
  getLineChartData,
  getBarChartData,
  getAvailableYears,
  getAvailableRegions,
  getRainfallScatterByRegion,
  getPopulationScatterAllRegions,
};
