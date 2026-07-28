import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import ProtectedRoute from '../components/layout/ProtectedRoute';
import MainLayout from '../components/layout/MainLayout';

// Auth Pages
import LoginPage from '../pages/auth/LoginPage';
import RegisterPage from '../pages/auth/RegisterPage'; 

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
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes (Harus Login) */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />}>
            {/* Otomatis redirect dari "/" ke "/dashboard" */}
            <Route index element={<Navigate to="/dashboard" replace />} /> 
            
            <Route path="dashboard" element={<DashboardPage />} />
            <Route path="rumah" element={<RumahListPage />} />
            <Route path="penghuni" element={<PenghuniListPage />} />
            <Route path="transaksi" element={<TransaksiPage />} />
            <Route path="laporan" element={<LaporanFinansialPage />} />
          </Route>
        </Route>

        {/* Fallback Route: Jika route tidak ditemukan, kembalikan ke login */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  );
}