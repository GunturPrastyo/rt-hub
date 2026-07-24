import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlinePhone,
  HiOutlineUserGroup,
  HiOutlineUsers,
  HiOutlineHeart,
  HiOutlineEye
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import Modal from '../../components/ui/Modal';
import PenghuniFormModal from './components/PenghuniFormModal';

export default function PenghuniListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua'); // 'Semua' | 'Tetap' | 'Kontrak'
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);
  
  // State Preview Foto KTP Modal
  const [previewKtpUrl, setPreviewKtpUrl] = useState(null);

  // Master Data Penghuni
  const [penghuniList, setPenghuniList] = useState([
    {
      id: 101,
      nama: 'Budi Santoso',
      telepon: '081234567890',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'A-01',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 102,
      nama: 'Ahmad Dahlan',
      telepon: '081987654321',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'A-02',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 103,
      nama: 'Siti Nurhaliza',
      telepon: '085612348765',
      statusWarga: 'Kontrak',
      statusPernikahan: 'Belum Menikah',
      rumahSaatIni: 'B-01',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'
    },
    {
      id: 104,
      nama: 'Eko Prasetyo',
      telepon: '082143658709',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'Belum Menempati',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=600'
    }
  ]);

  // Filter Data
  const filteredPenghuni = penghuniList.filter((item) => {
    const matchesSearch = 
      item.nama.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.telepon.includes(searchQuery);
    
    const matchesStatus = 
      statusFilter === 'Semua' ? true : item.statusWarga === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const handleOpenAddModal = () => {
    setSelectedPenghuni(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (penghuni) => {
    setSelectedPenghuni(penghuni);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
    if (confirm('Apakah Anda yakin ingin menghapus data penghuni ini?')) {
      setPenghuniList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFormSubmit = (data) => {
    if (selectedPenghuni) {
      setPenghuniList((prev) =>
        prev.map((item) => (item.id === selectedPenghuni.id ? { ...item, ...data } : item))
      );
    } else {
      const newPenghuni = {
        id: Date.now(),
        rumahSaatIni: 'Belum Menempati',
        ...data,
      };
      setPenghuniList((prev) => [newPenghuni, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header & Primary Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Kelola Penghuni
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Data identitas warga, status perkawinan, nomor kontak, dan berkas KTP.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Penghuni</span>
        </Button>
      </div>

      {/* Ringkasan Statistik */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <HiOutlineUsers size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Penghuni</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{penghuniList.length} Jiwa</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <HiOutlineUserGroup size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Warga Tetap</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {penghuniList.filter((p) => p.statusWarga === 'Tetap').length} Orang
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <HiOutlineUserGroup size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Warga Kontrak</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {penghuniList.filter((p) => p.statusWarga === 'Kontrak').length} Orang
            </div>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
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
              className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-all ${
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

      {/* Grid Cards (3 Kolom Desktop) */}
      {filteredPenghuni.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPenghuni.map((warga) => (
            <div
              key={warga.id}
              className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header Card: Nama & Badge Status */}
                <div className="flex items-start justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div>
                    <h3 className="text-base font-bold text-slate-800 dark:text-slate-100">
                      {warga.nama}
                    </h3>
                    <span className="text-[11px] text-slate-400 block mt-0.5">
                      Rumah: <span className="font-semibold text-slate-600 dark:text-slate-300">{warga.rumahSaatIni}</span>
                    </span>
                  </div>

                  <Badge variant={warga.statusWarga === 'Tetap' ? 'success' : 'warning'}>
                    {warga.statusWarga}
                  </Badge>
                </div>

                {/* Body Card Details */}
                <div className="py-4 space-y-2.5 text-xs">
                  {/* Telepon */}
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <HiOutlinePhone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{warga.telepon}</span>
                  </div>

                  {/* Status Pernikahan */}
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <HiOutlineHeart className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Status: <strong className="font-semibold">{warga.statusPernikahan}</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer Actions: Lihat KTP & Edit/Delete */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                <button
                  onClick={() => setPreviewKtpUrl(warga.fotoKtp)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                >
                  <HiOutlineEye size={16} />
                  <span>Lihat KTP</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(warga)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                    title="Edit Warga"
                  >
                    <HiOutlinePencilSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(warga.id)}
                    className="p-1.5 rounded-md text-rose-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                    title="Hapus Warga"
                  >
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <p className="text-sm text-slate-400">Tidak ada data penghuni yang sesuai.</p>
        </div>
      )}

      {/* Modal Form Tambah/Edit */}
      <PenghuniFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedPenghuni}
      />

      {/* Modal Preview Foto KTP */}
      <Modal isOpen={!!previewKtpUrl} onClose={() => setPreviewKtpUrl(null)} title="Berkas Foto KTP">
        <div className="space-y-4">
          <img
            src={previewKtpUrl}
            alt="Foto KTP Penghuni"
            className="w-full rounded-lg border border-slate-200 dark:border-slate-700 object-cover max-h-80"
          />
          <div className="flex justify-end">
            <Button variant="secondary" onClick={() => setPreviewKtpUrl(null)}>
              Tutup
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
}