# uas-big-data
Projek UAS Big Data semester 5 diimplementasikan peminatan Software Engineering

🌐 **Live Demo**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)

## Deskripsi
Aplikasi web untuk menampilkan hasil analisis Machine Learning terhadap kasus Demam Berdarah Dengue (DBD) di Jawa Barat. Sistem ini menggunakan data real dari tahun **2016-2024** untuk menganalisis dan memprediksi kasus DBD berdasarkan curah hujan, kepadatan penduduk, dan faktor-faktor lainnya. Aplikasi menampilkan visualisasi interaktif seperti scatter plot, line chart, bar chart, dan pie chart untuk memudahkan pemahaman data.

## Fitur
- 📊 Dashboard dengan statistik utama dan ringkasan analisis
- 📈 Visualisasi data interaktif (Scatter Plot, Line Chart, Bar Chart, Pie Chart, Area Chart)
- 📋 Data bulanan dengan detail faktor-faktor pengaruh (2024)
- 🗺️ Data regional per kabupaten/kota di Jawa Barat (27 kabupaten/kota)
- 🤖 Informasi model Machine Learning (Random Forest Regressor)
- 📥 Download data mentah (CSV) dan notebook analisis
- 🔍 Filter data berdasarkan tahun, bulan, dan wilayah

## Teknologi

### Backend
- Python 3.9+
- FastAPI (Web Framework)
- Pandas (Data Processing)
- NumPy (Numerical Computing)
- Scikit-learn (Machine Learning - Random Forest)
- Uvicorn (ASGI Server)

### Frontend
- React 18
- Vite
- Recharts (untuk visualisasi)
- React Router DOM
- Axios

## Instalasi dan Menjalankan

### Akses Demo Online
Aplikasi frontend tersedia secara online di GitHub Pages:
- **URL**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)
- **Catatan**: Untuk fungsionalitas penuh dengan backend, jalankan backend secara lokal (lihat instruksi di bawah)

### Backend

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Jalankan server
python main.py
# atau
uvicorn main:app --reload --port 8000
```

Backend akan berjalan di `http://localhost:8000`

### Frontend

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev
```

Frontend akan berjalan di `http://localhost:5173`

## API Endpoints

### Endpoints Analisis ML
| Endpoint | Deskripsi |
|----------|-----------|
| `GET /` | Info API dan data source |
| `GET /api/monthly-results` | Data hasil ML bulanan (2024) |
| `GET /api/monthly-results?year={year}` | Data hasil ML untuk tahun tertentu |
| `GET /api/monthly-results/{month}` | Data hasil ML untuk bulan tertentu |
| `GET /api/factor-summary` | Ringkasan faktor-faktor dengan importance |
| `GET /api/model-info` | Informasi model ML (akurasi, fitur, dll) |
| `GET /api/regional-data` | Data per kabupaten/kota (2024) |
| `GET /api/regional-data?year={year}` | Data regional untuk tahun tertentu |
| `GET /api/scatter-plot/{factor}` | Data scatter plot (rainfall/population_density) |
| `GET /api/statistics` | Statistik keseluruhan |
| `GET /api/line-chart-data` | Data untuk line chart |
| `GET /api/bar-chart-data` | Data untuk bar chart |

### Endpoints Data Mentah
| Endpoint | Deskripsi |
|----------|-----------|
| `GET /api/raw-data` | Akses data CSV dengan filter (limit, offset, province, year) |
| `GET /api/raw-data/summary` | Ringkasan statistik data CSV |
| `GET /api/available-years` | Daftar tahun yang tersedia (2016-2024) |
| `GET /api/available-regions` | Daftar kabupaten/kota yang tersedia |
| `GET /api/scatter-rainfall-by-region?region={nama}` | Scatter plot curah hujan vs kasus per wilayah |
| `GET /api/scatter-population-all-regions` | Scatter plot kepadatan penduduk vs kasus semua wilayah |
| `GET /api/notebook-info` | Informasi tentang notebook analisis |
| `GET /api/download/csv` | Download file CSV |
| `GET /api/download/notebook` | Download file Jupyter notebook |

## Struktur Proyek

```
uas-big-data/
├── data/                           # Data folder (root level)
│   ├── Kasus_DBD_Gabungan.csv     # Data CSV real (2016-2024, 2916 records)
│   └── DBD_analysis_final.ipynb   # Jupyter notebook analisis
├── backend/
│   ├── main.py                     # FastAPI application
│   ├── data_processor.py           # Script untuk memproses CSV & train model
│   ├── requirements.txt            # Python dependencies
│   └── data/
│       └── dbd_ml_results.json    # Hasil analisis ML (generated)
├── frontend/
│   ├── src/
│   │   ├── components/             # Komponen React
│   │   ├── pages/                  # Halaman aplikasi
│   │   ├── services/               # API service
│   │   ├── App.jsx                 # Main app component
│   │   └── App.css                 # Styling
│   ├── package.json
│   └── vite.config.js
└── README.md
```

## Data dan Model Machine Learning

### Dataset
- **Sumber**: Data kasus DBD Jawa Barat (CSV)
- **Periode**: 2016 - 2024 (9 tahun)
- **Total Records**: 2,916 baris
- **Cakupan Wilayah**: Jawa Barat (27 kabupaten/kota)
- **Variabel**: Tahun, bulan, provinsi, kabupaten/kota, kasus bulanan, total tahunan, curah hujan, kepadatan penduduk

### Model Machine Learning
- **Algoritma**: Random Forest Regressor
- **Akurasi Training**: 94.77%
- **Akurasi Testing**: 82.96%
- **Cross-validation Score (R²)**: ~0.83

### Faktor-faktor yang Mempengaruhi DBD (Feature Importance)
1. **Kepadatan Penduduk** (60.3%) - Faktor paling dominan
2. **Interaksi Hujan & Kepadatan** (19.4%) - Kombinasi curah hujan dan kepadatan penduduk
3. **Curah Hujan** (9.2%) - Curah hujan bulanan
4. **Rata-rata Curah Hujan 3 Bulan** (4.7%) - Efek kumulatif curah hujan
5. **Musim (Bulan)** (2.1%) - Pengaruh musim
6. **Curah Hujan Bulan Lalu** (1.2%) - Efek tertunda (lag)

### Statistik Data 2024
- **Total Kasus**: 61,430 kasus
- **Rata-rata per Bulan**: 5,119 kasus
- **Bulan Tertinggi**: Juni (9,091 kasus)
- **Bulan Terendah**: Agustus (1,541 kasus)

## Deployment

### GitHub Pages
Aplikasi frontend secara otomatis di-deploy ke GitHub Pages menggunakan GitHub Actions.

**Setup Awal** (sudah dikonfigurasi):
1. Repository sudah dikonfigurasi dengan GitHub Actions workflow
2. Untuk mengaktifkan, buka Settings → Pages
3. Set Source ke "GitHub Actions"
4. Setiap push ke branch `main` akan otomatis deploy

**URL Live**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)

Untuk detail lengkap setup dan troubleshooting, lihat [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

## Screenshot
(Screenshots will be added after running the application)

## Kontributor
- Tim Proyek UAS Big Data Semester 5
