import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Page
import LoginPage from '../pages/auth/LoginPage';

// Main Pages
import DashboardPage from '../pages/dashboard/DashboardPage';
import RumahListPage from '../pages/rumah/RumahListPage';
import PenghuniListPage from '../pages/penghuni/PenghuniListPage';
import LaporanFinansialPage from '../pages/laporan/LaporanFinansialPage';
import TransaksiPage from '../pages/transaksi/TransaksiPage';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Route (Login) */}
        <Route path="" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes (Harus Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="rumah" element={<RumahListPage />} />
            <Route path="penghuni" element={<PenghuniListPage />} />

            <Route path="transaksi" element={<TransaksiPage />} />

            <Route path="laporan" element={<LaporanFinansialPage />} />

          </Route>
        </Route>

        {/* Fallback Route: Jika route tidak ditemukan */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}