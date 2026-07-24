import { useState, useEffect } from 'react';
import { HiBars3, HiSun, HiMoon } from 'react-icons/hi2';

import NavSearchBar from './components/NavSearchBar';
import NavNotification from './components/NavNotification';
import NavUserProfile from './components/NavUserProfile';

export default function Navbar({ onToggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (
      localStorage.getItem('color-theme') === 'dark' ||
      (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
    ) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    }
  }, []);

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

  return (
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm sticky top-0 z-10">
      {/* Sisi Kiri: Button Toggle Sidebar & Search Bar */}
      <div className="flex items-center">
        <button
          onClick={onToggleSidebar}
          className="text-gray-600 dark:text-gray-300 focus:outline-none mr-4 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <HiBars3 size={24} />
        </button>

        <NavSearchBar />
      </div>

      {/* Sisi Kanan: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-4">
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors"
          title="Ganti Tema"
        >
          {isDarkMode ? <HiSun size={20} /> : <HiMoon size={20} />}
        </button>

        <NavNotification />
        <NavUserProfile />
      </div>
    </header>
  );
}