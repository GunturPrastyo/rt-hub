import { useNavigate } from 'react-router-dom';
import { HiChevronDown } from 'react-icons/hi2';

export default function NavUserProfile() {
  const navigate = useNavigate();
  const user = { name: 'Pak RT', role: 'Admin RT' };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div className="relative group">
      <button className="flex items-center gap-2 focus:outline-none">
        <img
          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=2563EB&color=fff`}
          alt="Avatar"
          className="w-10 h-10 rounded-full object-cover border-2 border-blue-500"
        />
        <div className="hidden md:block text-left">
          <div className="font-semibold text-sm text-gray-800 dark:text-white">{user.name}</div>
          <div className="text-xs text-gray-500 dark:text-gray-400">{user.role}</div>
        </div>
        <HiChevronDown size={16} className="text-gray-500 hidden md:block" />
      </button>

      <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-slate-800 rounded-md shadow-lg py-1 hidden group-hover:block z-20 border border-gray-100 dark:border-slate-700">
        <button
          onClick={handleLogout}
          className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/50 font-semibold transition-colors"
        >
          Keluar
        </button>
      </div>
    </div>
  );
}