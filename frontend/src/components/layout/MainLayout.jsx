import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Navbar from './Navbar';

export default function MainLayout() {
  return (
    
    <div className="min-h-screen bg-slate-50 text-gray-800 dark:bg-slate-900 dark:text-gray-100 pb-20 lg:pb-0">
      
      {/* Komponen Sidebar & Bottom Nav */}
      <Sidebar />

      {/* Konten Utama (Bergeser ke kanan 64px hanya di Desktop) */}
      <div className="flex flex-col transition-all duration-300 lg:pl-64">
        
        {/* Navbar Tanpa Hamburger */}
        <Navbar />

        {/* Area Halaman Dinamis */}
        <main className="flex-1 p-4 sm:p-6">
          <Outlet />
        </main>
        
      </div>
    </div>
  );
}