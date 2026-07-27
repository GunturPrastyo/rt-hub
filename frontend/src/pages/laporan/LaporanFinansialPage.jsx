import { useState, useEffect } from 'react';
import PageHeader from '../../components/ui/PageHeader';
import api from '../../services/api';
import GrafikArusKas from './components/GrafikArusKas';
import MutasiTransaksi from './components/MutasiTransaksi';

export default function LaporanFinansialPage() {
  const [laporan, setLaporan] = useState({
    grafik: Array(12).fill({ bulan: '', pemasukan: 0, pengeluaran: 0 }),
    mutasi: { data: [], total: 0, current_page: 1, last_page: 1 },
    periodeOptions: [],
  });
  const [selectedPeriode, setSelectedPeriode] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // When the period filter changes, reset to the first page.
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedPeriode]);

  useEffect(() => {
    const fetchLaporan = async () => {
      // Don't fetch if a period isn't selected yet (unless it's the very first load)
      if (!selectedPeriode && laporan.periodeOptions.length > 0) {
        setLaporan(prev => ({ ...prev, mutasi: { data: [], total: 0, current_page: 1, last_page: 1 } }));
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const params = { page: currentPage };
        if (selectedPeriode) {
          params.periode = selectedPeriode;
        }
        const response = await api.get('/laporan/finansial', { params });
        const data = response.data.data;

        setLaporan({
          grafik: data.grafik,
          mutasi: data.mutasi,
          periodeOptions: data.periodeOptions,
        });

        // On initial load, set the first available period as selected
        if (!selectedPeriode && data.periodeOptions.length > 0) {
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
  }, [selectedPeriode, currentPage]); // Re-fetch when period or page changes

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Laporan Finansial Kas RT"
        description="Ringkasan arus kas, grafik tahunan, serta rekapitulasi mutasi bulanan."
        titleSize="3xl"
      />

      {error && <p className="text-red-500 text-center my-4">{error}</p>}

      <GrafikArusKas grafik={laporan.grafik} formatCurrency={formatCurrency} />

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