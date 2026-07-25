import { useState } from 'react';
import { 
  HiOutlinePlus, 
  HiMagnifyingGlass, 
  HiOutlineFunnel
} from 'react-icons/hi2';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Input from '../../../components/ui/Input';
import BayarIuranModal from './components/BayarIuranModal';

export default function PemasukanIuranPage() {
  const [selectedBulan, setSelectedBulan] = useState('Juli 2026');
  const [searchWargaQuery, setSearchWargaQuery] = useState('');
  const [isBayarModalOpen, setIsBayarModalOpen] = useState(false);

  // Data Warga beserta Status Pembayaran Masing-Masing Jenis Iuran
  const [statusIuranWarga, setStatusIuranWarga] = useState([
    {
      id: 101,
      nama: 'Budi Santoso',
      nomorRumah: 'A-01',
      statusWarga: 'Tetap',
      kebersihanStatus: 'Lunas (s/d Des 2026)', // Bayar 1 Tahun
      satpamStatus: 'Lunas (Juli 2026)', // Bayar Bulanan
      isKebersihanLunas: true,
      isSatpamLunas: true,
      tunggakan: { kebersihan: 0, satpam: 0 },
    },
    {
      id: 102,
      nama: 'Ahmad Dahlan',
      nomorRumah: 'A-02',
      statusWarga: 'Tetap',
      kebersihanStatus: 'Lunas (s/d Des 2026)', // Bayar 1 Tahun
      satpamStatus: 'Nunggak 2 Bulan', // Satpam Nunggak
      isKebersihanLunas: true,
      isSatpamLunas: false,
      tunggakan: { kebersihan: 0, satpam: 2 },
    },
    {
      id: 103,
      nama: 'Siti Nurhaliza',
      nomorRumah: 'B-01',
      statusWarga: 'Kontrak',
      kebersihanStatus: 'Nunggak 1 Bulan',
      satpamStatus: 'Nunggak 1 Bulan',
      isKebersihanLunas: false,
      isSatpamLunas: false,
      tunggakan: { kebersihan: 1, satpam: 1 },
    }
  ]);

  const handleSimpanPemasukan = (data) => {
    const [monthStr, yearStr] = selectedBulan.split(' ');
    const year = parseInt(yearStr, 10);

    const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const shortMonthNames = ["Jan", "Feb", "Mar", "Apr", "Mei", "Jun", "Jul", "Agt", "Sep", "Okt", "Nov", "Des"];
    
    const monthIndex = monthNames.indexOf(monthStr.toLowerCase());

    setStatusIuranWarga((prev) =>
      prev.map((w) => {
        if (w.id === data.penghuniId) {
          let { kebersihanStatus, satpamStatus, isKebersihanLunas, isSatpamLunas, tunggakan } = w;

          // Update status iuran kebersihan
          if (data.bulanKebersihan > 0) {
            const baseMonthIndex = monthIndex - tunggakan.kebersihan;
            const newTunggakan = Math.max(0, tunggakan.kebersihan - data.bulanKebersihan);
            tunggakan.kebersihan = newTunggakan;

            if (newTunggakan > 0) {
              kebersihanStatus = `Nunggak ${newTunggakan} Bulan`;
              isKebersihanLunas = false;
            } else {
              isKebersihanLunas = true;
              const lastPaidDate = new Date(year, baseMonthIndex + data.bulanKebersihan - 1);
              const endMonth = shortMonthNames[lastPaidDate.getMonth()];
              const endYear = lastPaidDate.getFullYear();
              kebersihanStatus = `Lunas (s/d ${endMonth} ${endYear})`;
            }
          }

          // Update status iuran satpam
          if (data.bulanSatpam > 0) {
            const baseMonthIndex = monthIndex - tunggakan.satpam;
            const newTunggakan = Math.max(0, tunggakan.satpam - data.bulanSatpam);
            tunggakan.satpam = newTunggakan;

            if (newTunggakan > 0) {
              satpamStatus = `Nunggak ${newTunggakan} Bulan`;
              isSatpamLunas = false;
            } else {
              isSatpamLunas = true;
              const lastPaidDate = new Date(year, baseMonthIndex + data.bulanSatpam - 1);
              const endMonth = shortMonthNames[lastPaidDate.getMonth()];
              const endYear = lastPaidDate.getFullYear();
              satpamStatus = `Lunas (s/d ${endMonth} ${endYear})`;
            }
          }

          return {
            ...w,
            kebersihanStatus,
            satpamStatus,
            isKebersihanLunas,
            isSatpamLunas,
            tunggakan,
          };
        }
        return w;
      })
    );
    setIsBayarModalOpen(false);
  };

  const filteredWarga = statusIuranWarga.filter(
    (w) =>
      w.nama.toLowerCase().includes(searchWargaQuery.toLowerCase()) ||
      w.nomorRumah.toLowerCase().includes(searchWargaQuery.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold font-heading text-slate-800 dark:text-slate-100">
            Pemasukan Iuran Warga
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
            Monitoring pembayaran iuran kebersihan (bisa tahunan) dan satpam (bulanan).
          </p>
        </div>

        <Button onClick={() => setIsBayarModalOpen(true)} variant="primary">
          <HiOutlinePlus size={18} />
          <span>Bayar Iuran</span>
        </Button>
      </div>

      {/* Main Table */}
      <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="w-full sm:w-72">
            <Input
              icon={HiMagnifyingGlass}
              value={searchWargaQuery}
              onChange={(e) => setSearchWargaQuery(e.target.value)}
              placeholder="Cari nama / no rumah..."
            />
          </div>

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

        {/* Tabel Rekap Status */}
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-left text-xs text-slate-600 dark:text-slate-300">
            <thead className="bg-slate-50 dark:bg-slate-700/40 font-semibold uppercase tracking-wider text-slate-400 border-b border-slate-100 dark:border-slate-700">
              <tr>
                <th className="px-4 py-3">No. Rumah</th>
                <th className="px-4 py-3">Nama Warga</th>
                <th className="px-4 py-3">Status Iuran Kebersihan</th>
                <th className="px-4 py-3">Status Iuran Satpam</th>
                <th className="px-4 py-3 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-700/60">
              {filteredWarga.map((warga) => (
                <tr key={warga.id} className="hover:bg-slate-50/80 dark:hover:bg-slate-700/30 transition-colors">
                  <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{warga.nomorRumah}</td>
                  <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-200">{warga.nama}</td>
                  
                  {/* Status Kebersihan */}
                  <td className="px-4 py-3">
                    <Badge variant={warga.isKebersihanLunas ? 'success' : 'danger'}>
                      {warga.kebersihanStatus}
                    </Badge>
                  </td>

                  {/* Status Satpam */}
                  <td className="px-4 py-3">
                    <Badge variant={warga.isSatpamLunas ? 'success' : 'danger'}>
                      {warga.satpamStatus}
                    </Badge>
                  </td>

                  <td className="px-4 py-3 text-right">
                    <Button
                      size="sm"
                      variant="secondary"
                      onClick={() => setIsBayarModalOpen(true)}
                    >
                      Bayar Iuran
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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