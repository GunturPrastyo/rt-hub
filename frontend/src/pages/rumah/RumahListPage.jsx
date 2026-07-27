import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  HiOutlinePlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineReceiptPercent,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi2';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RumahFormModal from './components/RumahFormModal';
import RumahDetailDrawer from './components/RumahDetailDrawer';
import PageHeader from '../../components/ui/PageHeader';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import ToastNotification from '../../components/ui/ToastNotification';
import RumahCardSkeleton from './components/RumahCardSkeleton';

export default function RumahListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  
  // State API, Pagination, dan TRIGGER REFRESH
  const [rumahList, setRumahList] = useState([]);
  const [availablePenghuni, setAvailablePenghuni] = useState([]);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // Trigger khusus agar re-fetch
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);
  const [rumahToDelete, setRumahToDelete] = useState(null);

  // State Toast
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  useEffect(() => {
    const fetchRumahData = async () => {
      setIsLoading(true);
      try {
        // Eksekusi API secara paralel (termasuk memanggil status tunggakan iuran)
        const [responseRumah, responsePenghuni, responseIuran] = await Promise.all([
          api.get('/rumah', {
            params: {
              page: currentPage,
              search: searchQuery,
              status: statusFilter
            }
          }),
          api.get('/penghuni'),
          api.get('/iuran/status') // Memanggil status nunggak dari backend
        ]);
        
        const rawRumahList = responseRumah.data.data;
        const iuranList = responseIuran.data.data || [];

        // Gabungkan (Merge) data Rumah dengan status Iuran berdasarkan Nomor Rumah
        const enrichedRumahList = rawRumahList.map(rumah => {
          const iuranData = iuranList.find(i => i.nomorRumah === rumah.nomorRumah);
          return { ...rumah, iuranInfo: iuranData };
        });

        setRumahList(enrichedRumahList);
        setPagination(responseRumah.data.meta || {});
        setAvailablePenghuni(responsePenghuni.data.data);
      } catch (error) {
        console.error("Gagal mengambil data:", error);
        showToast('Gagal memuat data perumahan.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchRumahData();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  // Tambahkan refreshTrigger ke dependency agar auto-update saat form disubmit!
  }, [currentPage, searchQuery, statusFilter, refreshTrigger]); 


  const handleOpenAddModal = () => {
    setSelectedRumah(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rumah, e) => {
    e.stopPropagation();
    setSelectedRumah(rumah);
    setIsModalOpen(true);
  };

  const handleOpenDetail = (rumah) => {
    setSelectedRumah(rumah);
    setIsDetailOpen(true);
  };

  const handleDeleteClick = (rumah, e) => {
    e.stopPropagation();
    setRumahToDelete(rumah);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!rumahToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/rumah/${rumahToDelete.id}`);
      
      if (rumahList.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        setRefreshTrigger(prev => prev + 1); // Paksa Refresh
      }
      showToast('Data rumah berhasil dihapus.', 'success');
    } catch (error) {
      console.error("Gagal menghapus data rumah:", error);
      showToast('Gagal menghapus data.', 'error');
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setRumahToDelete(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    try {
      const payload = {
        nomor_rumah: data.nomorRumah,
        status: data.status,
        penghuni_id: data.penghuniId || null,
        blok: data.nomorRumah ? `Blok ${data.nomorRumah.charAt(0).toUpperCase()}` : null
      };

      if (selectedRumah) {
        await api.put(`/rumah/${selectedRumah.id}`, payload);
        showToast('Data rumah berhasil diperbarui.', 'success');
      } else {
        await api.post('/rumah', payload);
        showToast('Data rumah berhasil ditambahkan.', 'success');
        setCurrentPage(1); 
      }
      
      setIsModalOpen(false);
      setRefreshTrigger(prev => prev + 1); // Paksa refresh data tanpa reload browser!
      
    } catch (error) {
      console.error("Gagal menyimpan data rumah:", error);
      showToast(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.", 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Kelola Perumahan"
        description="Status hunian rumah, penetapan warga, dan riwayat tagihan."
      >
        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Rumah</span>
        </Button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-100 dark:border-slate-700/80">
          <div className="w-full sm:w-72">
            <Input
              icon={HiMagnifyingGlass}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari no. rumah..."
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg shrink-0">
            {['Semua', 'Dihuni', 'Kosong'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all cursor-pointer ${
                  statusFilter === tab
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, index) => (
              <RumahCardSkeleton key={index} />
            ))}
          </div>
        ) : rumahList.length > 0 ? (
          <>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {rumahList.map((rumah) => (
                <div
                  key={rumah.id}
                  onClick={() => handleOpenDetail(rumah)}
                  className="group p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between min-h-[200px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                      <div className="flex items-center gap-2 min-w-0">
                        <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm shrink-0 whitespace-nowrap">
                          {rumah.nomorRumah}
                        </div>
                        <div className="min-w-0">
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block truncate">
                            {rumah.blok || 'Unit Utama'}
                          </span>
                        </div>
                      </div>

                      <Badge variant={rumah.status === 'Dihuni' ? 'success' : 'warning'} className="shrink-0">
                        {rumah.status}
                      </Badge>
                    </div>

                    <div className="py-4 space-y-2">
                      <div className="flex items-start gap-2.5">
                        <HiOutlineUser size={18} className="text-slate-400 shrink-0 mt-0.5" />
                        <div>
                          <span className="text-[10px] text-slate-400 block">Penghuni Utama</span>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 line-clamp-1">
                            {rumah.penghuniNama || '-'}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center justify-between text-xs pt-1">
                        <span className="text-slate-400">Status Warga:</span>
                        <span className="font-medium text-slate-600 dark:text-slate-300">{rumah.tipePenghuni || '-'}</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    
                    {/* INDIKATOR IURAN (SUDAH DIPERBAIKI) */}
                    <div className="flex items-center gap-1.5 text-xs">
                      <HiOutlineReceiptPercent size={15} className="text-slate-400 shrink-0" />
                      {rumah.status === 'Dihuni' && rumah.iuranInfo ? (
                        (rumah.iuranInfo.tunggakan?.kebersihan > 0 || rumah.iuranInfo.tunggakan?.satpam > 0) ? (
                          <span className="text-rose-500 font-semibold truncate max-w-[120px]">
                            Nunggak {Math.max(rumah.iuranInfo.tunggakan.kebersihan, rumah.iuranInfo.tunggakan.satpam)} Bln
                          </span>
                        ) : (
                          <span className="text-emerald-600 dark:text-emerald-400 font-semibold">Iuran Lunas</span>
                        )
                      ) : (
                        <span className="text-slate-400">Belum ada tagihan</span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(rumah); }}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Lihat Detail & History"
                      >
                        <HiOutlineEye size={16} />
                      </button>
                      <button
                        onClick={(e) => handleOpenEditModal(rumah, e)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Unit"
                      >
                        <HiOutlinePencilSquare size={16} />
                      </button>
                      <button
                        onClick={(e) => handleDeleteClick(rumah, e)}
                        className="p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Unit"
                      >
                        <HiOutlineTrash size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* UI Pagination Dinamis */}
            {pagination.last_page > 1 && (
              <div className="px-5 py-4 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30 rounded-b-lg">
                <span className="text-xs text-slate-500 dark:text-slate-400">
                  Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.from || 0} - {pagination.to || 0}</span> dari total <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.total}</span> rumah
                </span>
                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                    disabled={currentPage === 1 || isLoading}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <HiChevronLeft className="w-4 h-4" />
                  </button>
                  <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 px-2">
                    Hal {currentPage} / {pagination.last_page}
                  </span>
                  <button
                    onClick={() => setCurrentPage(p => Math.min(pagination.last_page, p + 1))}
                    disabled={currentPage === pagination.last_page || isLoading}
                    className="p-2 rounded-lg bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors cursor-pointer"
                  >
                    <HiChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="p-12 text-center">
            <p className="text-sm text-slate-400">Tidak ada data rumah yang sesuai dengan kriteria pencarian.</p>
          </div>
        )}
      </div>

      <RumahFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRumah}
        availablePenghuni={availablePenghuni}
        rumahList={rumahList}
        isSubmitting={isSubmitting}
      />

      <RumahDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        rumah={selectedRumah}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Rumah"
        message={`Apakah Anda yakin ingin menghapus data rumah nomor "${rumahToDelete?.nomorRumah}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
        variant="danger"
      />

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={hideToast}
      />
    </div>
  );
}