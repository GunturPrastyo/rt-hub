import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlinePlus, HiMagnifyingGlass, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Button from '../ui/Button';
import Input from '../ui/Input';
import PengeluaranFormModal from './PengeluaranModal';

export default function PengeluaranTable({ sisaSaldo, onTransactionSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Pagination & Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery]);

  useEffect(() => {
    const fetchPengeluaran = async () => {
      setIsLoading(true);
      try {
        const response = await api.get('/pengeluaran', {
          params: { page: currentPage, search: searchQuery }
        });
        setPengeluaranList(response.data.data);
        setPagination(response.data.meta || {});
      } catch (error) {
        console.error("Gagal memuat pengeluaran", error);
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPengeluaran();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [currentPage, searchQuery, refreshTrigger]);

  const handleSimpanPengeluaran = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/pengeluaran', data);
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Trigger refresh otomatis
      if (onTransactionSuccess) onTransactionSuccess(); 
    } catch (error) {
      console.error(error);
      alert(error.response?.data?.message || 'Gagal menyimpan pengeluaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-xl font-bold text-gray-800 dark:text-white">
            Pengeluaran Operasional RT
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Pencatatan pengeluaran kas RT seperti gaji satpam, kebersihan, dan perbaikan fasilitas.
          </p>
        </div>
        <div className="flex-shrink-0">
          <Button onClick={() => setIsModalOpen(true)} variant="primary">
            <HiOutlinePlus size={18} />
            <span>Catat Pengeluaran</span>
          </Button>
        </div>
      </div>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        <div className="mb-2 w-full sm:w-72">
          <Input
            icon={HiMagnifyingGlass}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari keterangan / kategori..."
          />
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-8">Memuat data pengeluaran...</p>
        ) : (
          <>
            <div className="overflow-x-auto custom-scrollbar">
              <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
                <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-400 border-b border-slate-100 dark:border-slate-700 uppercase">
                  <tr>
                    <th className="px-4 py-3">Tanggal</th>
                    <th className="px-4 py-3">Kategori</th>
                    <th className="px-4 py-3">Keterangan</th>
                    <th className="px-4 py-3 text-right">Nominal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                  {pengeluaranList.length > 0 ? (
                    pengeluaranList.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                        <td className="px-4 py-3 text-slate-500">{item.tanggal}</td>
                        <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.kategori}</td>
                        <td className="px-4 py-3 text-slate-500">{item.keterangan}</td>
                        <td className="px-4 py-3 text-right font-bold text-rose-600">
                          - Rp {item.nominal.toLocaleString('id-ID')}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-6 text-slate-400">Belum ada catatan pengeluaran.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* UI Pagination Dinamis */}
            {pagination.last_page > 1 && (
              <div className="pt-4 mt-2 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between">
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

      <PengeluaranFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSimpanPengeluaran}
        sisaSaldo={sisaSaldo}
        isSubmitting={isSubmitting}
      />
    </div>
  );
}