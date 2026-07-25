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
  HiOutlineEye,
  HiXMark
} from 'react-icons/hi2';

import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import PenghuniFormModal from './components/PenghuniFormModal';
import PageHeader from '../../components/ui/PageHeader';

export default function PenghuniListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPenghuni, setSelectedPenghuni] = useState(null);

  // State untuk Preview KTP Fullscreen (Murni React State)
  const [activeKtp, setActiveKtp] = useState(null); // { url, nama }

  // Master Data Penghuni
  const [penghuniList, setPenghuniList] = useState([
    {
      id: 101,
      nama: 'Budi Santoso',
      telepon: '081234567890',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'A-01',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 102,
      nama: 'Ahmad Dahlan',
      telepon: '081987654321',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'A-02',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 103,
      nama: 'Siti Nurhaliza',
      telepon: '085612348765',
      statusWarga: 'Kontrak',
      statusPernikahan: 'Belum Menikah',
      rumahSaatIni: 'B-01',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000'
    },
    {
      id: 104,
      nama: 'Eko Prasetyo',
      telepon: '082143658709',
      statusWarga: 'Tetap',
      statusPernikahan: 'Menikah',
      rumahSaatIni: 'Belum Menempati',
      fotoKtp: 'https://images.unsplash.com/photo-1544717305-2782549b5136?auto=format&fit=crop&q=80&w=1000'
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
      <PageHeader
        title="Kelola Penghuni"
        description="Data identitas warga, status perkawinan, nomor kontak, dan berkas KTP."
      >
        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Penghuni</span>
        </Button>
      </PageHeader>

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

      {/* Grid Cards (3 Kolom Desktop) */}
      {filteredPenghuni.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredPenghuni.map((warga) => (
            <div
              key={warga.id}
              className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
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
                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <HiOutlinePhone className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>{warga.telepon}</span>
                  </div>

                  <div className="flex items-center gap-2.5 text-slate-600 dark:text-slate-300">
                    <HiOutlineHeart className="w-4 h-4 text-slate-400 shrink-0" />
                    <span>Status: <strong className="font-semibold">{warga.statusPernikahan}</strong></span>
                  </div>
                </div>
              </div>

              {/* Footer Actions */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
                
                {/* Tombol Lihat KTP */}
                <button
                  type="button"
                  onClick={() => setActiveKtp({ url: warga.fotoKtp, nama: warga.nama })}
                  className="flex items-center gap-1.5 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 transition-colors cursor-pointer"
                >
                  <HiOutlineEye size={16} />
                  <span>Lihat KTP</span>
                </button>

                <div className="flex items-center gap-1">
                  <button
                    onClick={() => handleOpenEditModal(warga)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                    title="Edit Warga"
                  >
                    <HiOutlinePencilSquare size={16} />
                  </button>
                  <button
                    onClick={() => handleDelete(warga.id)}
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

      {/* Lightbox / Preview Foto KTP Fullscreen (Murni React) */}
      {activeKtp && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/90 backdrop-blur-md p-4 animate-in fade-in duration-200"
          onClick={() => setActiveKtp(null)}
        >
          {/* Header Title & Close Button Floating Top Right */}
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

          {/* Gambar KTP Fullscreen Centered */}
          <div className="relative max-w-4xl max-h-[85vh] w-full flex items-center justify-center">
            <img
              src={activeKtp.url}
              alt={`Foto KTP ${activeKtp.nama}`}
              className="max-w-full max-h-[85vh] rounded-xl object-contain shadow-2xl border border-slate-800"
              onClick={(e) => e.stopPropagation()} // Supaya klik gambar tidak mentrigger close
            />
          </div>
        </div>
      )}
    </div>
  );
}