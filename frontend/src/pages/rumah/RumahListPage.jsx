import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineEye,
  HiOutlineUser,
  HiOutlineHome,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineReceiptPercent
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RumahFormModal from './components/RumahFormModal';
import RumahDetailDrawer from './components/RumahDetailDrawer';

export default function RumahListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Semua');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);

  // Master Data Penghuni
  const [availablePenghuni] = useState([
    { id: 101, nama: 'Budi Santoso', statusWarga: 'Tetap', nik: '331002348210001' },
    { id: 102, nama: 'Ahmad Dahlan', statusWarga: 'Tetap', nik: '331002348210002' },
    { id: 103, nama: 'Siti Nurhaliza', statusWarga: 'Kontrak', nik: '331002348210003' },
    { id: 104, nama: 'Eko Prasetyo', statusWarga: 'Tetap', nik: '331002348210004' },
  ]);

  // Master Data Rumah + History
  const [rumahList, setRumahList] = useState([
    {
      id: 1,
      nomorRumah: 'A-01',
      blok: 'Blok A',
      status: 'Dihuni',
      penghuniId: 101,
      penghuniNama: 'Budi Santoso',
      tipePenghuni: 'Tetap',
      historyPenghuni: [
        { nama: 'Budi Santoso', periodeMasuk: 'Jan 2024', periodeKeluar: null, statusKontrak: 'Aktif' },
        { nama: 'Joko Widodo', periodeMasuk: 'Jan 2022', periodeKeluar: 'Des 2023', statusKontrak: 'Selesai' }
      ],
      historyPembayaran: [
        { bulan: 'Juli 2026', nominal: 115000, status: 'Lunas', penghuniSaatItu: 'Budi Santoso' },
        { bulan: 'Juni 2026', nominal: 115000, status: 'Lunas', penghuniSaatItu: 'Budi Santoso' },
        { bulan: 'Mei 2026', nominal: 115000, status: 'Belum Bayar', penghuniSaatItu: 'Budi Santoso' }
      ]
    },
    {
      id: 2,
      nomorRumah: 'A-02',
      blok: 'Blok A',
      status: 'Dihuni',
      penghuniId: 102,
      penghuniNama: 'Ahmad Dahlan',
      tipePenghuni: 'Tetap',
      historyPenghuni: [
        { nama: 'Ahmad Dahlan', periodeMasuk: 'Feb 2023', periodeKeluar: null, statusKontrak: 'Aktif' }
      ],
      historyPembayaran: [
        { bulan: 'Juli 2026', nominal: 115000, status: 'Lunas', penghuniSaatItu: 'Ahmad Dahlan' }
      ]
    },
    {
      id: 3,
      nomorRumah: 'A-03',
      blok: 'Blok A',
      status: 'Kosong',
      penghuniId: null,
      penghuniNama: '-',
      tipePenghuni: '-',
      historyPenghuni: [],
      historyPembayaran: []
    },
    {
      id: 4,
      nomorRumah: 'B-01',
      blok: 'Blok B',
      status: 'Dihuni',
      penghuniId: 103,
      penghuniNama: 'Siti Nurhaliza',
      tipePenghuni: 'Kontrak',
      historyPenghuni: [
        { nama: 'Siti Nurhaliza', periodeMasuk: 'Mar 2025', periodeKeluar: null, statusKontrak: 'Aktif' }
      ],
      historyPembayaran: [
        { bulan: 'Juli 2026', nominal: 115000, status: 'Belum Bayar', penghuniSaatItu: 'Siti Nurhaliza' }
      ]
    },
    {
      id: 5,
      nomorRumah: 'B-02',
      blok: 'Blok B',
      status: 'Kosong',
      penghuniId: null,
      penghuniNama: '-',
      tipePenghuni: '-',
      historyPenghuni: [],
      historyPembayaran: []
    }
  ]);

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

  const handleDelete = (id, e) => {
    e.stopPropagation();
    if (confirm('Apakah Anda yakin ingin menghapus data rumah ini?')) {
      setRumahList((prev) => prev.filter((item) => item.id !== id));
    }
  };

  const handleFormSubmit = (data) => {
    if (selectedRumah) {
      setRumahList((prev) =>
        prev.map((item) => (item.id === selectedRumah.id ? { ...item, ...data } : item))
      );
    } else {
      const newRumah = {
        id: Date.now(),
        blok: `Blok ${data.nomorRumah.charAt(0).toUpperCase()}`,
        ...data,
        historyPenghuni: data.penghuniNama !== '-' ? [
          { nama: data.penghuniNama, periodeMasuk: 'Juli 2026', periodeKeluar: null, statusKontrak: 'Aktif' }
        ] : [],
        historyPembayaran: []
      };
      setRumahList((prev) => [newRumah, ...prev]);
    }
    setIsModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Kelola Perumahan
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Status hunian rumah, penetapan warga, dan riwayat tagihan.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Rumah</span>
        </Button>
      </div>

      {/* Quick Summary Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <HiOutlineBuildingOffice2 size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Total Unit</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">{rumahList.length} Unit</div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <HiOutlineUserGroup size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Dihuni</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {rumahList.filter((r) => r.status === 'Dihuni').length} Rumah
            </div>
          </div>
        </div>

        <div className="p-4 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center gap-3 col-span-2 sm:col-span-1">
          <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <HiOutlineHome size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400">Rumah Kosong</div>
            <div className="text-lg font-bold text-slate-800 dark:text-slate-100">
              {rumahList.filter((r) => r.status === 'Kosong').length} Rumah
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
            placeholder="Cari no. rumah / penghuni..."
          />
        </div>

        <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-700/50 p-1 rounded-lg shrink-0">
          {['Semua', 'Dihuni', 'Kosong'].map((tab) => (
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

      {/* Grid Card Unit Rumah (3 Kolom Max di Desktop) */}
      {filteredRumah.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredRumah.map((rumah) => (
            <div
              key={rumah.id}
              onClick={() => handleOpenDetail(rumah)}
              className="group p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition-all cursor-pointer flex flex-col justify-between"
            >
              <div>
                {/* Header Card */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-700/60">
                  <div className="flex items-center gap-2">
                    <div className="w-9 h-9 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-sm">
                      {rumah.nomorRumah}
                    </div>
                    <div>
                      <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 block">
                        {rumah.blok || 'Unit Utama'}
                      </span>
                    </div>
                  </div>

                  <Badge variant={rumah.status === 'Dihuni' ? 'success' : 'warning'}>
                    {rumah.status}
                  </Badge>
                </div>

                {/* Body Card */}
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

              {/* Footer Card */}
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
        <div className="p-12 text-center bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <p className="text-sm text-slate-400">Tidak ada data rumah yang sesuai dengan kriteria pencarian.</p>
        </div>
      )}

      <RumahFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRumah}
        availablePenghuni={availablePenghuni}
      />

      <RumahDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        rumah={selectedRumah}
      />
    </div>
  );
}