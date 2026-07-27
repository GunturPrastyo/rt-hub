import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import {
  HiOutlineBuildingOffice2,
  HiOutlineUserGroup,
  HiOutlineBanknotes,
  HiOutlineArrowUpRight,
  HiOutlineArrowDownRight,
  HiOutlinePlus,
  HiOutlineReceiptPercent,
  HiOutlineArrowTrendingDown
} from 'react-icons/hi2';

// Mengubah BarChart menjadi AreaChart
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts';
import PageHeader from '../../components/ui/PageHeader';

export default function DashboardPage() {
  const [isLoading, setIsLoading] = useState(true);

  const [saldoKas, setSaldoKas] = useState(0);
  const [statsRumah, setStatsRumah] = useState({ total: 0, dihuni: 0, kosong: 0 });
  const [statsPenghuni, setStatsPenghuni] = useState({ total: 0, tetap: 0, kontrak: 0 });
  const [statsIuran, setStatsIuran] = useState({ total: 0, lunas: 0, nunggak: 0 });
  
  const [financialData, setFinancialData] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const currentYear = new Date().getFullYear();

        const [summaryRes, rumahRes, penghuniRes, iuranRes, laporanRes] = await Promise.all([
          api.get('/summary'),
          api.get('/rumah'),
          api.get('/penghuni'),
          api.get('/iuran/status'),
          api.get('/laporan/finansial', { params: { year: currentYear } })
        ]);

        setSaldoKas(summaryRes.data.data?.sisaSaldo || 0);

        const rumahData = rumahRes.data.data || [];
        setStatsRumah({ 
          total: rumahData.length, 
          dihuni: rumahData.filter(r => r.status === 'Dihuni').length, 
          kosong: rumahData.filter(r => r.status === 'Kosong').length 
        });

        const penghuniData = penghuniRes.data.data || [];
        setStatsPenghuni({ 
          total: penghuniData.length, 
          tetap: penghuniData.filter(p => p.status_warga === 'Tetap').length, 
          kontrak: penghuniData.filter(p => p.status_warga === 'Kontrak').length 
        });

        const iuranData = iuranRes.data.data || [];
        const lunas = iuranData.filter(w => w.isKebersihanLunas && w.isSatpamLunas).length;
        setStatsIuran({ 
          total: iuranData.length, 
          lunas, 
          nunggak: iuranData.length - lunas 
        });

        const laporanData = laporanRes.data.data;
        setFinancialData(laporanData.grafik || []);

        const latestPeriode = laporanData.periodeOptions?.[0];
        if (latestPeriode) {
           const mutasiRes = await api.get('/laporan/finansial', { 
             params: { year: currentYear, periode: latestPeriode } 
           });
           const mutasiList = mutasiRes.data.data.mutasi.data || [];
           // PERUBAHAN: Membatasi mutasi hanya 4 data teratas
           setRecentTransactions(mutasiList.slice(0, 4)); 
        }

      } catch (error) {
        console.error("Gagal memuat data dashboard:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(number);
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <PageHeader
        title="Dashboard Administrasi RT"
        description="Ringkasan status perumahan, tagihan iuran, dan laporan kas RT."
      >
        <div className="flex items-center gap-3">
          <Link
            to="/transaksi"
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 rounded-lg text-sm font-semibold shadow-sm transition-all"
          >
            <HiOutlinePlus size={18} />
            Catat Transaksi
          </Link>
        </div>
      </PageHeader>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Saldo Kas RT
            </span>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <HiOutlineBanknotes size={22} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {formatRupiah(saldoKas)}
                </div>
                <div className="flex items-center gap-1 text-xs text-emerald-600 dark:text-emerald-400 mt-1 font-medium">
                  <HiOutlineArrowUpRight size={14} />
                  <span>Kas Terkini</span>
                </div>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Total Rumah
            </span>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <HiOutlineBuildingOffice2 size={22} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
               <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statsRumah.total} Rumah
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  <span className="font-semibold text-slate-700 dark:text-slate-200">{statsRumah.dihuni} Dihuni</span> • <span className="text-amber-600 dark:text-amber-400 font-semibold">{statsRumah.kosong} Kosong</span>
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Penghuni Terdaftar
            </span>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <HiOutlineUserGroup size={22} />
            </div>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-8 w-24 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statsPenghuni.total} Warga
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  {statsPenghuni.tetap} Tetap • {statsPenghuni.kontrak} Kontrak
                </p>
              </>
            )}
          </div>
        </div>

        <div className="p-5 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 dark:text-slate-500">
              Status Iuran Aktif
            </span>
            <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700/60 text-slate-600 dark:text-slate-300 flex items-center justify-center">
              <HiOutlineReceiptPercent size={22} />
            </div>
          </div>
          <div className="mt-4">
             {isLoading ? (
              <div className="h-8 w-32 bg-slate-200 dark:bg-slate-700 rounded animate-pulse" />
            ) : (
              <>
                <div className="text-2xl font-bold text-slate-900 dark:text-white">
                  {statsIuran.lunas} / {statsIuran.total} Lunas
                </div>
                <p className="text-xs text-rose-500 font-semibold mt-1">
                  {statsIuran.nunggak > 0 ? `${statsIuran.nunggak} Rumah nunggak` : 'Semua rumah lunas'}
                </p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Kolom Kiri: Area Chart (Pengganti Bar Chart) */}
        <div className="lg:col-span-2 p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Tren Pemasukan vs Pengeluaran
              </h2>
              <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                Perbandingan statistik kas masuk dan operasional RT.
              </p>
            </div>
            <Link
              to="/laporan"
              className="text-xs font-semibold text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white transition-colors flex items-center gap-1"
            >
              <span>Detail Laporan</span>
              <HiOutlineArrowUpRight size={14} />
            </Link>
          </div>

          <div className="h-72 w-full">
            {isLoading ? (
               <div className="w-full h-full bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-pulse" />
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={financialData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorPemasukan" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorPengeluaran" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#f43f5e" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
                  <XAxis dataKey="bulan" tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} />
                  <YAxis tickLine={false} axisLine={false} tick={{ fontSize: 12, fill: '#64748b' }} tickFormatter={(val) => `${val / 1000}k`} />
                  <Tooltip
                    formatter={(value) => [formatRupiah(value)]}
                    contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
                  />
                  <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
                  {/* type="monotone" membuat garisnya melengkung halus (smooth) */}
                  <Area type="monotone" dataKey="pemasukan" name="Pemasukan (Iuran)" stroke="#10b981" strokeWidth={3} fillOpacity={1} fill="url(#colorPemasukan)" />
                  <Area type="monotone" dataKey="pengeluaran" name="Pengeluaran RT" stroke="#f43f5e" strokeWidth={3} fillOpacity={1} fill="url(#colorPengeluaran)" />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Kolom Kanan: Mutasi Terakhir (Dibatasi 4 Data) */}
        <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
                Mutasi Terakhir
              </h2>
              <span className="text-xs text-slate-400">Terbaru</span>
            </div>

            <div className="space-y-3">
              {isLoading ? (
                 // Menampilkan 4 skeleton loading
                 Array(4).fill(0).map((_, i) => (
                   <div key={i} className="h-14 w-full bg-slate-100 dark:bg-slate-700/50 rounded-lg animate-pulse" />
                 ))
              ) : recentTransactions.length > 0 ? (
                recentTransactions.map((item) => (
                  <div
                    key={item.id}
                    className="flex items-start justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-700/30 border border-slate-100 dark:border-slate-700/50 hover:bg-slate-100 dark:hover:bg-slate-700/60 transition-colors"
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                          item.jenis === 'Pemasukan'
                            ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                            : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                        }`}
                      >
                        {item.jenis === 'Pemasukan' ? (
                          <HiOutlineArrowUpRight size={16} />
                        ) : (
                          <HiOutlineArrowDownRight size={16} />
                        )}
                      </div>
                      <div>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 line-clamp-1" title={item.keterangan}>
                          {item.keterangan}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5 block">
                          {item.tanggal} • {item.kategori}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`text-xs font-bold shrink-0 ml-2 ${
                        item.jenis === 'Pemasukan' ? 'text-emerald-600 dark:text-emerald-400' : 'text-rose-500'
                      }`}
                    >
                      {item.jenis === 'Pemasukan' ? '+' : '-'}{formatRupiah(item.nominal)}
                    </span>
                  </div>
                ))
              ) : (
                <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 dark:border-slate-700 rounded-lg">
                  Belum ada mutasi tercatat.
                </div>
              )}
            </div>
          </div>

          <Link
            to="/transaksi"
            className="w-full flex items-center justify-center gap-1.5 py-2.5 mt-4 text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 rounded-lg transition-colors"
          >
            <span>Lihat Semua Transaksi</span>
            <HiOutlineArrowUpRight size={14} />
          </Link>
        </div>
      </div>
    </div>
  );
}