#!/usr/bin/env python3
"""
Generate static JSON files for all API endpoints
This script will export all backend API responses to static JSON files
"""

import json
import os
import sys
from pathlib import Path
import pandas as pd

# Import the main app and its functions
from main import (
    load_data, load_csv_data, get_or_create_processor,
    DATA_FILE, CSV_FILE, NOTEBOOK_FILE
)

# Output directory for static JSON files
OUTPUT_DIR = Path(__file__).parent.parent / "frontend" / "public" / "api"


def ensure_output_dir():
    """Create output directory if it doesn't exist"""
    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    print(f"Output directory: {OUTPUT_DIR}")


def save_json(filename, data):
    """Save data to a JSON file"""
    filepath = OUTPUT_DIR / filename
    with open(filepath, 'w', encoding='utf-8') as f:
        json.dump(data, f, ensure_ascii=False, indent=2)
    print(f"✓ Generated: {filename}")


def generate_root():
    """Generate root endpoint"""
    data = {
        "message": "Selamat datang di API Analisis ML Kasus DBD Indonesia",
        "version": "1.0.0",
        "description": "API ini menyediakan akses ke data DBD dan hasil analisis Machine Learning",
        "data_source": {
            "csv": "Kasus_DBD_Gabungan.csv",
            "notebook": "DBD_analysis_final.ipynb",
            "years_covered": "2016-2024"
        },
        "endpoints": [
            "/api/monthly-results",
            "/api/factor-summary",
            "/api/model-info",
            "/api/regional-data",
            "/api/scatter-plot/{factor}",
            "/api/statistics",
            "/api/raw-data",
            "/api/raw-data/summary",
            "/api/notebook-info",
            "/api/download/csv",
            "/api/download/notebook"
        ]
    }
    save_json("index.json", data)


def generate_monthly_results():
    """Generate monthly results endpoint"""
    data = load_data()
    
    # Default year (2024)
    save_json("monthly-results.json", data["dbd_ml_results"])
    
    # Generate for all available years
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    for year in years:
        try:
            processor = get_or_create_processor(year)
            results = processor.get_monthly_aggregated_data(year)
            save_json(f"monthly-results-{year}.json", results)
        except Exception as e:
            print(f"  Warning: Could not generate data for year {year}: {e}")


def generate_monthly_results_by_month():
    """Generate monthly results by specific month"""
    data = load_data()
    results = data["dbd_ml_results"]
    
    # Create a mapping of month to result
    monthly_data = {}
    for result in results:
        month_key = result["month"].lower()
        monthly_data[month_key] = result
    
    save_json("monthly-results-by-month.json", monthly_data)


def generate_factor_summary():
    """Generate factor summary endpoint"""
    data = load_data()
    save_json("factor-summary.json", data["factor_summary"])


def generate_model_info():
    """Generate model info endpoint"""
    data = load_data()
    save_json("model-info.json", data["model_info"])


def generate_regional_data():
    """Generate regional data endpoint"""
    data = load_data()
    
    # Default year (2024)
    save_json("regional-data.json", data["regional_data"])
    
    # Generate for all available years
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    for year in years:
        try:
            processor = get_or_create_processor(year)
            results = processor.get_regional_data(year)
            save_json(f"regional-data-{year}.json", results)
        except Exception as e:
            print(f"  Warning: Could not generate regional data for year {year}: {e}")


def generate_scatter_plot_data():
    """Generate scatter plot data for all factors"""
    data = load_data()
    results = data["dbd_ml_results"]
    
    factors = ["rainfall", "population_density"]
    
    for factor in factors:
        factor_mapping = {
            "rainfall": ("rainfall_mm", "Curah Hujan (mm)"),
            "population_density": ("population_density", "Kepadatan Penduduk (per km²)")
        }
        
        field_name, label = factor_mapping[factor]
        
        # Create list of tuples (x, y, label) and sort by x value (factor)
        data_points = [(result[field_name], result["total_cases"], result["month"]) for result in results]
        data_points.sort(key=lambda point: point[0])
        
        # Unpack sorted data
        x_values = [point[0] for point in data_points]
        y_values = [point[1] for point in data_points]
        labels = [point[2] for point in data_points]
        
        scatter_data = {
            "x": x_values,
            "y": y_values,
            "labels": labels,
            "x_label": label,
            "y_label": "Kasus Bulanan"
        }
        
        save_json(f"scatter-plot-{factor}.json", scatter_data)
    
    # Generate for all years
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    for year in years:
        try:
            processor = get_or_create_processor(year)
            results = processor.get_monthly_aggregated_data(year)
            
            for factor in factors:
                field_name, label = factor_mapping[factor]
                data_points = [(result[field_name], result["total_cases"], result["month"]) for result in results]
                data_points.sort(key=lambda point: point[0])
                
                x_values = [point[0] for point in data_points]
                y_values = [point[1] for point in data_points]
                labels = [point[2] for point in data_points]
                
                scatter_data = {
                    "x": x_values,
                    "y": y_values,
                    "labels": labels,
                    "x_label": label,
                    "y_label": "Kasus Bulanan"
                }
                
                save_json(f"scatter-plot-{factor}-{year}.json", scatter_data)
        except Exception as e:
            print(f"  Warning: Could not generate scatter plot data for year {year}: {e}")


def generate_statistics():
    """Generate statistics endpoint"""
    data = load_data()
    results = data["dbd_ml_results"]
    
    total_cases = sum(r["total_cases"] for r in results)
    avg_cases = total_cases / len(results)
    max_cases = max(results, key=lambda x: x["total_cases"])
    min_cases = min(results, key=lambda x: x["total_cases"])
    
    # Count dominant factors
    factor_counts = {}
    for result in results:
        factor = result["most_influential_factor"]
        factor_counts[factor] = factor_counts.get(factor, 0) + 1
    
    avg_accuracy = sum(r["prediction_accuracy"] for r in results) / len(results)
    
    stats = {
        "total_cases_2023": total_cases,
        "average_monthly_cases": round(avg_cases, 2),
        "highest_month": {
            "month": max_cases["month"],
            "cases": max_cases["total_cases"],
            "dominant_factor": max_cases["most_influential_factor"]
        },
        "lowest_month": {
            "month": min_cases["month"],
            "cases": min_cases["total_cases"],
            "dominant_factor": min_cases["most_influential_factor"]
        },
        "dominant_factor_frequency": factor_counts,
        "average_prediction_accuracy": round(avg_accuracy, 4),
        "model_type": data["model_info"]["model_type"]
    }
    
    save_json("statistics.json", stats)


def generate_line_chart_data():
    """Generate line chart data endpoint"""
    data = load_data()
    results = data["dbd_ml_results"]
    
    months = [r["month"] for r in results]
    total_cases = [r["total_cases"] for r in results]
    rainfall = [r["rainfall_mm"] for r in results]
    
    chart_data = {
        "labels": months,
        "datasets": {
            "total_cases": total_cases,
            "rainfall": rainfall
        }
    }
    
    save_json("line-chart-data.json", chart_data)
    
    # Generate for all years
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    for year in years:
        try:
            processor = get_or_create_processor(year)
            results = processor.get_monthly_aggregated_data(year)
            
            months = [r["month"] for r in results]
            total_cases = [r["total_cases"] for r in results]
            rainfall = [r["rainfall_mm"] for r in results]
            
            chart_data = {
                "labels": months,
                "datasets": {
                    "total_cases": total_cases,
                    "rainfall": rainfall
                }
            }
            
            save_json(f"line-chart-data-{year}.json", chart_data)
        except Exception as e:
            print(f"  Warning: Could not generate line chart data for year {year}: {e}")


def generate_bar_chart_data():
    """Generate bar chart data endpoint"""
    data = load_data()
    results = data["dbd_ml_results"]
    
    months = [r["month"] for r in results]
    primary_importance = [r["factor_importance"] for r in results]
    secondary_importance = [r["secondary_importance"] for r in results]
    tertiary_importance = [r["tertiary_importance"] for r in results]
    primary_factors = [r["most_influential_factor"] for r in results]
    
    chart_data = {
        "labels": months,
        "primary_importance": primary_importance,
        "secondary_importance": secondary_importance,
        "tertiary_importance": tertiary_importance,
        "primary_factors": primary_factors
    }
    
    save_json("bar-chart-data.json", chart_data)
    
    # Generate for all years
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    for year in years:
        try:
            processor = get_or_create_processor(year)
            results = processor.get_monthly_aggregated_data(year)
            
            months = [r["month"] for r in results]
            primary_importance = [r["factor_importance"] for r in results]
            secondary_importance = [r["secondary_importance"] for r in results]
            tertiary_importance = [r["tertiary_importance"] for r in results]
            primary_factors = [r["most_influential_factor"] for r in results]
            
            chart_data = {
                "labels": months,
                "primary_importance": primary_importance,
                "secondary_importance": secondary_importance,
                "tertiary_importance": tertiary_importance,
                "primary_factors": primary_factors
            }
            
            save_json(f"bar-chart-data-{year}.json", chart_data)
        except Exception as e:
            print(f"  Warning: Could not generate bar chart data for year {year}: {e}")


def generate_raw_data():
    """Generate raw CSV data with various filters"""
    df = load_csv_data().copy()
    
    # Generate full dataset (paginated)
    # Default: limit 100, offset 0
    for offset in range(0, min(len(df), 1000), 100):
        limit = 100
        df_slice = df.iloc[offset:offset + limit]
        records = df_slice.to_dict('records')
        
        raw_data = {
            "total": len(df),
            "limit": limit,
            "offset": offset,
            "count": len(records),
            "data": records
        }
        
        save_json(f"raw-data-limit{limit}-offset{offset}.json", raw_data)
    
    # Generate by year
    years = sorted([int(y) for y in df['tahun'].unique()])
    for year in years:
        df_year = df[df['tahun'] == year]
        records = df_year.to_dict('records')
        
        raw_data = {
            "total": len(df_year),
            "limit": len(df_year),
            "offset": 0,
            "count": len(records),
            "data": records
        }
        
        save_json(f"raw-data-year{year}.json", raw_data)


def generate_raw_data_summary():
    """Generate raw data summary endpoint"""
    df = load_csv_data()
    
    summary = {
        "total_records": len(df),
        "years": {
            "min": int(df['tahun'].min()),
            "max": int(df['tahun'].max()),
            "unique": sorted([int(y) for y in df['tahun'].unique()])
        },
        "provinces": {
            "count": int(df['nama_provinsi'].nunique()),
            "list": sorted(df['nama_provinsi'].unique().tolist())
        },
        "districts": {
            "count": int(df['nama_kabupaten_kota'].nunique())
        },
        "cases": {
            "total": int(df['kasus_bulanan'].sum()),
            "min": int(df['kasus_bulanan'].min()),
            "max": int(df['kasus_bulanan'].max()),
            "mean": float(df['kasus_bulanan'].mean())
        },
        "columns": df.columns.tolist()
    }
    
    save_json("raw-data-summary.json", summary)


def generate_available_years():
    """Generate available years endpoint"""
    df = load_csv_data()
    years = sorted([int(y) for y in df['tahun'].unique()])
    
    data = {
        "years": years,
        "min": min(years),
        "max": max(years),
        "default": max(years)
    }
    
    save_json("available-years.json", data)


def generate_available_regions():
    """Generate available regions endpoint"""
    df = load_csv_data()
    
    # All regions
    regions = sorted(df['nama_kabupaten_kota'].unique().tolist())
    data = {
        "regions": regions,
        "count": len(regions)
    }
    save_json("available-regions.json", data)
    
    # By year
    years = sorted([int(y) for y in df['tahun'].unique()])
    for year in years:
        df_year = df[df['tahun'] == year]
        regions = sorted(df_year['nama_kabupaten_kota'].unique().tolist())
        data = {
            "regions": regions,
            "count": len(regions)
        }
        save_json(f"available-regions-year{year}.json", data)


def generate_scatter_rainfall_by_region():
    """Generate rainfall scatter by region endpoint"""
    df = load_csv_data()
    
    regions = sorted(df['nama_kabupaten_kota'].unique().tolist())
    
    month_names = [
        'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
        'Jul', 'Agu', 'Sep', 'Oct', 'Nov', 'Des'
    ]
    
    for region in regions:
        df_region = df[df['nama_kabupaten_kota'] == region].copy()
        df_region = df_region.sort_values('jumlah_curah_hujan')
        
        x_values = [round(float(x), 2) for x in df_region['jumlah_curah_hujan'].fillna(0).tolist()]
        y_values = df_region['kasus_bulanan'].fillna(0).astype(int).tolist()
        labels = [f"{month_names[int(m)-1]} {int(y)}" if pd.notna(m) and 1 <= int(m) <= 12 else "N/A" 
                  for m, y in zip(df_region['bulan'], df_region['tahun'])]
        
        scatter_data = {
            "x": x_values,
            "y": y_values,
            "labels": labels,
            "x_label": "Curah Hujan (mm)",
            "y_label": "Kasus Bulanan"
        }
        
        # Sanitize region name for filename
        region_filename = region.replace(' ', '-').replace('/', '-')
        save_json(f"scatter-rainfall-by-region-{region_filename}.json", scatter_data)
    
    # Also generate by year
    years = sorted([int(y) for y in df['tahun'].unique()])
    for year in years:
        for region in regions:
            df_region = df[(df['nama_kabupaten_kota'] == region) & (df['tahun'] == year)].copy()
            
            if len(df_region) == 0:
                continue
            
            df_region = df_region.sort_values('jumlah_curah_hujan')
            
            x_values = [round(float(x), 2) for x in df_region['jumlah_curah_hujan'].fillna(0).tolist()]
            y_values = df_region['kasus_bulanan'].fillna(0).astype(int).tolist()
            labels = [f"{month_names[int(m)-1]} {int(y)}" if pd.notna(m) and 1 <= int(m) <= 12 else "N/A" 
                      for m, y in zip(df_region['bulan'], df_region['tahun'])]
            
            scatter_data = {
                "x": x_values,
                "y": y_values,
                "labels": labels,
                "x_label": "Curah Hujan (mm)",
                "y_label": "Kasus Bulanan"
            }
            
            region_filename = region.replace(' ', '-').replace('/', '-')
            save_json(f"scatter-rainfall-by-region-{region_filename}-year{year}.json", scatter_data)


def generate_scatter_population_all_regions():
    """Generate population scatter for all regions endpoint"""
    df = load_csv_data()
    
    series_data = []
    
    for region in sorted(df['nama_kabupaten_kota'].unique()):
        df_region = df[df['nama_kabupaten_kota'] == region].copy()
        
        if len(df_region) == 0:
            continue
        
        total_cases = int(df_region['kasus_bulanan'].sum())
        pop_density = float(df_region['kepadatan_penduduk'].iloc[0])
        
        series_data.append({
            'name': region,
            'data': [{
                'x': pop_density,
                'y': total_cases,
                'name': region
            }]
        })
    
    scatter_data = {
        "series": series_data,
        "x_label": "Kepadatan Penduduk (per km²)",
        "y_label": "Total Kasus Tahunan"
    }
    
    save_json("scatter-population-all-regions.json", scatter_data)
    
    # By year
    years = sorted([int(y) for y in df['tahun'].unique()])
    for year in years:
        df_year = df[df['tahun'] == year]
        series_data = []
        
        for region in sorted(df_year['nama_kabupaten_kota'].unique()):
            df_region = df_year[df_year['nama_kabupaten_kota'] == region].copy()
            
            if len(df_region) == 0:
                continue
            
            total_cases = int(df_region['kasus_bulanan'].sum())
            pop_density = float(df_region['kepadatan_penduduk'].iloc[0])
            
            series_data.append({
                'name': region,
                'data': [{
                    'x': pop_density,
                    'y': total_cases,
                    'name': region
                }]
            })
        
        scatter_data = {
            "series": series_data,
            "x_label": "Kepadatan Penduduk (per km²)",
            "y_label": "Total Kasus Tahunan"
        }
        
        save_json(f"scatter-population-all-regions-year{year}.json", scatter_data)


def generate_notebook_info():
    """Generate notebook info endpoint"""
    try:
        with open(NOTEBOOK_FILE, 'r', encoding='utf-8') as f:
            notebook = json.load(f)
        
        cells = notebook.get('cells', [])
        code_cells = [c for c in cells if c.get('cell_type') == 'code']
        markdown_cells = [c for c in cells if c.get('cell_type') == 'markdown']
        
        imports = []
        if code_cells:
            first_cell_source = ''.join(code_cells[0].get('source', []))
            imports = [line.strip() for line in first_cell_source.split('\n') if line.strip().startswith('import') or line.strip().startswith('from')]
        
        info = {
            "notebook_name": "DBD_analysis_final.ipynb",
            "description": "Analisis Machine Learning untuk kasus Demam Berdarah Dengue (DBD) di Indonesia",
            "cells": {
                "total": len(cells),
                "code": len(code_cells),
                "markdown": len(markdown_cells)
            },
            "analysis_steps": [
                "Data Loading & Preprocessing",
                "Feature Engineering (lag features, rolling means)",
                "Feature Selection (Mutual Information, RFE, Wrapper Methods)",
                "Model Training (Random Forest Regressor)",
                "Feature Importance Analysis",
                "Model Evaluation"
            ],
            "libraries_used": imports[:10],
            "model": {
                "type": "Random Forest Regressor",
                "purpose": "Prediksi kasus DBD berdasarkan curah hujan, kepadatan penduduk, dan faktor lainnya"
            }
        }
        
        save_json("notebook-info.json", info)
    except Exception as e:
        print(f"  Warning: Could not generate notebook info: {e}")


def main():
    """Main function to generate all static JSON files"""
    print("=" * 60)
    print("Generating Static JSON Files for All API Endpoints")
    print("=" * 60)
    
    ensure_output_dir()
    
    print("\n1. Generating root endpoint...")
    generate_root()
    
    print("\n2. Generating monthly results...")
    generate_monthly_results()
    
    print("\n3. Generating monthly results by month...")
    generate_monthly_results_by_month()
    
    print("\n4. Generating factor summary...")
    generate_factor_summary()
    
    print("\n5. Generating model info...")
    generate_model_info()
    
    print("\n6. Generating regional data...")
    generate_regional_data()
    
    print("\n7. Generating scatter plot data...")
    generate_scatter_plot_data()
    
    print("\n8. Generating statistics...")
    generate_statistics()
    
    print("\n9. Generating line chart data...")
    generate_line_chart_data()
    
    print("\n10. Generating bar chart data...")
    generate_bar_chart_data()
    
    print("\n11. Generating raw data...")
    generate_raw_data()
    
    print("\n12. Generating raw data summary...")
    generate_raw_data_summary()
    
    print("\n13. Generating available years...")
    generate_available_years()
    
    print("\n14. Generating available regions...")
    generate_available_regions()
    
    print("\n15. Generating scatter rainfall by region...")
    generate_scatter_rainfall_by_region()
    
    print("\n16. Generating scatter population all regions...")
    generate_scatter_population_all_regions()
    
    print("\n17. Generating notebook info...")
    generate_notebook_info()
    
    print("\n" + "=" * 60)
    print("✓ All static JSON files generated successfully!")
    print(f"✓ Output directory: {OUTPUT_DIR}")
    print("=" * 60)


if __name__ == "__main__":
    main()
