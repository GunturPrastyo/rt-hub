import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../services/api';
import GrafikArusKas from './components/GrafikArusKas';
import MutasiTransaksi from './components/MutasiTransaksi';

export default function LaporanFinansialPage() {
  const currentYear = new Date().getFullYear();
  
  const [selectedYear, setSelectedYear] = useState(currentYear);

  const [laporan, setLaporan] = useState({
    grafik: Array(12).fill({ bulan: '', pemasukan: 0, pengeluaran: 0 }),
    mutasi: { data: [], total: 0, current_page: 1, last_page: 1 },
    periodeOptions: [],
    yearOptions: [], 
  });
  
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setCurrentPage(1);
    setSelectedPeriode(''); 
  }, [selectedYear]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriode]);

  useEffect(() => {
    const fetchLaporan = async () => {
      try {
        setLoading(true);
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
          yearOptions: data.yearOptions?.length > 0 ? data.yearOptions : [currentYear], 
        });

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
      
      {/* Dropdown filter tahun DIHAPUS dari header */}
      <PageHeader
        title="Laporan Finansial Kas RT"
        description="Ringkasan arus kas, grafik tahunan, serta rekapitulasi mutasi bulanan."
        titleSize="3xl"
      />

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      <GrafikArusKas 
        grafik={laporan.grafik} 
        formatCurrency={formatCurrency} 
        selectedYear={selectedYear} 
        yearOptions={laporan.yearOptions} 
        onYearChange={setSelectedYear}    
      />

      <MutasiTransaksi
        mutasi={laporan.mutasi.data ?? []}
        pagination={{
          current_page: laporan.mutasi.current_page,
          last_page: laporan.mutasi.last_page,
          total: laporan.mutasi.total,
          from: laporan.mutasi.from,
          to: laporan.mutasi.to,
        }}
        periodeOptions={laporan.periodeOptions}
        selectedPeriode={selectedPeriode}
        selectedYear={selectedYear}       
        onPeriodeChange={setSelectedPeriode}
        onPageChange={setCurrentPage}
        loading={loading}
        formatCurrency={formatCurrency}
      />
    </div>
  );
}