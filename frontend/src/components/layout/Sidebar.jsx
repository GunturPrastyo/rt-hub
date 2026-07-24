import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { 
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineUsers, 
  HiOutlineCreditCard, 
  HiOutlineReceiptPercent, 
  HiOutlineArrowTrendingDown, 
  HiOutlineChartBar, 
  HiChevronDown, 
  HiOutlineArrowLeftOnRectangle,
  HiBuildingStorefront
} from 'react-icons/hi2';

export default function Sidebar({ isOpen, onClose }) {
  const location = useLocation();
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(null);

  // Struktur Menu Aplikasi Administrasi RT
  const menu = [
    { heading: 'Menu Utama' },
    { 
      name: 'Dashboard', 
      icon: HiOutlineHome, 
      link: '/dashboard' 
    },

    { heading: 'Master Data RT' },
    { 
      name: 'Kelola Rumah', 
      icon: HiOutlineBuildingOffice2, 
      link: '/rumah' 
    },
    { 
      name: 'Kelola Penghuni', 
      icon: HiOutlineUsers, 
      link: '/penghuni' 
    },

    { heading: 'Keuangan & Transaksi' },
    {
      name: 'Transaksi',
      icon: HiOutlineCreditCard,
      children: [
        { name: 'Pemasukan Iuran', link: '/transaksi/iuran', icon: HiOutlineReceiptPercent },
        { name: 'Pengeluaran RT', link: '/transaksi/pengeluaran', icon: HiOutlineArrowTrendingDown },
      ],
    },
    { 
      name: 'Laporan Finansial', 
      icon: HiOutlineChartBar, 
      link: '/laporan' 
    },
  ];

  const toggleDropdown = (menuName) => {
    setOpenDropdown((prev) => (prev === menuName ? null : menuName));
  };

  // Auto expand dropdown jika URL anak aktif
  useEffect(() => {
    menu.forEach((item) => {
      if (item.children) {
        const isActive = item.children.some((child) => child.link === location.pathname);
        if (isActive) {
          setOpenDropdown(item.name);
        }
      }
    });

    // Otomatis menutup sidebar di tampilan mobile setelah link diklik
    if (typeof window !== 'undefined' && window.innerWidth < 1024) {
      if (onClose) onClose();
    }
  }, [location.pathname]);

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <>
      {/* Overlay Mobile */}
      {isOpen && (
        <div
          onClick={onClose}
          className="fixed inset-0 z-20 bg-black/50 transition-opacity lg:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-slate-800 shadow-lg transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
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

        {/* Menu Navigation */}
        <nav className="py-2 flex-1 overflow-y-auto text-sm custom-scrollbar">
          {menu.map((item, index) => (
            <div key={index} className="mb-1">
              {/* Category Heading */}
              {item.heading && (
                <div className="px-6 pt-4 pb-2 text-[11px] font-bold tracking-wider text-gray-400 dark:text-gray-500 uppercase">
                  {item.heading}
                </div>
              )}

              {/* Dropdown Menu Item */}
              {item.children ? (
                <div>
                  <button
                    onClick={() => toggleDropdown(item.name)}
                    className={`w-full flex items-center justify-between px-6 py-3 text-sm transition-colors border-l-4 ${
                      item.children.some((child) => child.link === location.pathname)
                        ? 'text-blue-600 bg-blue-50/50 dark:bg-blue-900/20 dark:text-blue-400 border-blue-600/50 font-semibold'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700/50 border-transparent'
                    }`}
                  >
                    <span className="flex items-center">
                      <item.icon size={20} className="mr-3" />
                      <span className="font-semibold">{item.name}</span>
                    </span>
                    <HiChevronDown
                      size={16}
                      className={`transition-transform duration-300 ${
                        openDropdown === item.name ? 'rotate-180' : ''
                      }`}
                    />
                  </button>

                  <div
                    className={`overflow-hidden transition-all duration-300 ${
                      openDropdown === item.name ? 'max-h-96' : 'max-h-0'
                    }`}
                  >
                    <div className="py-1 pl-12 pr-6 bg-gray-50/50 dark:bg-slate-900/30">
                      {item.children.map((child) => (
                        <Link
                          key={child.name}
                          to={child.link}
                          className={`flex items-center py-2.5 transition-colors ${
                            location.pathname === child.link
                              ? 'text-blue-600 dark:text-blue-400 font-semibold'
                              : 'text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400'
                          }`}
                        >
                          {child.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
              ) : item.link ? (
                /* Regular Link Item */
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
              ) : null}
            </div>
          ))}
        </nav>

        {/* Footer Logout Button */}
        <div className="w-full mt-auto shrink-0 border-t border-gray-100 dark:border-slate-700 bg-white dark:bg-slate-800">
          <button
            onClick={handleLogout}
            className="w-full flex items-center px-6 py-4 text-gray-600 dark:text-gray-300 hover:bg-red-50 dark:hover:bg-red-900/30 hover:text-red-600 dark:hover:text-red-400 transition-colors font-semibold"
          >
            <HiOutlineArrowLeftOnRectangle size={20} className="mr-3" />
            <span>Keluar</span>
          </button>
        </div>
      </aside>
    </>
  );
}