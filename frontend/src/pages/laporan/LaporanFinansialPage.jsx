import { useState } from 'react';
import { 
  HiOutlineArrowUpRight, 
  HiOutlineArrowDownLeft, 
  HiOutlineScale,
  HiOutlineFunnel
} from 'react-icons/hi2';
import Badge from '../../components/ui/Badge';

export default function LaporanFinansialPage() {
  const [selectedBulan, setSelectedBulan] = useState('Juli 2026');

  const reportTahunan = [
    { bulan: 'Jan', pemasukan: 3500000, pengeluaran: 1800000 },
    { bulan: 'Feb', pemasukan: 3200000, pengeluaran: 2100000 },
    { bulan: 'Mar', pemasukan: 4100000, pengeluaran: 1500000 },
    { bulan: 'Apr', pemasukan: 3800000, pengeluaran: 2800000 },
    { bulan: 'Mei', pemasukan: 3600000, pengeluaran: 1900000 },
    { bulan: 'Jun', pemasukan: 4500000, pengeluaran: 2200000 },
    { bulan: 'Jul', pemasukan: 5200000, pengeluaran: 2400000 },
    { bulan: 'Agt', pemasukan: 0, pengeluaran: 0 },
    { bulan: 'Sep', pemasukan: 0, pengeluaran: 0 },
    { bulan: 'Okt', pemasukan: 0, pengeluaran: 0 },
    { bulan: 'Nov', pemasukan: 0, pengeluaran: 0 },
    { bulan: 'Des', pemasukan: 0, pengeluaran: 0 },
  ];

  const totalPemasukan = reportTahunan.reduce((acc, curr) => acc + curr.pemasukan, 0);
  const totalPengeluaran = reportTahunan.reduce((acc, curr) => acc + curr.pengeluaran, 0);
  const sisaSaldo = totalPemasukan - totalPengeluaran;

  const mutasiList = [
    { id: 1, jenis: 'Pemasukan', kategori: 'Iuran Kebersihan', ket: 'Budi Santoso (A-01)', nominal: 500000, tgl: '2026-07-20' },
    { id: 2, jenis: 'Pengeluaran', kategori: 'Gaji & Keamanan', ket: 'Gaji Satpam Malam', nominal: 1200000, tgl: '2026-07-15' },
  ];

  const maxVal = Math.max(...reportTahunan.map((d) => Math.max(d.pemasukan, d.pengeluaran)), 6000000);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">
          Laporan Finansial Kas RT
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Ringkasan arus kas, grafik tahunan, serta rekapitulasi mutasi bulanan.
        </p>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pemasukan</div>
            <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 mt-1">
              Rp {totalPemasukan.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-emerald-100 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center shrink-0">
            <HiOutlineArrowDownLeft size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Pengeluaran</div>
            <div className="text-2xl font-bold text-rose-600 dark:text-rose-400 mt-1">
              Rp {totalPengeluaran.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 flex items-center justify-center shrink-0">
            <HiOutlineArrowUpRight size={22} />
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sisa Saldo Kas RT</div>
            <div className="text-2xl font-bold text-slate-800 dark:text-slate-100 mt-1">
              Rp {sisaSaldo.toLocaleString('id-ID')}
            </div>
          </div>
          <div className="w-11 h-11 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center shrink-0">
            <HiOutlineScale size={22} />
          </div>
        </div>
      </div>

      {/* Grafik Bar Chart 1 Tahun */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700 pb-4">
          <div>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Grafik Arus Kas (Tahun 2026)</h2>
            <p className="text-xs text-slate-400">Visualisasi pemasukan vs pengeluaran per bulan.</p>
          </div>
        </div>

        <div className="h-56 flex items-end justify-between gap-2 pt-6 pb-2 px-2 border-b border-slate-100 dark:border-slate-700/60 overflow-x-auto custom-scrollbar">
          {reportTahunan.map((item, idx) => {
            const hPemasukan = (item.pemasukan / maxVal) * 100;
            const hPengeluaran = (item.pengeluaran / maxVal) * 100;

            return (
              <div key={idx} className="flex-1 min-w-[36px] flex flex-col items-center gap-2 group relative">
                <div className="w-full flex items-end justify-center gap-1 h-40">
                  <div style={{ height: `${hPemasukan}%` }} className="w-1/2 bg-emerald-500 rounded-t-xs hover:bg-emerald-600 transition-all min-h-[4px]" />
                  <div style={{ height: `${hPengeluaran}%` }} className="w-1/2 bg-rose-500 rounded-t-xs hover:bg-rose-600 transition-all min-h-[4px]" />
                </div>
                <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{item.bulan}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mutasi Detail */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Detail Mutasi Transaksi</h2>
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
                <th className="px-4 py-3">Jenis</th>
                <th className="px-4 py-3">Kategori</th>
                <th className="px-4 py-3">Keterangan</th>
                <th className="px-4 py-3 text-right">Nominal</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {mutasiList.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{item.tgl}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.jenis === 'Pemasukan' ? 'success' : 'danger'}>{item.jenis}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.kategori}</td>
                  <td className="px-4 py-3 text-slate-500">{item.ket}</td>
                  <td className={`px-4 py-3 text-right font-bold ${item.jenis === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.jenis === 'Pemasukan' ? '+' : '-'} Rp {item.nominal.toLocaleString('id-ID')}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}