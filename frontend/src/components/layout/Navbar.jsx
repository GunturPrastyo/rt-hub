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
    <header className="flex items-center justify-between h-20 px-6 bg-white dark:bg-slate-800 border-b border-gray-100 dark:border-slate-700 shadow-sm sticky top-0 z-10 gap-4">
      {/* Sisi Kiri: Hamburger Button + Max-Width Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-full">
        <button
          onClick={onToggleSidebar}
          className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-none shrink-0"
          aria-label="Toggle Sidebar"
          title="Toggle Sidebar"
        >
          <HiBars3 size={24} />
        </button>

        <NavSearchBar />
      </div>

      {/* Sisi Kanan: Theme Toggle, Notifications, User Profile */}
      <div className="flex items-center gap-3 shrink-0">
        <button
          onClick={toggleDarkMode}
          className="p-2.5 rounded-full text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors focus:outline-none"
          title={isDarkMode ? 'Beralih ke Mode Terang' : 'Beralih ke Mode Gelap'}
        >
          {isDarkMode ? <HiSun size={20} className="text-amber-400" /> : <HiMoon size={20} />}
        </button>

        <NavNotification />
        <NavUserProfile />
      </div>
    </header>
  );
}