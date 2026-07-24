import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';

// Halaman Dummy Sementara untuk Tes Navigasi
const Dashboard = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">📌 Halaman Dashboard</div>;
const Rumah = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">🏠 Halaman Kelola Rumah</div>;
const Penghuni = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">👥 Halaman Kelola Penghuni</div>;
const Iuran = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">💳 Halaman Pemasukan Iuran</div>;
const Pengeluaran = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">📉 Halaman Pengeluaran RT</div>;
const Laporan = () => <div className="p-4 bg-white dark:bg-slate-800 rounded-xl shadow-sm">📊 Halaman Laporan Finansial</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Wrap Semua Route di dalam MainLayout */}
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Navigate to="/dashboard" replace />} />
          <Route path="dashboard" element={<Dashboard />} />
          <Route path="rumah" element={<Rumah />} />
          <Route path="penghuni" element={<Penghuni />} />
          <Route path="transaksi/iuran" element={<Iuran />} />
          <Route path="transaksi/pengeluaran" element={<Pengeluaran />} />
          <Route path="laporan" element={<Laporan />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}