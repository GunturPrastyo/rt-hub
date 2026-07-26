import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Page
import LoginPage from '../pages/auth/LoginPage'; 

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import RumahListPage from '../pages/rumah/RumahListPage';
import PenghuniListPage from '../pages/penghuni/PenghuniListPage';
import PemasukanIuranPage from '../pages/transaksi/pemasukan/PemasukanIuranPage';
import PengeluaranRtPage from '../pages/transaksi/pengeluaran/PengeluaranRtPage';
import LaporanFinansialPage from '../pages/laporan/LaporanFinansialPage'; 

export default function AppRouter() {
  return (
    <BrowserRouter> 
      <Routes>
        {/* Public Route (Login) */}
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes (Harus Login) */}
        <Route element={<ProtectedRoute />}>
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
          </Route>
        </Route>

        {/* Fallback Route: Jika route tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}