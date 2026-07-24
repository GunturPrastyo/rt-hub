import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineEye,
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RumahFormModal from './components/RumahFormModal';
import RumahDetailDrawer from './components/RumahDetailDrawer';

export default function RumahListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);

  // Master Data Penghuni (Daftar Warga yang Tersedia)
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
      status: 'Kosong',
      penghuniId: null,
      penghuniNama: '-',
      tipePenghuni: '-',
      historyPenghuni: [
        { nama: 'Ahmad Dahlan', periodeMasuk: 'Feb 2023', periodeKeluar: 'Juni 2026', statusKontrak: 'Selesai' }
      ],
      historyPembayaran: [
        { bulan: 'Juni 2026', nominal: 115000, status: 'Lunas', penghuniSaatItu: 'Ahmad Dahlan' }
      ]
    }
  ]);

  const filteredRumah = rumahList.filter(
    (item) =>
      item.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penghuniNama.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
      // Logic Update Data
      setRumahList((prev) =>
        prev.map((item) =>
          item.id === selectedRumah.id ? { ...item, ...data } : item
        )
      );
    } else {
      // Logic Create Data Baru
      const newRumah = {
        id: Date.now(),
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
            Kelola Rumah
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Daftar rumah, penetapan penghuni, dan riwayat iuran warga.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Rumah</span>
        </Button>
      </div>

      {/* Main Table */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="max-w-sm">
          <Input
            icon={HiMagnifyingGlass}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nomor rumah / penghuni..."
          />
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-sm text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/40 text-xs font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">No. Rumah</th>
                <th className="px-4 py-3">Status Hunian</th>
                <th className="px-4 py-3">Penghuni Utama</th>
                <th className="px-4 py-3">Tipe Penghuni</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRumah.map((rumah) => (
                <tr 
                  key={rumah.id} 
                  onClick={() => handleOpenDetail(rumah)}
                  className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors cursor-pointer"
                >
                  <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100">{rumah.nomorRumah}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={rumah.status === 'Dihuni' ? 'success' : 'warning'}>
                      {rumah.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">{rumah.penghuniNama}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{rumah.tipePenghuni}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1">
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleOpenDetail(rumah); }}
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Lihat Riwayat & Detail"
                      >
                        <HiOutlineEye size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleOpenEditModal(rumah, e)} 
                        className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                        title="Edit Data"
                      >
                        <HiOutlinePencilSquare size={18} />
                      </button>
                      <button 
                        onClick={(e) => handleDelete(rumah.id, e)} 
                        className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors"
                        title="Hapus"
                      >
                        <HiOutlineTrash size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal Form Tambah/Edit */}
      <RumahFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRumah}
        availablePenghuni={availablePenghuni}
      />

      {/* Drawer Detail & Riwayat (History Penghuni & Iuran) */}
      <RumahDetailDrawer
        isOpen={isDetailOpen}
        onClose={() => setIsDetailOpen(false)}
        rumah={selectedRumah}
      />
    </div>
  );
}