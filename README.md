# uas-big-data
Projek UAS Big Data semester 5 diimplementasikan peminatan Software Engineering

🌐 **Live Demo**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)

## Deskripsi
Aplikasi web untuk menampilkan hasil analisis Machine Learning terhadap kasus Demam Berdarah Dengue (DBD) di Jawa Barat. Sistem ini menggunakan data real dari tahun **2016-2024** untuk menganalisis dan memprediksi kasus DBD berdasarkan curah hujan, kepadatan penduduk, dan faktor-faktor lainnya. Aplikasi menampilkan visualisasi interaktif seperti scatter plot, line chart, bar chart, dan pie chart untuk memudahkan pemahaman data.

**Note**: Aplikasi ini sepenuhnya menggunakan data statis (static JSON files) sehingga dapat berjalan tanpa backend server. Semua data telah di-generate sebelumnya dan disimpan sebagai file JSON di frontend.

## Fitur
- 📊 Dashboard dengan statistik utama dan ringkasan analisis
- 📈 Visualisasi data interaktif (Scatter Plot, Line Chart, Bar Chart, Pie Chart, Area Chart)
- 📋 Data bulanan dengan detail faktor-faktor pengaruh (2024)
- 🗺️ Data regional per kabupaten/kota di Jawa Barat (27 kabupaten/kota)
- 🤖 Informasi model Machine Learning (Random Forest Regressor)
- 📥 Download data mentah (CSV) dan notebook analisis
- 🔍 Filter data berdasarkan tahun, bulan, dan wilayah

## Teknologi

### Arsitektur
- **Static Site**: Aplikasi menggunakan arsitektur static site dengan semua data dalam bentuk JSON files
- **No Backend Required**: Frontend dapat berjalan langsung tanpa perlu backend server
- **377 Static JSON Files**: Semua endpoint API telah di-konversi menjadi file JSON statis

### Backend (Untuk Generate Data)
- Python 3.9+
- FastAPI (Web Framework - untuk development)
- Pandas (Data Processing)
- NumPy (Numerical Computing)
- Scikit-learn (Machine Learning - Random Forest)

### Frontend
- React 18
- Vite
- Recharts (untuk visualisasi)
- React Router DOM
- Fetch API (untuk load JSON files)

## Instalasi dan Menjalankan

### Akses Demo Online
Aplikasi tersedia secara online di GitHub Pages (fully static, no backend required):
- **URL**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)
- **Catatan**: Aplikasi berjalan sepenuhnya dengan data statis, tidak memerlukan backend server

### Frontend (Development)

```bash
# Masuk ke direktori frontend
cd frontend

# Install dependencies
npm install

# Jalankan development server
npm run dev

# Build untuk production
npm run build
```

Frontend akan berjalan di `http://localhost:5173`

### Generate Static JSON Files (Opsional)

Jika ingin regenerate static JSON files dari data CSV:

```bash
# Masuk ke direktori backend
cd backend

# Install dependencies
pip install -r requirements.txt

# Generate static JSON files
python generate_static_json.py
```

Script ini akan menghasilkan 377 file JSON di direktori `frontend/public/api/` dengan semua data yang diperlukan untuk visualisasi.

## Static JSON API

Semua endpoint backend telah dikonversi menjadi static JSON files yang tersimpan di `frontend/public/api/`. Berikut adalah daftar data yang tersedia:

### Data Utama
| File | Deskripsi |
|------|-----------|
| `index.json` | Info API dan data source |
| `monthly-results.json` | Data hasil ML bulanan (2024) |
| `monthly-results-{year}.json` | Data hasil ML untuk tahun tertentu (2016-2024) |
| `monthly-results-by-month.json` | Data hasil ML per bulan (lookup map) |
| `factor-summary.json` | Ringkasan faktor-faktor dengan importance |
| `model-info.json` | Informasi model ML (akurasi, fitur, dll) |
| `regional-data.json` | Data per kabupaten/kota (2024) |
| `regional-data-{year}.json` | Data regional untuk tahun tertentu |
| `statistics.json` | Statistik keseluruhan |

### Data Visualisasi
| File | Deskripsi |
|------|-----------|
| `scatter-plot-{factor}.json` | Data scatter plot (rainfall/population_density) |
| `scatter-plot-{factor}-{year}.json` | Scatter plot untuk tahun tertentu |
| `line-chart-data.json` | Data untuk line chart |
| `line-chart-data-{year}.json` | Line chart untuk tahun tertentu |
| `bar-chart-data.json` | Data untuk bar chart |
| `bar-chart-data-{year}.json` | Bar chart untuk tahun tertentu |

### Data Raw & Regional
| File | Deskripsi |
|------|-----------|
| `raw-data-summary.json` | Ringkasan statistik data CSV |
| `raw-data-year{year}.json` | Data CSV untuk tahun tertentu |
| `available-years.json` | Daftar tahun yang tersedia (2016-2024) |
| `available-regions.json` | Daftar kabupaten/kota yang tersedia |
| `available-regions-year{year}.json` | Daftar region untuk tahun tertentu |
| `scatter-rainfall-by-region-{region}.json` | Scatter plot curah hujan vs kasus per wilayah |
| `scatter-rainfall-by-region-{region}-year{year}.json` | Per wilayah dan tahun |
| `scatter-population-all-regions.json` | Scatter plot kepadatan penduduk vs kasus semua wilayah |
| `scatter-population-all-regions-year{year}.json` | Per tahun |
| `notebook-info.json` | Informasi tentang notebook analisis |

Total: **377 static JSON files** mencakup semua data dari tahun 2016-2024 untuk 27 kabupaten/kota di Jawa Barat.

## Struktur Proyek

```
uas-big-data/
├── data/                           # Data folder (root level)
│   ├── Kasus_DBD_Gabungan.csv     # Data CSV real (2016-2024, 2916 records)
│   └── DBD_analysis_final.ipynb   # Jupyter notebook analisis
├── backend/
│   ├── main.py                     # FastAPI application (legacy)
│   ├── data_processor.py           # Script untuk memproses CSV & train model
│   ├── generate_static_json.py     # Script untuk generate static JSON files
│   ├── requirements.txt            # Python dependencies
│   └── data/
│       └── dbd_ml_results.json    # Hasil analisis ML (generated)
├── frontend/
│   ├── public/
│   │   └── api/                    # 377 static JSON files
│   ├── src/
│   │   ├── components/             # Komponen React
│   │   ├── pages/                  # Halaman aplikasi
│   │   ├── services/
│   │   │   └── api.js              # API service (fetch static JSON)
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
Aplikasi frontend secara otomatis di-deploy ke GitHub Pages menggunakan GitHub Actions sebagai **fully static site** (tanpa backend).

**Setup Awal** (sudah dikonfigurasi):
1. Repository sudah dikonfigurasi dengan GitHub Actions workflow
2. Static JSON files sudah di-generate dan disimpan di `frontend/public/api/`
3. Untuk mengaktifkan, buka Settings → Pages
4. Set Source ke "GitHub Actions"
5. Setiap push ke branch `main` akan otomatis deploy

**URL Live**: [https://aransyah28.github.io/uas-big-data/](https://aransyah28.github.io/uas-big-data/)

**Keuntungan Arsitektur Static**:
- ✅ Tidak perlu deploy atau maintain backend server
- ✅ Hosting gratis di GitHub Pages
- ✅ Fast loading time (CDN)
- ✅ Lebih aman (no server-side code)
- ✅ Mudah di-maintain dan update

Untuk detail lengkap setup dan troubleshooting, lihat [GITHUB_PAGES_SETUP.md](GITHUB_PAGES_SETUP.md)

## Screenshot
(Screenshots will be added after running the application)

## Kontributor
- Tim Proyek UAS Big Data Semester 5
