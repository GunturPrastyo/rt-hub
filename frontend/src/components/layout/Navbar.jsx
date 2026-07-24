import { HiBars3, HiOutlineBell, HiOutlineUserCircle } from 'react-icons/hi2';

export default function Navbar({ onToggleSidebar }) {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-gray-100 bg-white/80 px-6 backdrop-blur-md dark:border-slate-700 dark:bg-slate-800/80">
      {/* Tombol Toggle Sidebar (Muncul di Mobile) */}
      <div className="flex items-center gap-4">
        <button
          onClick={onToggleSidebar}
          className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-slate-700 lg:hidden"
          aria-label="Toggle Sidebar"
        >
          <HiBars3 size={24} />
        </button>
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            Selamat Datang, Pak RT 👋
          </h2>
          <p className="text-xs text-gray-400">Sistem Pengelolaan Administrasi Perumahan</p>
        </div>
      </div>

      {/* Profil Ringkas */}
      <div className="flex items-center gap-4">
        <button className="relative rounded-full p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-slate-700">
          <HiOutlineBell size={22} />
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500"></span>
        </button>
        <div className="h-8 w-px bg-gray-200 dark:bg-slate-700"></div>
        <div className="flex items-center gap-3">
          <HiOutlineUserCircle size={36} className="text-gray-400 dark:text-gray-500" />
          <div className="hidden md:block">
            <p className="text-sm font-semibold text-gray-700 dark:text-gray-200">Admin RT 01</p>
            <p className="text-xs text-gray-400">Ketua RT</p>
          </div>
        </div>
      </div>
    </header>
  );
}