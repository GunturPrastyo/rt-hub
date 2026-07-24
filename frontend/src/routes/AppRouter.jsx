import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';


import DashboardPage from '../pages/dashboard/DashboardPage';


const Rumah = () => <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">🏠 Halaman Kelola Rumah</div>;
const Penghuni = () => <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">👥 Halaman Kelola Penghuni</div>;
const Iuran = () => <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">💳 Halaman Pemasukan Iuran</div>;
const Pengeluaran = () => <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">📉 Halaman Pengeluaran RT</div>;
const Laporan = () => <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">📊 Halaman Laporan Finansial</div>;

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Redirect otomatis dari / ke /dashboard */}
          <Route index element={<Navigate to="/dashboard" replace />} />
          
        
          <Route path="dashboard" element={<DashboardPage />} />
          
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