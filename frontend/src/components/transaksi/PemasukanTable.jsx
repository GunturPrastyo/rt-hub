import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlinePlus, HiMagnifyingGlass, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Badge from '../ui/Badge';
import Button from '../ui/Button';
import Input from '../ui/Input';
import BayarIuranModal from './PemasukanModal';

export default function PemasukanTable({ onTransactionSuccess }) {
  const [selectedBulan, setSelectedBulan] = useState(
    () => new Date().toLocaleString('id-ID', { month: 'long', year: 'numeric' })
  );
  const [searchWargaQuery, setSearchWargaQuery] = useState('');
  const [isBayarModalOpen, setIsBayarModalOpen] = useState(false);
  const [statusIuranWarga, setStatusIuranWarga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Pagination & Refresh State
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Reset ke halaman 1 jika user mengetik pencarian
  useEffect(() => {
    setCurrentPage(1);
  }, [searchWargaQuery]);

  useEffect(() => {
    const fetchStatusIuran = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/iuran/status', {
          params: { page: currentPage, search: searchWargaQuery }
        });
        setStatusIuranWarga(response.data.data);
        setPagination(response.data.meta || {});
      } catch (error) {
        console.error("Gagal memuat status iuran", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchStatusIuran();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchWargaQuery, refreshTrigger]);

  const handleSimpanPemasukan = async (data) => {
    try {
      await api.post('/iuran', data);
      setIsBayarModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh otomatis
      if (onTransactionSuccess) onTransactionSuccess();
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan pembayaran');
    }
  };

  const renderStatusBadge = (statusText) => {
    if (statusText.includes('Nunggak')) {
      return <Badge variant="danger">{statusText}</Badge>;
    }
    if (statusText.includes('Lebih')) {
      return (
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 dark:bg-blue-900/50 dark:text-blue-300">
          {statusText}
        </span>
      );
    }
    return <Badge variant="success">{statusText}</Badge>;
  };

  return (
    <div className="p-2 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Pemasukan Iuran Warga
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Monitoring pembayaran iuran kebersihan dan satpam.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => setIsBayarModalOpen(true)} variant="primary">
            <HiOutlinePlus size={18} />
            <span>Bayar Iuran</span>
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-4 w-full sm:w-72">
          <Input
            icon={HiMagnifyingGlass}
            value={searchWargaQuery}
            onChange={(e) => setSearchWargaQuery(e.target.value)}
            placeholder="Cari nama / no rumah..."
          />
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-8">Memuat data status iuran warga...</p>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">No. Rumah</th>
                    <th className="px-4 py-3">Nama Warga</th>
                    <th className="px-4 py-3">Status Iuran Kebersihan</th>
                    <th className="px-4 py-3">Status Iuran Satpam</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {statusIuranWarga.length > 0 ? (
                    statusIuranWarga.map((warga) => (
                      <tr key={warga.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{warga.nomorRumah}</td>
                        <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{warga.nama}</td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {renderStatusBadge(warga.kebersihanStatus)}
                        </td>
                        <td className="px-4 py-3 whitespace-nowrap">
                          {renderStatusBadge(warga.satpamStatus)}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-400">Tidak ada data warga yang menempati rumah saat ini.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* UI Pagination Dinamis */}
            {pagination.last_page > 1 && (
              <div className="pt-4 mt-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.from || 0} - {pagination.to || 0}</span> dari total <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.total}</span> data
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <HiChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 px-2">
                    Hal {currentPage} / {pagination.last_page}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={currentPage === pagination.last_page || isLoading}
                    className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600 disabled:opacity-50 transition-colors cursor-pointer"
                  >
                    <HiChevronRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      <BayarIuranModal
        isOpen={isBayarModalOpen}
        onClose={() => setIsBayarModalOpen(false)}
        onSubmit={handleSimpanPemasukan}
        availablePenghuni={statusIuranWarga}
        selectedBulan={selectedBulan}
      />
    </div>
  );
}