# Static JSON API Files

This directory contains 377 static JSON files that represent all backend API endpoints converted to static data.

## Overview
All backend endpoints have been pre-generated and saved as JSON files. The frontend application fetches data directly from these files instead of making HTTP requests to a backend server.

## File Organization

### Core Data
- `index.json` - API information
- `statistics.json` - Overall statistics
- `model-info.json` - ML model information
- `factor-summary.json` - Summary of factors

### Monthly Results
- `monthly-results.json` - Monthly data for 2024 (default)
- `monthly-results-{year}.json` - Monthly data for specific year (2016-2024)
- `monthly-results-by-month.json` - Lookup map by month name

### Regional Data
- `regional-data.json` - Regional data for 2024 (default)
- `regional-data-{year}.json` - Regional data for specific year (2016-2024)

### Visualizations
- `line-chart-data.json` and `line-chart-data-{year}.json`
- `bar-chart-data.json` and `bar-chart-data-{year}.json`
- `scatter-plot-{factor}.json` and `scatter-plot-{factor}-{year}.json`

### Region-Specific Scatter Plots
- `scatter-rainfall-by-region-{region}.json` - All years
- `scatter-rainfall-by-region-{region}-year{year}.json` - Specific year
- `scatter-population-all-regions.json` - All years
- `scatter-population-all-regions-year{year}.json` - Specific year

### Raw Data
- `raw-data-summary.json` - Summary of raw CSV data
- `raw-data-year{year}.json` - Raw data for specific year
- `raw-data-limit{limit}-offset{offset}.json` - Paginated raw data

### Metadata
- `available-years.json` - List of available years
- `available-regions.json` - List of available regions
- `available-regions-year{year}.json` - Regions for specific year
- `notebook-info.json` - Information about the analysis notebook

## Total Files: 377
- Years covered: 2016-2024 (9 years)
- Regions: 27 kabupaten/kota in West Java
- Total data points: 2,916 records

## Regenerating Files

If you need to regenerate these files (e.g., after updating the CSV data):

```bash
cd backend
python generate_static_json.py
```

This will regenerate all 377 JSON files in this directory.

## File Size
Total size: ~2.9 MB (all files)
Average per file: ~8 KB

## Last Generated
Run `backend/generate_static_json.py` to update these files.
