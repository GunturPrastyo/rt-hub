import { Link, useLocation, useNavigate } from 'react-router-dom';

import { 
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineUsers, 
  HiOutlineCreditCard, 
  HiOutlineChartBar, 
  HiOutlineArrowLeftOnRectangle,
  HiBuildingStorefront
} from 'react-icons/hi2';

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  // Struktur Menu
  const menu = [
    { heading: 'Menu Utama' },
    { name: 'Dashboard', icon: HiOutlineHome, link: '/dashboard' },
    
    { heading: 'Master Data RT' },
    { name: 'Rumah', icon: HiOutlineBuildingOffice2, link: '/rumah' },
    { name: 'Penghuni', icon: HiOutlineUsers, link: '/penghuni' },
    
    { heading: 'Keuangan & Transaksi' },
    { name: 'Transaksi', icon: HiOutlineCreditCard, link: '/transaksi' },
    { name: 'Laporan', icon: HiOutlineChartBar, link: '/laporan' },
  ];

  // Khusus Bottom Nav Mobile (hanya mengambil yang memiliki link)
  const navItems = menu.filter(item => item.link);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* =========================================
          1. DESKTOP SIDEBAR (Sembunyi di Mobile)
          ========================================= */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 shadow-lg flex-col border-r border-gray-100 dark:border-slate-700">
        
        {/* Header / Brand Logo */}
        <div className="flex items-center px-6 h-20 shrink-0 border-b border-gray-100 dark:border-slate-700">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white mr-3 shrink-0 shadow-md shadow-blue-500/20">
            <HiBuildingStorefront size={22} />
          </div>
          <div>
            <h1 className="text-base font-bold text-gray-800 dark:text-white leading-tight">
              Aplikasi RT
            </h1>
            <p className="text-xs text-gray-400">Sistem Administrasi RT</p>
          </div>
        </div>

        {/* Menu Navigation Desktop */}
        <nav className="py-2 flex-1 overflow-y-auto text-sm custom-scrollbar">
          {menu.map((item, index) => (
            <div key={index} className="mb-1">
              {item.heading && (
                <div className="px-6 pt-4 pb-2 text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  {item.heading}
                </div>
              )}
              {item.link && (
                <Link
                  to={item.link}
                  className={`flex items-center px-6 py-3 border-l-4 ${
                    location.pathname === item.link
                      ? 'text-blue-600 bg-blue-50 dark:bg-blue-900/30 dark:text-blue-300 border-blue-600 font-semibold'
                      : 'text-gray-600 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 transition-colors font-semibold border-transparent'
                  }`}
                >
                  <item.icon size={20} className="mr-3" />
                  <span>{item.name}</span>
                </Link>
              )}
            </div>
          ))}
        </nav>

        {/* Footer Logout Button */}
        <div className="w-full mt-auto shrink-0 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold cursor-pointer"
          >
            <HiOutlineArrowLeftOnRectangle size={20} className="mr-3" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>

      {/* =========================================
          2. MOBILE BOTTOM NAV (Muncul di Mobile)
          ========================================= */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-around pb-2 pt-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
        {navItems.map((item) => {
          const isActive = location.pathname === item.link;
          return (
            <Link
              key={item.name}
              to={item.link}
              className={`flex flex-col items-center justify-center w-full py-1 ${
                isActive 
                  ? 'text-blue-600 dark:text-blue-400' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-300'
              }`}
            >
              <div className={`p-1 rounded-2xl mb-1 transition-all duration-300 ${isActive ? 'bg-blue-100/50 dark:bg-blue-900/40 px-4' : 'px-2'}`}>
                <item.icon size={24} className={isActive ? 'stroke-2' : 'stroke-[1.5]'} />
              </div>
              <span className={`text-[10px] tracking-tight ${isActive ? 'font-bold' : 'font-medium'}`}>
                {item.name}
              </span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}