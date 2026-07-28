import { useState, useEffect } from 'react';
import api from '../../services/api'; 
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlinePhone,
  HiOutlineHeart,
  HiOutlineEye,
  HiXMark,
  HiChevronLeft,
  HiChevronRight
} from 'react-icons/hi2';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PenghuniFormModal from './components/PenghuniFormModal';
import ConfirmationModal from '../../components/ui/ConfirmationModal';
import PenghuniCardSkeleton from './components/PenghuniCardSkeleton';
import PageHeader from '../../components/ui/PageHeader';
import ToastNotification from '../../components/ui/ToastNotification'; 

export default function PenghuniListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  
  // State API, Pagination, dan TRIGGER REFRESH
  const [penghuniList, setPenghuniList] = useState([]); 
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [refreshTrigger, setRefreshTrigger] = useState(0); // <-- TAMBAHAN BARU
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // State Modals
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [penghuniToDelete, setPenghuniToDelete] = useState(null);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  const [activeKtp, setActiveKtp] = useState(null);

  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  // Reset ke halaman 1 jika kata kunci pencarian atau filter status berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, statusFilter]);

  // Fetch API menggunakan Debounce 
  useEffect(() => {
    const fetchPenghuni = async () => {
      try {
        setIsLoading(true);
        // Kirim Parameter ke Backend
        const response = await api.get('/penghuni', {
          params: { 
            page: currentPage, 
            search: searchQuery, 
            status: statusFilter 
          }
        });
        
        // Simpan data dan metadata pagination
        setPenghuniList(response.data.data);
        setPagination(response.data.meta || {});
      } catch (error) {
        console.error("Gagal mengambil data penghuni:", error);
        showToast('Gagal mengambil data penghuni.', 'error');
      } finally {
        setIsLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchPenghuni();
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  // Pastikan refreshTrigger masuk ke dalam array dependency!
  }, [currentPage, searchQuery, statusFilter, refreshTrigger]); 


  const handleOpenAddModal = () => {
    setSelectedPenghuni(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (penghuni) => {
    setSelectedPenghuni(penghuni);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (penghuni) => {
    setPenghuniToDelete(penghuni);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!penghuniToDelete) return;

    setIsDeleting(true);
    try {
      await api.delete(`/penghuni/${penghuniToDelete.id}`);
      
      // Jika data terakhir di halaman dihapus, mundur 1 halaman (kecuali halaman 1)
      if (penghuniList.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      } else {
        // Trigger refetch di halaman saat ini
        setRefreshTrigger(prev => prev + 1);
      }
      
      showToast('Data penghuni berhasil dihapus.', 'success');
    } catch (error) {
      console.error("Gagal menghapus data:", error);
      showToast('Gagal menghapus data.', 'error');
    } finally {
      setIsDeleting(false);
      setIsConfirmModalOpen(false);
      setPenghuniToDelete(null);
    }
  };

  const handleFormSubmit = async (data) => {
    setIsSubmitting(true);
    
    const formData = new FormData();
    formData.append('nama', data.nama);
    formData.append('telepon', data.telepon);
    formData.append('status_warga', data.statusWarga); 
    formData.append('status_pernikahan', data.statusPernikahan);
    
    if (data.fotoKtpFile) {
        formData.append('foto_ktp', data.fotoKtpFile);
    }

    try {
      if (selectedPenghuni) {
        formData.append('_method', 'PUT'); 

        await api.post(`/penghuni/${selectedPenghuni.id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        }); 
        showToast('Data penghuni berhasil diperbarui.', 'success');
      } else {
        await api.post('/penghuni', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        showToast('Data penghuni berhasil ditambahkan.', 'success');
        setCurrentPage(1); // Kembali ke halaman 1 jika nambah data baru
      }
      setIsModalOpen(false);
      
      // Paksa refresh data tanpa harus menekan F5
      setRefreshTrigger(prev => prev + 1); 
      
    } catch (error) {
       console.error("Gagal menyimpan data:", error);
       showToast('Terjadi kesalahan saat menyimpan data.', 'error');
    } finally {
       setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Kelola Penghuni"
        description="Data identitas warga, status perkawinan, nomor kontak, dan berkas KTP."
      >
        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Penghuni</span>
        </Button>
      </PageHeader>

      <div className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-100 dark:border-slate-700/80">
          <div className="w-full sm:w-72">
            <Input
              icon={HiMagnifyingGlass}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama / nomor WA..."
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg shrink-0">
            {['Semua', 'Tetap', 'Kontrak'].map((tab) => (
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
               <PenghuniCardSkeleton key={index} />
             ))}
           </div>
        ) : penghuniList.length > 0 ? (
          <>
            <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {penghuniList.map((warga) => (
                <div
                  key={warga.id}
                  className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between min-h-[210px]"
                >
                  <div>
                    <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
                      <div className="min-w-0">
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">
                          {warga.nama}
                        </h3>
                        <span className="text-[11px] text-slate-400 block mt-0.5">
                          Rumah: <span className="font-semibold text-slate-600 dark:text-slate-300 whitespace-nowrap">{warga.rumahSaatIni}</span>
                        </span>
                      </div>

                      <Badge variant={warga.statusWarga === 'Tetap' ? 'success' : 'warning'} className="shrink-0">
                        {warga.statusWarga}
                      </Badge>
                    </div>

                    <div className="py-4 space-y-2.5 text-xs">
                      <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <HiOutlinePhone className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>{warga.telepon}</span>
                      </div>

                      <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                        <HiOutlineHeart className="w-4 h-4 text-slate-600 shrink-0" />
                        <span>Status: <strong className="font-semibold">{warga.statusPernikahan}</strong></span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                    {warga.fotoKtp ? (
                      <button
                        type="button"
                        onClick={() => setActiveKtp({ url: warga.fotoKtp, nama: warga.nama })}
                        className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                      >
                        <HiOutlineEye size={16} />
                        <span>Lihat KTP</span>
                      </button>
                    ) : (
                      <span className="text-xs text-slate-400 italic">Tidak ada KTP</span>
                    )}

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenEditModal(warga)}
                        className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                        title="Edit Warga"
                      >
                        <HiOutlinePencilSquare size={16} />
                      </button>
                      <button
                        onClick={() => handleDeleteClick(warga)}
                        className="p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors cursor-pointer"
                        title="Hapus Warga"
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
                  Menampilkan <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.from || 0} - {pagination.to || 0}</span> dari total <span className="font-semibold text-slate-700 dark:text-slate-200">{pagination.total}</span> warga
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
            <p className="text-sm text-slate-400">Tidak ada data penghuni yang ditemukan.</p>
          </div>
        )}
      </div>

      <PenghuniFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPenghuni}
        isSubmitting={isSubmitting}
      />

      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Konfirmasi Hapus Penghuni"
        message={`Apakah Anda yakin ingin menghapus data penghuni bernama "${penghuniToDelete?.nama}"? Tindakan ini tidak dapat dibatalkan.`}
        confirmText="Ya, Hapus"
        isConfirming={isDeleting}
        variant="danger"
      />

      {activeKtp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveKtp(null)}
        >
          <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-10 flex items-center gap-3">
            <span className="text-xs font-semibold text-slate-300 bg-slate-900/80 px-3 py-1.5 rounded-lg border border-slate-700/60">
              KTP - {activeKtp.nama}
            </span>
            <button
              onClick={() => setActiveKtp(null)}
              className="p-2 rounded-xl bg-slate-900/80 border border-slate-700/60 text-slate-300 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
              title="Tutup (Esc)"
            >
              <HiXMark size={22} />
            </button>
          </div>
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={activeKtp.url}
              alt={`Foto KTP ${activeKtp.nama}`}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()} 
            />
          </div>
        </div>
      )}

      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={hideToast}
      />
    </div>
  );
}