# Integrasi Data CSV dan Notebook dengan Backend

## Ringkasan

Repository ini mengintegrasikan data real kasus Demam Berdarah Dengue (DBD) dari file CSV dengan analisis Machine Learning menggunakan Jupyter notebook. Backend FastAPI menyediakan API untuk mengakses data mentah maupun hasil analisis ML.

## Sumber Data

### 1. Data CSV: `data/Kasus_DBD_Gabungan.csv`

**Informasi Dataset:**
- **Deskripsi**: Data kasus DBD di Jawa Barat
- **Periode**: 2016 - 2024 (9 tahun)
- **Total Records**: 2,916 baris data
- **Cakupan Wilayah**: Provinsi Jawa Barat (27 kabupaten/kota)

**Kolom-kolom Data:**
- `tahun` - Tahun data (2016-2024)
- `bulan` - Bulan dalam angka (1-12)
- `nama_provinsi` - Nama provinsi (Jawa Barat)
- `nama_kabupaten_kota` - Nama kabupaten/kota (27 wilayah)
- `kasus_bulanan` - Jumlah kasus DBD per bulan
- `total_tahunan` - Total kasus dalam setahun
- `jumlah_curah_hujan` - Curah hujan bulanan (mm)
- `kepadatan_penduduk` - Kepadatan penduduk per km²

### 2. Jupyter Notebook: `data/DBD_analysis_final.ipynb`

**Informasi Notebook:**
- **Deskripsi**: Analisis Machine Learning untuk prediksi kasus DBD
- **Total Cells**: 13 cells (semua code cells)

**Tahapan Analisis:**
1. **Data Loading & Preprocessing** - Membaca dan membersihkan data
2. **Feature Engineering** - Membuat fitur lag, rolling means, dan interaksi
3. **Feature Selection** - Mutual Information, RFE (Recursive Feature Elimination), Wrapper Methods
4. **Model Training** - Melatih Random Forest Regressor
5. **Feature Importance Analysis** - Analisis kontribusi setiap fitur
6. **Model Evaluation** - Evaluasi performa model

## Komponen Backend

### 1. Data Processor: `backend/data_processor.py`

Script Python yang mengintegrasikan logic dari notebook ke dalam backend:

**Fungsi Utama:**
- Memuat dan memproses data CSV
- Melakukan feature engineering:
  - `rain_lag1` - Curah hujan bulan sebelumnya
  - `rain_3m_mean` - Rata-rata curah hujan 3 bulan terakhir
  - `rain_x_density` - Interaksi curah hujan × kepadatan penduduk
- Melatih model Random Forest Regressor
- Menghasilkan hasil analisis dalam format JSON

**Cara menggunakan:**
```bash
cd backend
python3 data_processor.py
```

**Output:** `backend/data/dbd_ml_results.json`

---

### 2. Backend API: `backend/main.py`

FastAPI backend yang menyediakan REST API untuk mengakses data dan hasil analisis.

#### A. Endpoint Analisis ML

**Endpoint untuk hasil analisis Machine Learning:**

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api/monthly-results` | Hasil analisis per bulan (default: 2024) |
| `GET /api/monthly-results?year={year}` | Hasil analisis untuk tahun tertentu |
| `GET /api/factor-summary` | Ringkasan faktor-faktor dengan importance |
| `GET /api/model-info` | Informasi model ML (akurasi, fitur, periode training) |
| `GET /api/regional-data` | Data agregat per kabupaten/kota (default: 2024) |
| `GET /api/regional-data?year={year}` | Data regional untuk tahun tertentu |
| `GET /api/statistics` | Statistik keseluruhan |
| `GET /api/scatter-plot/{factor}` | Data scatter plot (rainfall/population_density) |
| `GET /api/line-chart-data` | Data untuk line chart |
| `GET /api/bar-chart-data` | Data untuk bar chart (factor importance) |

---

#### B. Endpoint Data Mentah

**Endpoint untuk mengakses data CSV asli:**

| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api/raw-data` | Akses data CSV dengan filter (limit, offset, province, year) |
| `GET /api/raw-data/summary` | Ringkasan statistik data CSV |
| `GET /api/available-years` | Daftar tahun yang tersedia (2016-2024) |
| `GET /api/available-regions` | Daftar kabupaten/kota yang tersedia |
| `GET /api/scatter-rainfall-by-region` | Scatter plot curah hujan vs kasus per wilayah |
| `GET /api/scatter-population-all-regions` | Scatter plot kepadatan penduduk vs kasus semua wilayah |
| `GET /api/notebook-info` | Informasi tentang notebook analisis |
| `GET /api/download/csv` | Download file CSV asli |
| `GET /api/download/notebook` | Download file Jupyter notebook |

## Model Machine Learning

### Algoritma: Random Forest Regressor

**Konfigurasi Model:**
- **Estimators**: 250 decision trees
- **Max Depth**: 15
- **Min Samples Split**: 5
- **Random State**: 2

**Performa Model:**
- **Training Accuracy**: 94.77%
- **Test Accuracy**: 82.96%
- **R² Score (Cross-validation)**: ~0.83
- **Total Data Points**: 2,916 records
- **Periode Training**: 2016-2024

---

### Features (Fitur-fitur) yang Digunakan

Model menggunakan 6 fitur dengan tingkat kepentingan (importance) sebagai berikut:

| Rank | Fitur | Importance | Deskripsi |
|------|-------|------------|-----------|
| 1 | `kepadatan_penduduk` | 60.3% | Kepadatan penduduk per km² |
| 2 | `rain_x_density` | 19.4% | Interaksi curah hujan × kepadatan penduduk |
| 3 | `jumlah_curah_hujan` | 9.2% | Curah hujan bulanan (mm) |
| 4 | `rain_3m_mean` | 4.7% | Rata-rata curah hujan 3 bulan terakhir |
| 5 | `bulan` | 2.1% | Musim (pengaruh bulan dalam setahun) |
| 6 | `rain_lag1` | 1.2% | Curah hujan bulan sebelumnya (lag 1 bulan) |

**Insight:** Kepadatan penduduk adalah faktor paling dominan (60.3%), diikuti oleh interaksi antara curah hujan dan kepadatan penduduk (19.4%).

---

### Hasil Analisis Data 2024

**Statistik Kasus DBD 2024:**
- **Total Kasus**: 61,430 kasus
- **Rata-rata per Bulan**: 5,119 kasus
- **Bulan Tertinggi**: Juni dengan 9,091 kasus
- **Bulan Terendah**: Agustus dengan 1,541 kasus
- **Faktor Dominan**: Kepadatan Penduduk (konsisten di semua bulan)

## Cara Menjalankan Sistem

### 1. Install Dependencies

```bash
# Masuk ke direktori backend
cd backend

# Install Python dependencies
pip install -r requirements.txt
```

---

### 2. Generate Data dari CSV (Opsional)

Script `data_processor.py` akan memproses CSV dan menghasilkan file JSON dengan hasil analisis ML.

```bash
cd backend
python3 data_processor.py
```

**Output:** File `backend/data/dbd_ml_results.json` akan di-generate.

> **Catatan:** File JSON sudah tersedia di repository, jadi langkah ini opsional kecuali Anda mengupdate data CSV.

---

### 3. Jalankan Backend Server

```bash
cd backend
python3 main.py
```

**atau menggunakan uvicorn:**

```bash
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`

---

### 4. Jalankan Frontend (Opsional)

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies (jika belum)
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

---

### 5. Test API Endpoints

Anda dapat test API menggunakan browser, curl, atau Postman:

```bash
# Root endpoint - info API
curl http://localhost:8000/

# Data mentah dengan filter tahun
curl "http://localhost:8000/api/raw-data?year=2024&limit=10"

# Ringkasan data CSV
curl http://localhost:8000/api/raw-data/summary

# Info notebook
curl http://localhost:8000/api/notebook-info

# Hasil analisis ML bulanan
curl http://localhost:8000/api/monthly-results

# Data regional per kabupaten/kota
curl http://localhost:8000/api/regional-data

# Informasi model
curl http://localhost:8000/api/model-info
```

## Teknologi yang Digunakan

### Backend
- **FastAPI** - Modern web framework untuk building APIs
- **Pandas** - Data manipulation dan analisis
- **NumPy** - Operasi numerik dan array
- **Scikit-learn** - Machine Learning library (Random Forest)
- **Uvicorn** - ASGI server untuk FastAPI

### Frontend
- **React 18** - UI library
- **Vite** - Build tool dan dev server
- **Recharts** - Library untuk visualisasi data
- **React Router DOM** - Routing
- **Axios** - HTTP client

### Data Processing
- **Feature Engineering**: Lag features, rolling averages, interaction features
- **Feature Selection**: Mutual Information, RFE (Recursive Feature Elimination)
- **Model**: Random Forest Regressor dengan 250 estimators

## Struktur File dan Direktori

```
uas-big-data/
├── data/                              # Data folder (root level)
│   ├── Kasus_DBD_Gabungan.csv        # CSV data asli (2916 records, 2016-2024)
│   └── DBD_analysis_final.ipynb      # Jupyter notebook analisis ML
├── backend/
│   ├── main.py                        # FastAPI application (API endpoints)
│   ├── data_processor.py              # Script untuk memproses CSV & train model
│   ├── requirements.txt               # Python dependencies
│   └── data/
│       └── dbd_ml_results.json       # Hasil analisis ML (generated)
├── frontend/
│   ├── src/                           # Source code React
│   ├── package.json                   # NPM dependencies
│   └── vite.config.js                 # Vite configuration
├── README.md                          # Dokumentasi utama
└── DATA_INTEGRATION.md                # Dokumentasi integrasi data (file ini)
```

## Catatan Penting

### Data
1. Data yang digunakan adalah data **real** dari CSV, bukan data dummy atau sintetis
2. Dataset mencakup **27 kabupaten/kota** di Jawa Barat dengan periode 2016-2024
3. Total **2,916 records** data kasus DBD dengan informasi curah hujan dan kepadatan penduduk

### Model
1. Model Random Forest di-train menggunakan data sebenarnya dengan **test accuracy 82.96%**
2. Model menggunakan 6 fitur hasil feature engineering (lag, rolling mean, interaksi)
3. **Kepadatan penduduk** terbukti sebagai faktor paling dominan (60.3% importance)

### API
1. Backend menyediakan akses ke data mentah (CSV) melalui API dengan fitur filtering
2. File notebook dan CSV dapat didownload langsung melalui API endpoints
3. API mendukung filter berdasarkan tahun, bulan, dan wilayah
4. Semua endpoint mendukung CORS untuk integrasi dengan frontend React

### Visualisasi
1. Frontend React menyediakan dashboard interaktif dengan berbagai jenis chart
2. Data dapat divisualisasikan per bulan, per wilayah, atau secara keseluruhan
3. Scatter plot tersedia untuk menganalisis hubungan antara faktor dan kasus DBD

---

## Update Data di Masa Depan

Untuk memperbarui data dengan dataset terbaru:

1. **Update file CSV** di `data/Kasus_DBD_Gabungan.csv`
2. **Regenerate JSON** dengan menjalankan:
   ```bash
   python3 backend/data_processor.py
   ```
3. **Restart backend server** untuk load data baru

Model akan otomatis di-retrain dengan data terbaru dan feature importance akan diupdate sesuai pola data terbaru.

---

## Troubleshooting

### Backend tidak bisa akses CSV
- Pastikan file `data/Kasus_DBD_Gabungan.csv` ada di root directory
- Check path di `backend/main.py` line 36-37

### JSON tidak ter-generate
- Pastikan semua dependencies terinstall: `pip install -r requirements.txt`
- Check error message saat menjalankan `data_processor.py`

### API tidak mengembalikan data
- Pastikan `backend/data/dbd_ml_results.json` sudah di-generate
- Check backend logs untuk error messages
- Verify backend berjalan di port 8000

---

## Lisensi dan Kontributor

Proyek UAS Big Data - Semester 5 - Software Engineering
