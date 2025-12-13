# Konversi Backend ke Static JSON

## Ringkasan
Proyek ini telah dikonversi dari arsitektur client-server (frontend + backend) menjadi **fully static site** dengan semua data dalam bentuk JSON files. Ini memungkinkan aplikasi untuk berjalan tanpa backend server dan dapat di-deploy di hosting static seperti GitHub Pages.

## Motivasi
1. **Simplifikasi Deployment**: Tidak perlu deploy dan maintain backend server
2. **Hosting Gratis**: Dapat menggunakan GitHub Pages, Netlify, Vercel, dll
3. **Performance**: Loading lebih cepat dengan CDN
4. **Keamanan**: Tidak ada server-side code yang bisa di-exploit
5. **Maintenance**: Lebih mudah untuk update dan maintain

## Perubahan yang Dilakukan

### 1. Generate Static JSON Files
Semua endpoint backend API telah dikonversi menjadi 377 file JSON statis yang disimpan di `frontend/public/api/`:

**Script Generator**: `backend/generate_static_json.py`
- Membaca data dari CSV (`data/Kasus_DBD_Gabungan.csv`)
- Menjalankan ML model untuk generate predictions
- Menghasilkan JSON files untuk semua kombinasi:
  - Data bulanan untuk semua tahun (2016-2024)
  - Data regional untuk 27 kabupaten/kota
  - Scatter plots untuk semua region dan tahun
  - Line charts dan bar charts
  - Statistics dan summaries

**Total Files**: 377 JSON files
**Total Size**: ~2.9 MB (compressed di dist)

### 2. Update Frontend API Service
File `frontend/src/services/api.js` telah diubah:
- **Before**: Menggunakan `axios` untuk HTTP request ke backend
- **After**: Menggunakan native `fetch` untuk load JSON files dari `/public/api/`

**Mapping**:
```javascript
// Before
await api.get('/api/monthly-results', { params: { year } })

// After
await fetchJSON('monthly-results-2024.json')
```

### 3. File Naming Convention
JSON files mengikuti konvensi penamaan yang konsisten:

- `{endpoint}.json` - Data default
- `{endpoint}-{year}.json` - Data per tahun
- `{endpoint}-{region}.json` - Data per region
- `{endpoint}-{region}-year{year}.json` - Data per region dan tahun

**Contoh**:
- `monthly-results.json` - Data default (2024)
- `monthly-results-2020.json` - Data tahun 2020
- `scatter-rainfall-by-region-KOTA-BANDUNG.json` - All years
- `scatter-rainfall-by-region-KOTA-BANDUNG-year2023.json` - Tahun 2023

### 4. Penanganan Parameter Query
Parameter yang sebelumnya dikirim via query string sekarang diatasi dengan file naming:

**Year Parameter**:
```javascript
// API call
getMonthlyResults(year = 2023)

// File mapping
year ? `monthly-results-${year}.json` : 'monthly-results.json'
```

**Region Parameter**:
```javascript
// API call  
getRainfallScatterByRegion(region = "KOTA BANDUNG", year = 2023)

// File mapping
region_filename = region.replace(' ', '-').replace('/', '-')
// Result: scatter-rainfall-by-region-KOTA-BANDUNG-year2023.json
```

## Cara Regenerate Static JSON

Jika data CSV di-update atau model ML berubah:

```bash
cd backend

# Install dependencies (jika belum)
pip install -r requirements.txt

# Generate ulang semua JSON files
python generate_static_json.py
```

Script akan:
1. Load data CSV
2. Train ML model
3. Generate predictions untuk semua kombinasi tahun/region
4. Export ke 377 JSON files di `frontend/public/api/`

**Note**: Proses ini memakan waktu ~30-60 detik karena harus:
- Train model untuk setiap tahun (9 tahun)
- Generate scatter plots untuk 27 regions × 9 years
- Process semua kombinasi data

## Testing

### Local Development
```bash
cd frontend
npm install
npm run dev
```
Buka http://localhost:5173/uas-big-data/

### Production Build
```bash
cd frontend
npm run build
npm run preview
```
Buka http://localhost:4173/uas-big-data/

### Verify Static JSON
```bash
# Check if file exists
ls frontend/public/api/statistics.json

# View content
cat frontend/public/api/statistics.json | jq .

# Test via HTTP (after npm run preview)
curl http://localhost:4173/uas-big-data/api/statistics.json
```

## Data Coverage

### Tahun: 2016 - 2024 (9 tahun)
### Wilayah: 27 kabupaten/kota di Jawa Barat
### Total Records: 2,916 data points

**Kabupaten/Kota**:
1. KABUPATEN BANDUNG
2. KABUPATEN BANDUNG BARAT
3. KABUPATEN BEKASI
4. KABUPATEN BOGOR
5. KABUPATEN CIAMIS
6. KABUPATEN CIANJUR
7. KABUPATEN CIREBON
8. KABUPATEN GARUT
9. KABUPATEN INDRAMAYU
10. KABUPATEN KARAWANG
11. KABUPATEN KUNINGAN
12. KABUPATEN MAJALENGKA
13. KABUPATEN PANGANDARAN
14. KABUPATEN PURWAKARTA
15. KABUPATEN SUBANG
16. KABUPATEN SUKABUMI
17. KABUPATEN SUMEDANG
18. KABUPATEN TASIKMALAYA
19. KOTA BANDUNG
20. KOTA BANJAR
21. KOTA BEKASI
22. KOTA BOGOR
23. KOTA CIMAHI
24. KOTA CIREBON
25. KOTA DEPOK
26. KOTA SUKABUMI
27. KOTA TASIKMALAYA

## Keuntungan & Limitasi

### Keuntungan ✅
1. **No Backend Server**: Tidak perlu FastAPI/Uvicorn
2. **Free Hosting**: GitHub Pages, Netlify, Vercel
3. **Fast**: Static files served via CDN
4. **Secure**: No server-side vulnerabilities
5. **Simple Deploy**: Just push to GitHub
6. **Offline Ready**: Bisa di-cache untuk offline use

### Limitasi ⚠️
1. **No Real-time Updates**: Data harus di-regenerate manual
2. **Large File Size**: 377 files (~2.9 MB total)
3. **No Dynamic Queries**: Semua kombinasi harus pre-generated
4. **No User Input**: Tidak bisa input data baru via form
5. **Memory**: Browser harus load JSON files saat dibutuhkan

## Pertimbangan

### Kapan Menggunakan Static JSON?
✅ Data jarang berubah (bulanan/tahunan)
✅ Dataset terbatas dan predictable
✅ Read-only application
✅ Ingin deployment sederhana
✅ Budget terbatas (hosting gratis)

### Kapan Menggunakan Backend API?
❌ Data berubah real-time
❌ Dataset sangat besar (GB+)
❌ Perlu user authentication
❌ Complex queries/filtering
❌ User-generated content

## Future Improvements

1. **Data Compression**: Gzip JSON files untuk reduce size
2. **Lazy Loading**: Load JSON hanya saat dibutuhkan
3. **Service Worker**: Cache JSON files untuk offline access
4. **CDN Optimization**: Serve dari CDN dengan caching headers
5. **Index File**: Buat index.json untuk mapping semua files
6. **Incremental Updates**: Update hanya files yang berubah

## Kesimpulan

Konversi ke static JSON berhasil dilakukan dengan:
- ✅ 377 JSON files generated
- ✅ Frontend updated untuk fetch dari static files
- ✅ Build dan deployment tested
- ✅ No dependencies on backend server
- ✅ Ready untuk GitHub Pages deployment

Aplikasi sekarang dapat berjalan sebagai **fully static site** tanpa memerlukan backend server!
