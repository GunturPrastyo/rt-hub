import { useState, useEffect } from 'react';
import { HiOutlineArrowTrendingUp, HiOutlineArrowTrendingDown, HiOutlineScale } from 'react-icons/hi2';
import api from '../../services/api';

import PemasukanTable from '../../components/transaksi/PemasukanTable';
import PengeluaranTable from '../../components/transaksi/PengeluaranTable';

const InfoCard = ({ title, value, icon: Icon, loading }) => (
  <div className="bg-white dark:bg-slate-800 p-8 rounded-lg shadow-md flex items-center gap-2">
    <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-full mr-4">
      <Icon className="h-6 w-6 text-gray-600 dark:text-gray-400" />
    </div>
    <div>
      <p className="text-sm text-gray-500 dark:text-gray-400">{title}</p>
      {loading ? (
        <div className="mt-1 h-7 w-32 bg-gray-200 dark:bg-slate-700 rounded animate-pulse" />
      ) : (
        <p className="text-xl font-bold text-gray-800 dark:text-white">{value}</p>
      )}
    </div>
  </div>
);

export default function TransaksiPage() {
  const [activeTab, setActiveTab] = useState('pemasukan');
  const [summary, setSummary] = useState({ totalPemasukan: 0, totalPengeluaran: 0, sisaSaldo: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pindahkan fetchSummary ke luar useEffect agar bisa dikirim ke child component
  const fetchSummary = async () => {
    try {
      setLoading(true);
      const response = await api.get('/summary');
      setSummary(response.data.data);
      setError(null);
    } catch (err) {
      setError('Gagal memuat ringkasan data.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSummary();
  }, []);

  const formatCurrency = (amount) => new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(amount);

  return (
    <div className="space-y-6">
      {/* Kartu Ringkasan */}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <InfoCard title="Total Pemasukan" value={formatCurrency(summary.totalPemasukan)} icon={HiOutlineArrowTrendingUp} loading={loading} />
        <InfoCard title="Total Pengeluaran" value={formatCurrency(summary.totalPengeluaran)} icon={HiOutlineArrowTrendingDown} loading={loading} />
        <InfoCard title="Sisa Saldo Kas" value={formatCurrency(summary.sisaSaldo)} icon={HiOutlineScale} loading={loading} />
      </div>

      {/* Navigasi Tab */}
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md">
        <div className="border-b border-gray-200 dark:border-slate-700">
          <nav className="flex -mb-px px-4" aria-label="Tabs">
            <button
              onClick={() => setActiveTab('pemasukan')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                activeTab === 'pemasukan'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }`}
            >
              Pemasukan Iuran
            </button>
            <button
              onClick={() => setActiveTab('pengeluaran')}
              className={`whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm ml-8 transition-colors duration-200 ${
                activeTab === 'pengeluaran'
                  ? 'border-blue-500 text-blue-600 dark:border-blue-400 dark:text-blue-300'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200 dark:hover:border-gray-500'
              }`}
            >
              Pengeluaran RT
            </button>
          </nav>
        </div>

        {/* Konten Tab */}
        <div className="p-4">
          {activeTab === 'pemasukan' && (
            <PemasukanTable onTransactionSuccess={fetchSummary} />
          )}
          {activeTab === 'pengeluaran' && (
            <PengeluaranTable 
              sisaSaldo={summary.sisaSaldo} 
              onTransactionSuccess={fetchSummary} 
            />
          )}
        </div>
      </div>
    </div>
  );
}