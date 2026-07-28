import React from 'react';
import { HiOutlineFunnel, HiChevronLeft, HiChevronRight } from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';

export default function MutasiTransaksi({
  mutasi,
  periodeOptions,
  selectedPeriode,
  onPeriodeChange,
  pagination, // Terima props pagination
  onPageChange, // Terima fungsi ganti halaman
  loading,
  formatCurrency,
}) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Detail Mutasi Transaksi</h2>
        <div className="flex items-center gap-2">
          <HiOutlineFunnel className="w-4 h-4 text-slate-400" />
          <select
            value={selectedPeriode}
            onChange={(e) => onPeriodeChange(e.target.value)}
            className="px-3 py-1.5 text-xs font-semibold bg-slate-50 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-lg text-slate-800 dark:text-slate-100"
            disabled={loading || periodeOptions.length === 0}
          >
            {periodeOptions.length > 0 ? (
              periodeOptions.map((periode) => (
                <option key={periode} value={periode}>Periode: {periode}</option>
              ))
            ) : (
              <option value="">Tidak ada data</option>
            )}
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
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-400">Memuat data mutasi...</td></tr>
            ) : mutasi.length > 0 ? (
              mutasi.map((item) => (
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
      {pagination && pagination.lastPage > 1 && (
        <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-slate-700">
          <span className="text-xs text-slate-500">
            Menampilkan {pagination.from} - {pagination.to} dari {pagination.total} mutasi
          </span>
          <div className="flex gap-1">
            <button
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1 || loading}
              className="p-1.5 rounded bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-50"
            >
              <HiChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.lastPage || loading}
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