import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { HiBell, HiExclamationTriangle, HiCheckCircle, HiXMark } from 'react-icons/hi2';
import api from '../../../services/api'; // Pastikan path import api ini benar sesuai struktur foldermu

export default function NavNotification() {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const dropdownRef = useRef(null);

  // Fetch Notifikasi dari Backend API
  const fetchNotifications = async () => {
    try {
      setIsLoading(true);
      const response = await api.get('/notifications');
      setNotifications(response.data.data || []);
    } catch (error) {
      console.error("Gagal memuat notifikasi:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // Muat data saat komponen pertama kali di-render
  useEffect(() => {
    fetchNotifications();
  }, []);

  // Menutup dropdown jika user klik di luar area
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const dismissNotification = (id, e) => {
    e.stopPropagation();
    // Hanya menghapus dari tampilan UI sementara (tidak dari database)
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
      >
        <HiBell size={20} />
        {notifications.length > 0 && !isLoading && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-500 text-white text-[10px] font-bold rounded-full">
            {notifications.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-gray-100 dark:border-slate-700 z-50 overflow-hidden">
          <div className="p-4 border-b border-gray-100 dark:border-slate-700 flex justify-between items-center bg-gray-50 dark:bg-slate-700/50">
            <h3 className="font-bold text-gray-800 dark:text-white text-sm">Notifikasi</h3>
            {notifications.length > 0 && (
              <button 
                onClick={() => setNotifications([])} 
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline cursor-pointer"
              >
                Tandai dibaca
              </button>
            )}
          </div>
          
          <div className="overflow-y-auto max-h-80 custom-scrollbar">
            {isLoading ? (
              <div className="p-6 text-center text-sm text-gray-500">Memuat notifikasi...</div>
            ) : notifications.length > 0 ? (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => { setIsOpen(false); navigate(n.link); }}
                  className="relative flex items-start p-4 border-b border-gray-50 dark:border-slate-700/50 hover:bg-gray-50 dark:hover:bg-slate-700/50 cursor-pointer group transition-colors"
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center mr-3 shrink-0 ${n.type === 'warning' ? 'bg-amber-100 text-amber-600 dark:bg-amber-900/40 dark:text-amber-500' : 'bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400'}`}>
                    {n.type === 'warning' ? <HiExclamationTriangle size={16} /> : <HiCheckCircle size={16} />}
                  </div>
                  <div className="pr-6">
                    <h4 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{n.title}</h4>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-2">{n.message}</p>
                    <span className="text-[10px] text-gray-400 font-medium block mt-1">{n.time}</span>
                  </div>
                  <button 
                    onClick={(e) => dismissNotification(n.id, e)} 
                    className="absolute top-4 right-4 text-gray-400 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    title="Tutup notifikasi ini"
                  >
                    <HiXMark size={16} />
                  </button>
                </div>
              ))
            ) : (
              <div className="p-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Tidak ada notifikasi baru.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}