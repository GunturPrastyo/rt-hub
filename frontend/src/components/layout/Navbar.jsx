import { useState, useEffect } from 'react';
import { HiBars3, HiSun, HiMoon } from 'react-icons/hi2';

import NavSearchBar from './components/NavSearchBar';
import NavNotification from './components/NavNotification';
import NavUserProfile from './components/NavUserProfile';

export default function Navbar({ onToggleSidebar }) {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem('color-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme === 'dark' || (!savedTheme && prefersDark)) {
      setIsDarkMode(true);
      document.documentElement.classList.add('dark');
    } else {
      setIsDarkMode(false);
      document.documentElement.classList.remove('dark');
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
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm sticky top-0 z-10 transition-colors duration-200">
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
        {/* Tombol Toggle Tema */}
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors focus:outline-none"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? (
            <HiSun size={20} className="text-slate-200" />
          ) : (
            <HiMoon size={20} className="text-slate-600" />
          )}
        </button>

        <NavNotification />
        <NavUserProfile />
      </div>
    </header>
  );
}