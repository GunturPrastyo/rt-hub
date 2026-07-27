import { useState, useEffect } from 'react';
import api from '../../../services/api';
import { HiOutlinePlus, HiMagnifyingGlass } from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import BayarIuranModal from './components/BayarIuranModal';
import PageHeader from '../../../components/ui/PageHeader';

export default function PemasukanIuranPage() {
  const [selectedBulan, setSelectedBulan] = useState('Juli 2026');
  const [searchWargaQuery, setSearchWargaQuery] = useState('');
  const [isBayarModalOpen, setIsBayarModalOpen] = useState(false);
  const [statusIuranWarga, setStatusIuranWarga] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchStatusIuran = async () => {
    try {
      const response = await api.get('/iuran/status');
      setStatusIuranWarga(response.data.data);
    } catch (error) {
      console.error("Gagal memuat status iuran", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStatusIuran();
  }, []);

  const handleSimpanPemasukan = async (data) => {
    try {
      await api.post('/iuran', data);
      setIsBayarModalOpen(false);
      fetchStatusIuran(); // Refresh data status pembayaran
    } catch (error) {
      console.error(error);
      alert('Gagal menyimpan pembayaran');
    }
  };

  const filteredWarga = statusIuranWarga.filter((w) =>
    w.nama.toLowerCase().includes(searchWargaQuery.toLowerCase()) ||
    w.nomorRumah.toLowerCase().includes(searchWargaQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader title="Pemasukan Iuran Warga" description="Monitoring pembayaran iuran kebersihan dan satpam.">
        <Button onClick={() => setIsBayarModalOpen(true)} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Bayar Iuran</span>
        </Button>
      </PageHeader>

      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        <div className="mb-4 w-full sm:w-72">
          <Input
            icon={HiMagnifyingGlass}
            value={searchWargaQuery}
            onChange={(e) => setSearchWargaQuery(e.target.value)}
            placeholder="Cari nama / no rumah..."
          />
        </div>

        {isLoading ? (
          <p className="text-center text-sm text-slate-400 py-4">Memuat data status iuran warga...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
              <thead className="bg-slate-50 dark:bg-slate-700/40 text-slate-400 border-b border-slate-100 dark:border-slate-700">
                <tr>
                  <th className="px-4 py-3">No. Rumah</th>
                  <th className="px-4 py-3">Nama Warga</th>
                  <th className="px-4 py-3">Status Iuran Kebersihan</th>
                  <th className="px-4 py-3">Status Iuran Satpam</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
                {filteredWarga.length > 0 ? (
                  filteredWarga.map((warga) => (
                    <tr key={warga.id} className="hover:bg-slate-50/80 transition-colors">
                      <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{warga.nomorRumah}</td>
                      <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{warga.nama}</td>
                      <td className="px-4 py-3">
                        <Badge variant={warga.isKebersihanLunas ? 'success' : 'danger'}>
                          {warga.kebersihanStatus}
                        </Badge>
                      </td>
                      <td className="px-4 py-3">
                        <Badge variant={warga.isSatpamLunas ? 'success' : 'danger'}>
                          {warga.satpamStatus}
                        </Badge>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="4" className="text-center py-4 text-slate-400">Tidak ada data warga yang menempati rumah saat ini.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <BayarIuranModal
        isOpen={isBayarModalOpen}
        onClose={() => setIsBayarModalOpen(false)}
        onSubmit={handleSimpanPemasukan}
        availablePenghuni={statusIuranWarga}
        selectedBulan={selectedBulan}
      />
    </div>
  );
}