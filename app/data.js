// DompetKeluarga — data contoh (example household) untuk situs anggaran rumah tangga.
// Semua angka adalah DATA CONTOH sebuah keluarga fiktif ("Keluarga Pratama", 4 orang,
// Jakarta) agar setiap halaman tampak hidup. Bukan data nyata siapa pun; label
// "Data contoh" tampil di footer situs. Bulan berjalan: November 2026.

export const HOUSEHOLD = {
  name: 'Keluarga Pratama',
  members: 'Budi, Sari, dan 2 anak',
  city: 'Jakarta',
  month: '2026-11',
};

export const MONTHS = [
  { key: '2026-06', label: 'Jun 2026' },
  { key: '2026-07', label: 'Jul 2026' },
  { key: '2026-08', label: 'Agu 2026' },
  { key: '2026-09', label: 'Sep 2026' },
  { key: '2026-10', label: 'Okt 2026' },
  { key: '2026-11', label: 'Nov 2026' },
];

// Ringkasan bulan-bulan sebelumnya (dipakai grafik laporan 6 bulan).
export const MONTH_SUMMARIES = {
  '2026-06': { income: 12400000, expense: 9820000 },
  '2026-07': { income: 12400000, expense: 10150000 },
  '2026-08': { income: 13100000, expense: 10780000 },
  '2026-09': { income: 12400000, expense: 9940000 },
  '2026-10': { income: 12850000, expense: 10320000 },
};

export const CATEGORIES = [
  { key: 'belanja', label: 'Belanja Harian', color: '#2e7d5b', icon: '🛒' },
  { key: 'makan', label: 'Makan di Luar', color: '#c96f3f', icon: '🍜' },
  { key: 'transport', label: 'Transportasi', color: '#3f6fb5', icon: '🚌' },
  { key: 'tagihan', label: 'Tagihan & Utilitas', color: '#7a5fb5', icon: '💡' },
  { key: 'pendidikan', label: 'Pendidikan', color: '#b5892e', icon: '📚' },
  { key: 'kesehatan', label: 'Kesehatan', color: '#c94f6d', icon: '🩺' },
  { key: 'hiburan', label: 'Hiburan', color: '#4fa8a0', icon: '🎬' },
  { key: 'lainnya', label: 'Lainnya', color: '#8a8a7a', icon: '🧺' },
];

export const INCOME_CATEGORIES = [
  { key: 'gaji', label: 'Gaji' },
  { key: 'usaha', label: 'Usaha Sampingan' },
  { key: 'lain-masuk', label: 'Pemasukan Lain' },
];

// Batas anggaran bulanan per kategori (rupiah).
export const DEFAULT_BUDGETS = {
  belanja: 3500000,
  makan: 1200000,
  transport: 900000,
  tagihan: 1500000,
  pendidikan: 1800000,
  kesehatan: 600000,
  hiburan: 500000,
  lainnya: 400000,
};

export const GOALS = [
  { id: 'g1', name: 'Dana Darurat', target: 30000000, saved: 18500000, note: '6x pengeluaran bulanan' },
  { id: 'g2', name: 'Liburan Keluarga', target: 12000000, saved: 7200000, note: 'Yogyakarta, libur sekolah' },
  { id: 'g3', name: 'DP Motor Baru', target: 15000000, saved: 4800000, note: 'Ganti motor 2015' },
];

// Transaksi contoh November 2026 (id, tanggal, jenis, kategori, catatan, jumlah).
export const TRANSACTIONS = [
  { id: 't01', date: '2026-11-01', type: 'in', category: 'gaji', note: 'Gaji Budi — November', amount: 9500000 },
  { id: 't02', date: '2026-11-01', type: 'in', category: 'gaji', note: 'Gaji Sari — November', amount: 2900000 },
  { id: 't03', date: '2026-11-02', type: 'out', category: 'belanja', note: 'Belanja mingguan — pasar & supermarket', amount: 685000 },
  { id: 't04', date: '2026-11-02', type: 'out', category: 'tagihan', note: 'Listrik PLN', amount: 412000 },
  { id: 't05', date: '2026-11-03', type: 'out', category: 'transport', note: 'Bensin motor (2x isi)', amount: 120000 },
  { id: 't06', date: '2026-11-04', type: 'out', category: 'makan', note: 'Makan siang keluarga — warteg', amount: 98000 },
  { id: 't07', date: '2026-11-05', type: 'out', category: 'pendidikan', note: 'SPP anak — November', amount: 1450000 },
  { id: 't08', date: '2026-11-06', type: 'out', category: 'belanja', note: 'Belanja bulanan — beras, minyak, sabun', amount: 920000 },
  { id: 't09', date: '2026-11-07', type: 'out', category: 'hiburan', note: 'Nonton bioskop berempat', amount: 240000 },
  { id: 't10', date: '2026-11-08', type: 'out', category: 'transport', note: 'Tol + parkir akhir pekan', amount: 165000 },
  { id: 't11', date: '2026-11-09', type: 'out', category: 'belanja', note: 'Sayur & buah mingguan', amount: 310000 },
  { id: 't12', date: '2026-11-10', type: 'out', category: 'tagihan', note: 'Internet rumah', amount: 350000 },
  { id: 't13', date: '2026-11-11', type: 'out', category: 'kesehatan', note: 'Periksa gigi anak', amount: 275000 },
  { id: 't14', date: '2026-11-12', type: 'in', category: 'usaha', note: 'Order kue — Sari', amount: 450000 },
  { id: 't15', date: '2026-11-13', type: 'out', category: 'makan', note: 'Makan malam — ulang tahun Budi', amount: 385000 },
  { id: 't16', date: '2026-11-14', type: 'out', category: 'transport', note: 'KRL + ojek online seminggu', amount: 210000 },
  { id: 't17', date: '2026-11-15', type: 'out', category: 'belanja', note: 'Belanja mingguan + susu anak', amount: 540000 },
  { id: 't18', date: '2026-11-16', type: 'out', category: 'tagihan', note: 'Air PDAM', amount: 185000 },
  { id: 't19', date: '2026-11-17', type: 'out', category: 'pendidikan', note: 'Buku & alat tulis semester', amount: 320000 },
  { id: 't20', date: '2026-11-18', type: 'out', category: 'lainnya', note: 'Servis AC ruang tamu', amount: 250000 },
  { id: 't21', date: '2026-11-19', type: 'out', category: 'makan', note: 'Jajan anak sekolah (seminggu)', amount: 150000 },
  { id: 't22', date: '2026-11-20', type: 'out', category: 'transport', note: 'Bensin motor', amount: 60000 },
  { id: 't23', date: '2026-11-21', type: 'out', category: 'hiburan', note: 'Langganan streaming keluarga', amount: 149000 },
  { id: 't24', date: '2026-11-22', type: 'out', category: 'belanja', note: 'Belanja mingguan', amount: 495000 },
  { id: 't25', date: '2026-11-23', type: 'out', category: 'tagihan', note: 'Iuran RT + keamanan', amount: 100000 },
  { id: 't26', date: '2026-11-24', type: 'out', category: 'kesehatan', note: 'Vitamin & obat flu', amount: 132000 },
  { id: 't27', date: '2026-11-25', type: 'out', category: 'makan', note: 'Kopi & sarapan (seminggu)', amount: 175000 },
  { id: 't28', date: '2026-11-26', type: 'out', category: 'belanja', note: 'Daging & lauk akhir bulan', amount: 430000 },
];

export const TIPS = [
  { title: 'Aturan 50/30/20', body: 'Idealnya 50% kebutuhan, 30% keinginan, 20% tabungan. Bulan ini kebutuhan Keluarga Pratama 83% karena SPP dan belanja pokok — tapi keinginan cuma 17% dan tabungan 33%, tetap di atas target 20%.' },
  { title: 'Belanja harian hampir penuh', body: 'Belanja harian sudah Rp3,38 jt dari anggaran Rp3,5 jt — sisa Rp120 rb. Minggu terakhir bulan ini masak dari stok kulkas dulu.' },
  { title: 'Dana darurat hampir 62%', body: 'Dana darurat Rp18,5 jt dari target Rp30 jt. Sisa bulan ini Rp4,24 jt — pindahkan Rp2 jt ke dana darurat dan progresnya jadi 68%.' },
];
