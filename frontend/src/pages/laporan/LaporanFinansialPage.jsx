import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../services/api';
import GrafikArusKas from './components/GrafikArusKas';
import MutasiTransaksi from './components/MutasiTransaksi';
import { HiCalendarDays } from 'react-icons/hi2';

export default function LaporanFinansialPage() {
  const currentYear = new Date().getFullYear();
  
  // State untuk filter Tahun Global
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [laporan, setLaporan] = useState({
    grafik: Array(12).fill({ bulan: '', pemasukan: 0, pengeluaran: 0 }),
    mutasi: { data: [], total: 0, current_page: 1, last_page: 1 },
    periodeOptions: [],
    yearOptions: [], // TAMBAHAN: State untuk menyimpan daftar tahun dari API
  });
  
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Reset halaman dan periode setiap kali TAHUN diganti
  useEffect(() => {
    setCurrentPage(1);
    setSelectedPeriode(''); 
  }, [selectedYear]);

  // Reset halaman setiap kali PERIODE diganti
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriode]);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
        // Kirim parameter year dan periode ke Backend
        const params = { page: currentPage, year: selectedYear };
        if (selectedPeriode) {
          params.periode = selectedPeriode;
        }

        const response = await api.get('/laporan/finansial', { params });
        const data = response.data.data;

        setLaporan({
          grafik: data.grafik,
          mutasi: data.mutasi,
          periodeOptions: data.periodeOptions,
          // Ambil daftar tahun dari API, atau fallback ke tahun saat ini jika kosong
          yearOptions: data.yearOptions?.length > 0 ? data.yearOptions : [currentYear], 
        });

        // Jika baru load atau ganti tahun, set periode pertama dari opsi yang tersedia
        if ((!selectedPeriode || !data.periodeOptions.includes(selectedPeriode)) && data.periodeOptions.length > 0) {
          setSelectedPeriode(data.periodeOptions[0]);
        }
        setError(null);
      } catch (err) {
        setError('Gagal memuat data laporan finansial.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchLaporan();
  }, [selectedYear, selectedPeriode, currentPage]);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <PageHeader
          title="Laporan Finansial Kas RT"
          description="Ringkasan arus kas, grafik tahunan, serta rekapitulasi mutasi bulanan."
          titleSize="3xl"
        />
        
        {/* Dropdown Filter Tahun Dinamis (Hanya muncul jika ada lebih dari 0 data) */}
        <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
          <HiCalendarDays className="w-5 h-5 text-slate-500 ml-2" />
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(Number(e.target.value))}
            disabled={loading}
            className="bg-transparent border-none text-slate-800 dark:text-slate-100 font-bold focus:ring-0 cursor-pointer text-sm disabled:opacity-50"
          >
            {laporan.yearOptions.map((year) => (
              <option key={year} value={year}>Tahun {year}</option>
            ))}
          </select>
        </div>
      </div>

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      <GrafikArusKas 
        grafik={laporan.grafik} 
        formatCurrency={formatCurrency} 
        selectedYear={selectedYear} 
      />

      <MutasiTransaksi
        mutasi={laporan.mutasi.data ?? []}
        pagination={{
          currentPage: laporan.mutasi.current_page,
          lastPage: laporan.mutasi.last_page,
          total: laporan.mutasi.total,
          from: laporan.mutasi.from,
          to: laporan.mutasi.to,
        }}
        periodeOptions={laporan.periodeOptions}
        selectedPeriode={selectedPeriode}
        onPeriodeChange={setSelectedPeriode}
        onPageChange={setCurrentPage}
        loading={loading}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}