import React, { useState } from 'react';
import { HiOutlineFunnel, HiChevronLeft, HiChevronRight, HiOutlineDocumentArrowDown } from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';
import api from '../../../services/api';

export default function MutasiTransaksi({
  mutasi,
  periodeOptions,
  selectedPeriode,
  selectedYear, 
  onPeriodeChange,
  pagination, 
  onPageChange, 
  loading,
  formatCurrency,
}) {
  const [isExporting, setIsExporting] = useState(false);

  const handleExportCSV = async () => {
    if (!selectedPeriode) return;
    
    setIsExporting(true);
    try {
      const response = await api.get('/laporan/export', {
        params: { year: selectedYear, periode: selectedPeriode },
        responseType: 'blob', 
      });

      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Laporan_Mutasi_RT_${selectedPeriode.replace(' ', '_')}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error('Gagal mengekspor data:', error);
      alert('Gagal mengekspor laporan.');
    } finally {
      setIsExporting(false);
    }
  };

  // 1. TAMBAHAN: Mengurutkan mutasi berdasarkan waktu penginputan (created_at atau tanggal) dari yang terbaru
  const sortedMutasi = [...mutasi].sort((a, b) => {
    const timeA = new Date(a.created_at || a.tanggal).getTime();
    const timeB = new Date(b.created_at || b.tanggal).getTime();
    return timeB - timeA; 
  });

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Detail Mutasi Transaksi</h2>
        
        <div className="flex flex-wrap items-center gap-2">
          {/* Tombol Export Laporan */}
          <button
            onClick={handleExportCSV}
            disabled={loading || isExporting || periodeOptions.length === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-400 dark:border-emerald-800 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50 cursor-pointer"
          >
            <HiOutlineDocumentArrowDown className="w-4 h-4" />
            {isExporting ? 'Mengekspor...' : 'Ekspor CSV'}
          </button>

          {/* Filter Periode */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700 px-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600">
            <HiOutlineFunnel className="w-4 h-4 text-slate-400 ml-1" />
            <select
              value={selectedPeriode}
              onChange={(e) => onPeriodeChange(e.target.value)}
              className="bg-transparent border-none text-xs font-semibold text-slate-800 dark:text-slate-100 focus:ring-0 cursor-pointer p-0 pr-6"
              disabled={loading || periodeOptions.length === 0}
            >
              {periodeOptions.length > 0 ? (
                periodeOptions.map((periode) => (
                  <option key={periode} value={periode}>{periode}</option>
                ))
              ) : (
                <option value="">Tidak ada data</option>
              )}
            </select>
          </div>
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
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Memuat data mutasi...</td></tr>
            ) : sortedMutasi.length > 0 ? (
              // 2. UBAH: Gunakan sortedMutasi hasil sorting di atas
              sortedMutasi.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 text-slate-500">{item.tanggal}</td>
                  <td className="px-4 py-3">
                    <Badge variant={item.jenis === 'Pemasukan' ? 'success' : 'danger'}>{item.jenis}</Badge>
                  </td>
                  <td className="px-4 py-3 font-semibold text-slate-800 dark:text-slate-100">{item.kategori}</td>
                  <td className="px-4 py-3 text-slate-500">{item.keterangan}</td>
                  <td className={`px-4 py-3 text-right font-bold ${item.jenis === 'Pemasukan' ? 'text-emerald-600' : 'text-rose-600'}`}>
                    {item.jenis === 'Pemasukan' ? '+' : '-'} {formatCurrency(item.nominal)}
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Tidak ada data mutasi untuk periode ini.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* UI PAGINATION */}
      {pagination && pagination.last_page > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">
            Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} mutasi
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1 || loading}
              className="p-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page || loading}
              className="p-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50"
            >
              <HiChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}