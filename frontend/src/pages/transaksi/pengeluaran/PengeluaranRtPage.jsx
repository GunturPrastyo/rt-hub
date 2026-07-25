import { useState } from 'react';
import { HiOutlinePlus, HiOutlineBanknotes, HiOutlineFunnel } from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import PengeluaranFormModal from './components/PengeluaranFormModal';

export default function PengeluaranRtPage() {
  const [selectedBulan, setSelectedBulan] = useState('Juli 2026');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [pengeluaranList, setPengeluaranList] = useState([
    {
      id: 1,
      keterangan: 'Gaji Satpam Malam Bulan Juli',
      kategori: 'Gaji & Keamanan',
      nominal: 1200000,
      tanggal: '2026-07-15',
      metode: 'Tunai'
    },
    {
      id: 2,
      keterangan: 'Pembelian Lampu & Perbaikan Fasum Pos Ronda',
      kategori: 'Perbaikan Fasum',
      nominal: 350000,
      tanggal: '2026-07-10',
      metode: 'Tunai'
    }
  ]);

  const handleSimpanPengeluaran = (data) => {
    const newTrans = {
      id: Date.now(),
      keterangan: data.keterangan,
      kategori: data.kategori,
      nominal: data.nominal,
      tanggal: data.tanggal,
      metode: 'Tunai'
    };
    setPengeluaranList((prev) => [newTrans, ...prev]);
    setIsModalOpen(false);
  };

  const totalPengeluaranBulanIni = pengeluaranList.reduce((acc, curr) => acc + curr.nominal, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Pengeluaran Operasional RT
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Pencatatan pengeluaran kas RT seperti gaji satpam, kebersihan, dan perbaikan fasilitas.
          </p>
        </div>

        <Button onClick={() => setIsModalOpen(true)} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Catat Pengeluaran</span>
        </Button>
      </div>

      {/* Ringkasan Banner Pengeluaran */}
      <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
        <div>
          <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengeluaran ({selectedBulan})</div>
          <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
            Rp {totalPengeluaranBulanIni.toLocaleString('id-ID')}
          </div>
        </div>
        <div className="w-11 h-11 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
          <HiOutlineBanknotes size={22} />
        </div>
      </div>

      {/* Tabel Pengeluaran */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Riwayat Pengeluaran</h2>
          <div className="flex items-center gap-2">
            <HiOutlineFunnel className="w-4 h-4 text-slate-400" />
            <select
              value={selectedBulan}
              onChange={(e) => setSelectedBulan(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100"
            >
              <option value="Juli 2026">Periode: Juli 2026</option>
              <option value="Juni 2026">Periode: Juni 2026</option>
            </select>
          </div>
        </div>

        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/40 font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">Tanggal</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3">Metode</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {pengeluaranList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{item.tanggal}</td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.kategori}</td>
                  <td className="px-4 py-3 text-slate-500">{item.keterangan}</td>
                  <td className="px-4 py-3 text-slate-400">{item.metode}</td>
                  <td className="px-4 py-3 text-right font-bold text-rose-600 dark:text-rose-400">
                    - Rp {item.nominal.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <PengeluaranFormModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSimpanPengeluaran}
      />
    </div>
  );
}