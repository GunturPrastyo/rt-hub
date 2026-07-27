import { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import Badge from '../ui/Badge';
import { 
  HiMagnifyingGlass, 
  HiChevronDown,
  HiOutlineUserCircle,
  HiOutlineHome,
  HiOutlineIdentification
} from 'react-icons/hi2';

export default function BayarIuranModal({ isOpen, onClose, onSubmit, availablePenghuni = [], selectedBulan }) {
  const TARIF_KEBERSIHAN = 35000;
  const TARIF_SATPAM = 80000;

  const [selectedPenghuniId, setSelectedPenghuniId] = useState('');
  const [bulanKebersihan, setBulanKebersihan] = useState(0);
  const [bulanSatpam, setBulanSatpam] = useState(0);

  // For searchable dropdown
  const [wargaSearchQuery, setWargaSearchQuery] = useState('');
  const [isWargaDropdownOpen, setIsWargaDropdownOpen] = useState(false);
  const searchRef = useRef(null);

  const selectedWarga = availablePenghuni.find((p) => String(p.id) === String(selectedPenghuniId));

  // Reset form when modal opens or closes
  useEffect(() => {
    if (!isOpen) {
      setSelectedPenghuniId('');
      setWargaSearchQuery('');
      setIsWargaDropdownOpen(false);
    }
  }, [isOpen]);

  // Reset payment months when resident changes
  useEffect(() => {
    setBulanKebersihan(selectedWarga?.tunggakan?.kebersihan > 0 ? selectedWarga.tunggakan.kebersihan : 1);
    setBulanSatpam(selectedWarga?.tunggakan?.satpam > 0 ? selectedWarga.tunggakan.satpam : 1);
    if (selectedWarga?.isKebersihanLunas) setBulanKebersihan(0);
    if (selectedWarga?.isSatpamLunas) setBulanSatpam(0);
    if (!selectedPenghuniId) {
      setBulanKebersihan(0);
      setBulanSatpam(0);
    }
  }, [selectedPenghuniId, selectedWarga]);

  // Handle click outside for dropdown
  useEffect(() => {
    function handleClickOutside(event) {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsWargaDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [searchRef]);

  const handleSelectWarga = (warga) => {
    setSelectedPenghuniId(String(warga.id));
    setWargaSearchQuery(`${warga.nama} - Rumah ${warga.nomorRumah}`);
    setIsWargaDropdownOpen(false);
  };

  const filteredAvailablePenghuni = availablePenghuni.filter(w => {
    const query = wargaSearchQuery.toLowerCase();
    const isSelected = selectedWarga && `${selectedWarga.nama} - Rumah ${selectedWarga.nomorRumah}` === wargaSearchQuery;
    if (isSelected) return true; // Keep all if one is already selected and search text matches
    return w.nama.toLowerCase().includes(query) || w.nomorRumah.toLowerCase().includes(query);
  });

  const totalKebersihan = bulanKebersihan * TARIF_KEBERSIHAN;
  const totalSatpam = bulanSatpam * TARIF_SATPAM;
  const grandTotal = totalKebersihan + totalSatpam;

  const handleLunasAkhirTahun = (type) => {
    if (!selectedBulan || !selectedWarga) return;
    const [monthStr] = selectedBulan.split(' ');
    const monthNames = ['januari', 'februari', 'maret', 'april', 'mei', 'juni', 'juli', 'agustus', 'september', 'oktober', 'november', 'desember'];
    const monthIndex = monthNames.indexOf(monthStr.toLowerCase());
    const remainingMonths = 12 - monthIndex;

    if (type === 'kebersihan') {
      const tunggakan = selectedWarga.tunggakan.kebersihan || 0;
      setBulanKebersihan(tunggakan + remainingMonths);
    } else if (type === 'satpam') {
      const tunggakan = selectedWarga.tunggakan.satpam || 0;
      setBulanSatpam(tunggakan + remainingMonths);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedWarga) return alert('Silakan pilih warga terlebih dahulu.');
    if (grandTotal <= 0) {
      return alert('Total pembayaran adalah nol. Silakan pilih durasi pembayaran.');
    }

    onSubmit({
      penghuniId: selectedWarga.id,
      bulanKebersihan,
      bulanSatpam,
    });
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Catat Pembayaran Iuran Warga"
      size="5xl"
      contentClassName="overflow-y-auto sm:overflow-visible max-h-[85vh] sm:max-h-none custom-scrollbar"
    >
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 p-1">
          {/* Left Column: Warga Selection & Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="relative" ref={searchRef}>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Pilih Warga / Penghuni
              </label>
              <div className="relative">
            <Input
              icon={HiMagnifyingGlass}
              value={wargaSearchQuery}
              onChange={(e) => {
                setWargaSearchQuery(e.target.value);
                if (selectedPenghuniId) setSelectedPenghuniId('');
                if (!isWargaDropdownOpen) setIsWargaDropdownOpen(true);
              }}
              onFocus={() => setIsWargaDropdownOpen(true)}
              placeholder="Cari nama atau nomor rumah..."
              required
            />
                <button type="button" onClick={() => setIsWargaDropdownOpen(!isWargaDropdownOpen)} className="absolute inset-y-0 right-0 flex items-center pr-3">
                  <HiChevronDown className="h-5 w-5 text-gray-400" />
                </button>
              </div>

              {isWargaDropdownOpen && (
            <div className="absolute z-50 mt-1 w-full bg-white dark:bg-slate-800 shadow-lg rounded-md border border-slate-200 dark:border-slate-600 max-h-60 overflow-auto">
              <ul className="py-1">
                {filteredAvailablePenghuni.length > 0 ? filteredAvailablePenghuni.map((w) => (
                  <li
                    key={w.id}
                    onClick={() => handleSelectWarga(w)}
                    className="px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 cursor-pointer"
                  >
                    {w.nama} - Rumah {w.nomorRumah}
                    {(w.tunggakan.kebersihan > 0 || w.tunggakan.satpam > 0) && (
                      <span className="ml-2 text-xs text-rose-500">(Ada Tunggakan)</span>
                    )}
                  </li>
                )) : (
                  <li className="px-4 py-2 text-sm text-slate-500">Warga tidak ditemukan.</li>
                )}
              </ul>
            </div>
              )}
            </div>

            {/* Warga Info Card */}
            {selectedWarga && (
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 space-y-4 animate-fade-in">
                <h3 className="font-bold text-slate-800 dark:text-slate-100 text-sm border-b border-slate-200 dark:border-slate-700 pb-2">
                  Detail Penghuni
                </h3>
                <div className="space-y-3 text-xs">
                  <div className="flex items-start gap-3">
                    <HiOutlineUserCircle className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500">Nama Penghuni</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedWarga.nama}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HiOutlineHome className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500">Nomor Rumah</p>
                      <p className="font-semibold text-slate-700 dark:text-slate-200">{selectedWarga.nomorRumah}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <HiOutlineIdentification className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-slate-500">Status Saat Ini</p>
                      <div className="flex items-center gap-4 mt-1">
                        <Badge variant={selectedWarga.isKebersihanLunas ? 'success' : 'danger'}>{selectedWarga.kebersihanStatus}</Badge>
                        <Badge variant={selectedWarga.isSatpamLunas ? 'success' : 'danger'}>{selectedWarga.satpamStatus}</Badge>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Payment Details */}
          <div className="lg:col-span-3">
            {selectedWarga ? (
              <div className="space-y-5 animate-fade-in">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {/* Iuran Kebersihan Card */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-600/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Iuran Kebersihan</h3>
                  <span className="text-xs text-slate-400">Rp {TARIF_KEBERSIHAN.toLocaleString('id-ID')}/bln</span>
                </div>
                {selectedWarga.tunggakan.kebersihan > 0 && (
                  <div className="p-2 text-xs text-amber-800 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 rounded-md">
                    Tunggakan: <span className="font-bold">{selectedWarga.tunggakan.kebersihan} bulan</span>. Pembayaran akan dihitung dari tunggakan pertama.
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    Total bulan yang ingin dibayar
                  </label>
                  <Input
                    type="number"
                    value={bulanKebersihan}
                    onChange={(e) => setBulanKebersihan(Number(e.target.value))}
                    min="0"
                    placeholder="0"
                  />
                  <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => handleLunasAkhirTahun('kebersihan')}
                    className="mt-2 p-2"
                  >
                    Lunasi s/d Akhir Tahun
                  </Button>
                </div>
                <div className="text-right pt-2 border-t border-slate-200/60 dark:border-slate-600/60">
                  <span className="text-xs text-slate-400 block">Subtotal Kebersihan:</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Rp {totalKebersihan.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>

              {/* Iuran Satpam Card */}
              <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-200/80 dark:border-slate-600/80 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-200">Iuran Satpam</h3>
                  <span className="text-xs text-slate-400">Rp {TARIF_SATPAM.toLocaleString('id-ID')}/bln</span>
                </div>
                {selectedWarga.tunggakan.satpam > 0 && (
                  <div className="p-2 text-xs text-amber-800 bg-amber-100 dark:bg-amber-900/40 dark:text-amber-300 rounded-md">
                    Tunggakan: <span className="font-bold">{selectedWarga.tunggakan.satpam} bulan</span>. Pembayaran akan dihitung dari tunggakan pertama.
                  </div>
                )}
                <div>
                  <label className="block text-xs text-slate-500 dark:text-slate-400 mb-1.5">
                    Total bulan yang ingin dibayar
                  </label>
                  <Input
                    type="number"
                    value={bulanSatpam}
                    onChange={(e) => setBulanSatpam(Number(e.target.value))}
                    min="0"
                    placeholder="0"
                  />
                  <Button
                    type="button"
                    size="md"
                    variant="secondary"
                    onClick={() => handleLunasAkhirTahun('satpam')}
                    className="mt-2 p-2"
                  >
                    Lunasi s/d Akhir Tahun
                  </Button>
                </div>
                <div className="text-right pt-2 border-t border-slate-200/60 dark:border-slate-600/60">
                  <span className="text-xs text-slate-400 block">Subtotal Satpam:</span>
                  <span className="text-base font-bold text-slate-800 dark:text-slate-100">
                    Rp {totalSatpam.toLocaleString('id-ID')}
                  </span>
                </div>
              </div>
            </div>

                {/* Total Bayar */}
                <div className="p-4 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 flex items-center justify-between">
                  <div className="text-sm font-semibold text-emerald-800 dark:text-emerald-300">Total Pembayaran</div>
                  <div className="text-2xl font-bold text-emerald-700 dark:text-emerald-400">
                    Rp {grandTotal.toLocaleString('id-ID')}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center h-full p-8 rounded-lg bg-slate-50 dark:bg-slate-800/50 border-2 border-dashed border-slate-200 dark:border-slate-700">
                <p className="text-sm text-slate-500 text-center">
                  Pilih warga terlebih dahulu untuk melihat detail pembayaran.
                </p>
              </div>
            )}
          </div>
        </div>
        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary" disabled={!selectedPenghuniId || grandTotal <= 0}>
            Simpan Transaksi
          </Button>
        </div>
      </form>
    </Modal>
  );
}