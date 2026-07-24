import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlinePencilSquare, 
  HiOutlineTrash, 
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import Input from '../../components/ui/Input';
import RumahFormModal from './components/RumahFormModal';

export default function RumahListPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRumah, setSelectedRumah] = useState(null);

  const [rumahList, setRumahList] = useState([
    { id: 1, nomorRumah: 'A-01', status: 'Dihuni', penghuni: 'Budi Santoso', tipePenghuni: 'Tetap' },
    { id: 2, nomorRumah: 'A-02', status: 'Dihuni', penghuni: 'Ahmad Dahlan', tipePenghuni: 'Tetap' },
    { id: 3, nomorRumah: 'A-03', status: 'Kosong', penghuni: '-', tipePenghuni: '-' },
    { id: 4, nomorRumah: 'A-04', status: 'Dihuni', penghuni: 'Siti Nurhaliza', tipePenghuni: 'Kontrak' },
    { id: 5, nomorRumah: 'A-05', status: 'Dihuni', penghuni: 'Eko Prasetyo', tipePenghuni: 'Tetap' },
  ]);

  const filteredRumah = rumahList.filter(
    (item) =>
      item.nomorRumah.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.penghuni.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleOpenAddModal = () => {
    setSelectedRumah(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (rumah) => {
    setSelectedRumah(rumah);
    setIsModalOpen(true);
  };

  const handleDelete = (id) => {
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
      setRumahList((prev) => [{ id: Date.now(), ...data, tipePenghuni: data.status === 'Dihuni' ? 'Tetap' : '-' }, ...prev]);
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
            Daftar seluruh rumah perumahan, status keterhunian, dan pemilik/penghuni.
          </p>
        </div>

        <Button onClick={handleOpenAddModal} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Tambah Rumah</span>
        </Button>
      </div>

      {/* Table Container & Filter */}
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
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Penghuni Utama</th>
                <th className="px-4 py-3">Status Penghuni</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredRumah.map((rumah) => (
                <tr key={rumah.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3.5 font-bold text-slate-800 dark:text-slate-100">{rumah.nomorRumah}</td>
                  <td className="px-4 py-3.5">
                    <Badge variant={rumah.status === 'Dihuni' ? 'success' : 'warning'}>
                      {rumah.status}
                    </Badge>
                  </td>
                  <td className="px-4 py-3.5">{rumah.penghuni}</td>
                  <td className="px-4 py-3.5 text-xs text-slate-400">{rumah.tipePenghuni}</td>
                  <td className="px-4 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button onClick={() => handleOpenEditModal(rumah)} className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors">
                        <HiOutlinePencilSquare size={18} />
                      </button>
                      <button onClick={() => handleDelete(rumah.id)} className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/50 transition-colors">
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

      <RumahFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleFormSubmit}
        initialData={selectedRumah}
      />
    </div>
  );
}