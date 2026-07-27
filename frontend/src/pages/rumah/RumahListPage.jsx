import { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  HiOutlinePlus,
  HiMagnifyingGlass,
  HiOutlinePencilSquare,
  HiOutlineTrash,
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineReceiptPercent
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RumahFormModal from './components/RumahFormModal';
import RumahDetailDrawer from './components/RumahDetailDrawer';
import PageHeader from '../../components/ui/PageHeader';

export default function RumahListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);

  // State API Integrations
  const [rumahList, setRumahList] = useState([]);
  const [availablePenghuni, setAvailablePenghuni] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const fetchData = async () => {
    setIsLoading(true);
    try {
      const [responseRumah, responsePenghuni] = await Promise.all([
        api.get('/rumah'),
        api.get('/penghuni')
      ]);
      setRumahList(responseRumah.data.data);
      setAvailablePenghuni(responsePenghuni.data.data);
    } catch (error) {
      console.error("Gagal mengambil data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const filteredRumah = rumahList.filter((item) => {
    const matchesSearch =
      item.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penghuniNama.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'Semua' ? true : item.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

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

  // Fungsi Delete Terhubung API[cite: 6]
  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus data rumah ini?')) {
      try {
        await api.delete(`/rumah/${id}`);
        fetchData(); // Muat ulang data setelah dihapus
      } catch (error) {
        console.error("Gagal menghapus data rumah:", error);
        alert("Gagal menghapus data.");
      }
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
      } else {
        await api.post('/rumah', payload);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (error) {
      console.error("Gagal menyimpan data rumah:", error);
      alert(error.response?.data?.message || "Terjadi kesalahan saat menyimpan data.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
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
              placeholder="Cari no. rumah / penghuni..."
            />
          </div>

          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg shrink-0">
            {['Semua', 'Dihuni', 'Kosong'].map((tab) => (
              <button
                key={tab}
                onClick={() => setStatusFilter(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${statusFilter === tab
                    ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-xs'
                    : 'text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
                  }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Handling Status Loading[cite: 6] */}
        {isLoading ? (
          <div className="p-12 text-center text-sm text-slate-400">Memuat data perumahan...</div>
        ) : filteredRumah.length > 0 ? (
          <div className="p-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRumah.map((rumah) => (
              <div
                key={rumah.id}
                onClick={() => handleOpenDetail(rumah)}
                className="group p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 hover:bg-white dark:hover:bg-slate-800 transition-all cursor-pointer flex flex-col justify-between"
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
                          {rumah.penghuniNama}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1">
                      <span className="text-slate-400">Status Warga:</span>
                      <span className="font-medium text-slate-600 dark:text-slate-300">{rumah.tipePenghuni}</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                  <div className="flex items-center gap-1.5 text-xs text-slate-400">
                    <HiOutlineReceiptPercent size={15} />
                    <span>{rumah.historyPembayaran?.length || 0} Iuran</span>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => { e.stopPropagation(); handleOpenDetail(rumah); }}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Lihat Detail & History"
                    >
                      <HiOutlineEye size={16} />
                    </button>
                    <button
                      onClick={(e) => handleOpenEditModal(rumah, e)}
                      className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      title="Edit Unit"
                    >
                      <HiOutlinePencilSquare size={16} />
                    </button>
                    <button
                      onClick={(e) => handleDelete(rumah.id, e)}
                      className="p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                      title="Hapus Unit"
                    >
                      <HiOutlineTrash size={16} />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
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
    </div>
  );
}