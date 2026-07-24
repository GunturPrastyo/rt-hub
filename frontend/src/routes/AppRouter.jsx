import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

// Layout Utama
import MainLayout from '../components/layout/MainLayout';

// Import Halaman yang Sudah Dibuat
import DashboardPage from '../pages/dashboard/DashboardPage';
import RumahListPage from '../pages/rumah/RumahListPage';

// Placeholder/Dummy Sementara untuk Halaman yang Belum Dibuat
const PenghuniListPage = () => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">Kelola Penghuni</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">Halaman master data warga/penghuni sedang disiapkan...</p>
  </div>
);

const IuranPage = () => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">Pemasukan Iuran RT</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">Halaman pencatatan iuran satpam & kebersihan sedang disiapkan...</p>
  </div>
);

const PengeluaranPage = () => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">Pengeluaran RT</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">Halaman pencatatan pengeluaran operasional sedang disiapkan...</p>
  </div>
);

const LaporanPage = () => (
  <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
    <h1 className="text-2xl font-bold font-heading text-slate-800 dark:text-slate-100 mb-2">Laporan Finansial Kas RT</h1>
    <p className="text-sm text-slate-500 dark:text-slate-400">Halaman rekap grafik & laporan tahunan sedang disiapkan...</p>
  </div>
);

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Redirect Otomatis ke Dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
          {/* Route Fitur Utama */}
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="rumah" element={<RumahListPage />} />
          <Route path="penghuni" element={<PenghuniListPage />} />
          
          {/* Route Transaksi & Laporan */}
          <Route path="transaksi/iuran" element={<IuranPage />} />
          <Route path="transaksi/pengeluaran" element={<PengeluaranPage />} />
          <Route path="laporan" element={<LaporanPage />} />

          {/* Catch-all Route untuk URL Tidak Ditemukan */}
          <Route path="*" element={<Navigate to="/dashboard" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}