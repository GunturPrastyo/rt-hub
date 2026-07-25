import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from '../components/layout/MainLayout';
import DashboardPage from '../pages/dashboard/DashboardPage';
import RumahListPage from '../pages/rumah/RumahListPage';
import PenghuniListPage from '../pages/penghuni/PenghuniListPage';

import PemasukanIuranPage from '../pages/transaksi/pemasukan/PemasukanIuranPage';
import PengeluaranRtPage from '../pages/transaksi/pengeluaran/PengeluaranRtPage';
import LaporanFinansialPage from '../pages/laporan/LaporanFinansialPage'; // File Laporan

export default function AppRouter() {
  return (
    <BrowserRouter> {/* 👈 Bungkus di sini */}
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<DashboardPage />} />
          <Route path="rumah" element={<RumahListPage />} />
          <Route path="penghuni" element={<PenghuniListPage />} />
          
          {/* Path Transaksi */}
          <Route path="transaksi">
            <Route path="pemasukan" element={<PemasukanIuranPage />} />
            <Route path="pengeluaran" element={<PengeluaranRtPage />} />
          </Route>

          {/* Path Laporan */}
          <Route path="laporan">
            <Route path="finansial" element={<LaporanFinansialPage />} />
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}