import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { HiOutlinePlus, HiOutlineBanknotes, HiOutlineFunnel } from 'react-icons/hi2';
import Button from '../../../components/ui/Button';
import PengeluaranFormModal from './components/PengeluaranFormModal';
import PageHeader from '../../../components/ui/PageHeader';

export default function PengeluaranRtPage() {
  const [selectedBulan, setSelectedBulan] = useState('Juli 2026');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [pengeluaranList, setPengeluaranList] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

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
    try {
      await api.post('/pengeluaran', data);
      setIsModalOpen(false);
      fetchPengeluaran(); // Refresh data dari backend
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan pengeluaran');
    }
  };

  const totalPengeluaranBulanIni = pengeluaranList.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="space-y-6">
      <PageHeader title="Pengeluaran Operasional RT" description="Pencatatan pengeluaran kas RT seperti gaji satpam, kebersihan, dan perbaikan fasilitas.">
        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Catat Pengeluaran</span>
        </Button>
      </PageHeader>

      {/* Ringkasan Banner */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-lg shadow-sm flex items-center justify-between border border-slate-200 dark:border-slate-700">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengeluaran</div>
          <div className="text-2xl font-bold text-rose-600 mt-1">
            Rp {totalPengeluaranBulanIni.toLocaleString('id-ID')}
          </div>
        </div>
        <div className="w-11 h-11 rounded-lg bg-rose-100 text-rose-600 flex items-center justify-center">
          <HiOutlineBanknotes size={22} />
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
      />
    </div>
  );
}