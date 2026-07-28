import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiChevronDown, HiSun, HiMoon } from 'react-icons/hi2';
import api from '../../../services/api'; // Pastikan path api-nya benar

export default function NavUserProfile() {
  const navigate = useNavigate();
  const dropdownRef = useRef(null);
  
  const [user, setUser] = useState({ name: 'Memuat...', role: 'Admin RT' });
  const [isOpen, setIsOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);

  // 1. Ambil data user dari API /me
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await api.get('/me');
        if (response.data && response.data.data) {
          setUser({
            name: response.data.data.name,
            role: 'Admin RT'
          });
        }
      } catch (error) {
        console.error("Gagal mengambil data user:", error);
        setUser({ name: 'User RT', role: 'Admin RT' });
      }
    };
    fetchUser();
  }, []);

  // 2. Inisialisasi status Dark Mode saat ini
  useEffect(() => {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true);
    }
  }, []);

  // 3. Fungsi Toggle Dark Mode khusus untuk mobile dropdown
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('color-theme', 'light');
      setIsDarkMode(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('color-theme', 'dark');
      setIsDarkMode(true);
    }
  };

  // Tutup dropdown jika klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 focus:outline-none cursor-pointer"
      >
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="hidden md:block text-left">
          <div className="font-semibold text-sm text-gray-800 dark:text-white line-clamp-1">{user.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
        </div>
        <HiChevronDown size={16} className="text-gray-500 hidden md:block" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-xl shadow-lg py-1 z-50 border border-gray-100 dark:border-slate-700 animate-fade-in">
          
          {/* Tombol Dark Mode - HANYA MUNCUL DI MOBILE (md:hidden) */}
          <button
            onClick={(e) => {
              e.stopPropagation(); // Mencegah dropdown tertutup saat mengganti tema
              toggleDarkMode();
            }}
            className="md:hidden w-full text-left px-4 py-2.5 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 flex items-center font-medium border-b border-slate-100 dark:border-slate-700 transition-colors"
          >
            {isDarkMode ? <HiSun size={18} className="mr-2 text-amber-400" /> : <HiMoon size={18} className="mr-2" />}
            {isDarkMode ? 'Mode Terang' : 'Mode Gelap'}
          </button>

          <button
            onClick={handleLogout}
            className="w-full text-left px-4 py-2.5 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 font-semibold transition-colors rounded-b-xl"
          >
            Keluar
          </button>
        </div>
      )}
    </div>
  );
}