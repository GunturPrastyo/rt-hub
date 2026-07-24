import { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  HiOutlineBuildingOffice2, 
  HiOutlineUserGroup, 
  HiOutlineHome, 
  HiOutlineBanknotes,
  HiOutlineArrowUpRight,
  HiOutlineArrowDownRight,
  HiOutlinePlus,
  HiOutlineReceiptPercent,
  HiOutlineArrowTrendingDown
} from 'react-icons/hi2';

import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts';

export default function DashboardPage() {
  // Data Dummy Finansial 1 Tahun untuk Grafik (Recharts)
  const [financialData] = useState([
    { bulan: 'Jan', pemasukan: 1850000, pengeluaran: 1200000 },
    { bulan: 'Feb', pemasukan: 1725000, pengeluaran: 950000 },
    { bulan: 'Mar', pemasukan: 1900000, pengeluaran: 1400000 },
    { bulan: 'Apr', pemasukan: 1725000, pengeluaran: 800000 },
    { bulan: 'Mei', pemasukan: 2100000, pengeluaran: 1100000 },
    { bulan: 'Jun', pemasukan: 1725000, pengeluaran: 2500000 }, // Ada perbaikan jalan/selokan
    { bulan: 'Jul', pemasukan: 1725000, pengeluaran: 1000000 },
    { bulan: 'Agt', pemasukan: 1800000, pengeluaran: 900000 },
    { bulan: 'Sep', pemasukan: 1725000, pengeluaran: 850000 },
    { bulan: 'Okt', pemasukan: 1725000, pengeluaran: 1050000 },
    { bulan: 'Nov', pemasukan: 1725000, pengeluaran: 900000 },
    { bulan: 'Des', pemasukan: 2000000, pengeluaran: 1300000 },
  ]);

  // Data Ringkasan Transaksi Terakhir
  const [recentTransactions] = useState([
    { id: 1, tipe: 'pemasukan', deskripsi: 'Iuran Kebersihan & Satpam - Rumah A-01 (Budi)', jumlah: 115000, tanggal: '24 Jul 2026' },
    { id: 2, tipe: 'pengeluaran', deskripsi: 'Gaji Satpam Bulan Juli', jumlah: 1000000, tanggal: '23 Jul 2026' },
    { id: 3, tipe: 'pemasukan', deskripsi: 'Iuran Kebersihan 1 Tahun - Rumah B-03 (Siti)', jumlah: 180000, tanggal: '22 Jul 2026' },
    { id: 4, tipe: 'pengeluaran', deskripsi: 'Pembelian Token Listrik Pos Satpam', jumlah: 100000, tanggal: '20 Jul 2026' },
  ]);

  // Helper Format Rupiah
  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="space-y-6">
      {/* Header & Quick Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
            Dashboard Administrasi RT
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Ringkasan status perumahan, tagihan iuran, dan laporan kas RT.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/transaksi/iuran"
            className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-blue-500/20 transition-all"
          >
            <HiOutlinePlus size={18} />
            Catat Iuran
          </Link>
          <Link
            to="/transaksi/pengeluaran"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-gray-700 dark:text-gray-200 rounded-xl text-sm font-semibold border border-gray-200 dark:border-slate-700 transition-all"
          >
            <HiOutlineArrowTrendingDown size={18} className="text-red-500" />
            Catat Pengeluaran
          </Link>
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Total Saldo Kas RT */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total Saldo Kas RT
            </span>
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400 flex items-center justify-center">
              <HiOutlineBanknotes size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              {formatRupiah(8225000)}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
              <HiOutlineArrowUpRight size={14} />
              <span>Surplus bulan ini</span>
            </div>
          </div>
        </div>

        {/* Card 2: Status Rumah */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Total Rumah
            </span>
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 flex items-center justify-center">
              <HiOutlineBuildingOffice2 size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              20 Rumah
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              <span className="font-semibold text-blue-600 dark:text-blue-400">15 Dihuni</span> • <span className="text-amber-500 font-semibold">5 Kosong</span>
            </p>
          </div>
        </div>

        {/* Card 3: Warga / Penghuni */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Penghuni Terdaftar
            </span>
            <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 flex items-center justify-center">
              <HiOutlineUserGroup size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              18 Warga
            </div>
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              15 Tetap • 3 Kontrak
            </p>
          </div>
        </div>

        {/* Card 4: Status Pembayaran Bulan Ini */}
        <div className="p-5 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-gray-400 dark:text-gray-500">
              Status Iuran Juli
            </span>
            <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400 flex items-center justify-center">
              <HiOutlineReceiptPercent size={22} />
            </div>
          </div>
          <div className="mt-4">
            <div className="text-2xl font-bold text-gray-800 dark:text-white">
              12 / 15 Lunas
            </div>
            <p className="text-xs text-red-500 font-semibold mt-1">
              3 Rumah belum bayar
            </p>
          </div>
        </div>
      </div>

      {/* Main Content Grid: Chart Finansial & Transaksi Terbaru */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Grafik Pemasukan vs Pengeluaran (2 Column) */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                Ringkasan Kas RT Tahun 2026
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Perbandingan Pemasukan Iuran vs Pengeluaran Operasional
              </p>
            </div>
            <Link
              to="/laporan"
              className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
            >
              Lihat Detail Laporan
            </Link>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#94a3b8' }} tickFormatter={(val) => `${val / 1000}k`} />
                <Tooltip 
                  formatter={(value) => [formatRupiah(value)]}
                  contentStyle={{ backgroundColor: '#1e293b', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                <Bar dataKey="pemasukan" name="Pemasukan (Iuran)" fill="#10b981" radius={[6, 6, 0, 0]} />
                <Bar dataKey="pengeluaran" name="Pengeluaran RT" fill="#ef4444" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* List Transaksi Terakhir (1 Column) */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-gray-800 dark:text-white">
                Transaksi Terakhir
              </h2>
              <span className="text-xs text-gray-400">Terbaru</span>
            </div>

            <div className="space-y-3">
              {recentTransactions.map((item) => (
                <div
                  key={item.id}
                  className="flex items-start justify-between p-3 rounded-xl bg-gray-50 dark:bg-slate-700/40 border border-gray-100 dark:border-slate-700/60"
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.tipe === 'pemasukan'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                          : 'bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                      }`}
                    >
                      {item.tipe === 'pemasukan' ? (
                        <HiOutlineArrowUpRight size={16} />
                      ) : (
                        <HiOutlineArrowDownRight size={16} />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-gray-800 dark:text-gray-200 line-clamp-1">
                        {item.deskripsi}
                      </p>
                      <span className="text-[10px] text-gray-400 mt-0.5 block">
                        {item.tanggal}
                      </span>
                    </div>
                  </div>
                  <span
                    className={`text-xs font-bold shrink-0 ml-2 ${
                      item.tipe === 'pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-500'
                    }`}
                  >
                    {item.tipe === 'pemasukan' ? '+' : '-'}{formatRupiah(item.jumlah)}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <Link
            to="/laporan"
            className="w-full text-center py-2.5 mt-4 text-xs font-semibold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/20 hover:bg-blue-100 dark:hover:bg-blue-900/40 rounded-xl transition-colors block"
          >
            Lihat Semua Transaksi →
          </Link>
        </div>
      </div>
    </div>
  );
}