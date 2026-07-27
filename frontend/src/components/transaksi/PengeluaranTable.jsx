import { useState, useEffect } from 'react';
import api from '../../services/api';
import { HiOutlinePlus } from 'react-icons/hi2';
import Button from '../ui/Button';
import PengeluaranFormModal from './PengeluaranModal';

export default function PengeluaranTable({ sisaSaldo, onTransactionSuccess }) {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchPengeluaran = async () => {
    try {
      const response = await api.get('/pengeluaran');
      setPengeluaranList(response.data.data);
    } catch (error) {
      console.error("Gagal memuat pengeluaran", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchPengeluaran();
  }, []);

  const handleSimpanPengeluaran = async (data) => {
    setIsSubmitting(true);
    try {
      await api.post('/pengeluaran', data);
      setIsModalOpen(false);
      fetchPengeluaran(); 
      // Panggil fungsi ini agar 3 kartu summary di halaman induk ikut ter-update
      if (onTransactionSuccess) onTransactionSuccess(); 
    } catch (error) {
      console.error(error);
      // Tangkap pesan ValidationException dari Laravel agar muncul ke user jika di-bypass
      alert(error.response?.data?.message || 'Gagal menyimpan pengeluaran');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="p-2 space-y-6">
      {/* Header Halaman Responsif */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-lg sm:text-2xl font-bold text-gray-800 dark:text-white">
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

      {/* Tabel Pengeluaran */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700 space-y-4">
        {isLoading ? (
          <p className="text-center text-sm text-slate-400">Memuat data pengeluaran...</p>
        ) : pengeluaranList.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">Tanggal</th>
                  <th className="px-4 py-3">Kategori</th>
                  <th className="px-4 py-3">Keterangan</th>
                  <th className="px-4 py-3 text-right">Nominal</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {pengeluaranList.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 text-slate-500">{item.tanggal}</td>
                    <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.kategori}</td>
                    <td className="px-4 py-3 text-slate-500">{item.keterangan}</td>
                    <td className="px-4 py-3 text-right font-bold text-rose-600">
                      - Rp {item.nominal.toLocaleString('id-ID')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p className="text-center text-sm text-slate-400 py-4">Belum ada catatan pengeluaran.</p>
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