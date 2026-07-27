import { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { 
  HiOutlineHome, 
  HiMagnifyingGlass, 
  HiChevronUpDown, 
  HiCheck,
  HiOutlineUser
} from 'react-icons/hi2';

export default function RumahFormModal({ 
  isOpen, 
  onClose, 
  onSubmit, 
  initialData, 
  availablePenghuni = [],
  rumahList = [], 
  isSubmitting 
}) {
  // STATE BARU: Hanya bergantung pada ID Penghuni yang dipilih
  const [selectedPenghuniId, setSelectedPenghuniId] = useState('kosong');
  
  const [searchPenghuniQuery, setSearchPenghuniQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      // Jika ada penghuniId, set ID-nya. Jika tidak, set ke 'kosong'
      setSelectedPenghuniId(initialData.penghuniId ? String(initialData.penghuniId) : 'kosong');
    } else {
      setSelectedPenghuniId('kosong');
    }
    setSearchPenghuniQuery('');
    setIsDropdownOpen(false);
  }, [initialData, isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Cari ID penghuni yang SUDAH menempati rumah LAIN
  const occupiedPenghuniIds = rumahList
    .filter(r => r.id !== initialData?.id) 
    .map(r => String(r.penghuniId))
    .filter(id => id !== 'null' && id !== 'undefined');

  // Filter dropdown warga
  const filteredPenghuni = availablePenghuni.filter((warga) => {
    const matchesSearch = 
      warga.nama.toLowerCase().includes(searchPenghuniQuery.toLowerCase()) ||
      (warga.telepon && warga.telepon.includes(searchPenghuniQuery));
    
    const isNotOccupyingOtherHouse = !occupiedPenghuniIds.includes(String(warga.id));

    return matchesSearch && isNotOccupyingOtherHouse;
  });

  const selectedWargaObj = availablePenghuni.find(
    (p) => String(p.id) === String(selectedPenghuniId)
  );

  // LOGIKA STATUS OTOMATIS
  const isDihuni = selectedPenghuniId !== 'kosong';
  const computedStatus = isDihuni ? 'Dihuni' : 'Kosong';

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    onSubmit({
      nomorRumah: formData.get('nomorRumah'),
      status: computedStatus, // Mengirim status yang dihitung otomatis
      penghuniId: isDihuni && selectedWargaObj ? selectedWargaObj.id : null,
      penghuniNama: isDihuni && selectedWargaObj ? selectedWargaObj.nama : '-',
      tipePenghuni: isDihuni && selectedWargaObj ? selectedWargaObj.statusWarga : '-',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}
      contentClassName="sm:overflow-visible overflow-y-auto max-h-[85vh] sm:max-h-none custom-scrollbar"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        
        {/* Nomor Rumah */}
        <Input
          label="Nomor Rumah"
          name="nomorRumah"
          icon={HiOutlineHome}
          defaultValue={initialData?.nomorRumah || ''}
          placeholder="Contoh: A-01"
          required
        />

        {/* Custom Searchable Dropdown Penghuni */}
        <div className="relative" ref={dropdownRef}>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Tetapkan Penghuni Utama
          </label>

          <button
            type="button"
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            className={`w-full flex items-center justify-between px-4 py-3 border rounded-lg text-sm text-left focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all ${
              isDropdownOpen 
                ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800' 
                : 'bg-slate-50 dark:bg-slate-700/50 border-slate-200 dark:border-slate-600'
            }`}
          >
            <div className="flex items-center gap-3">
              <div className={`p-1.5 rounded-md ${isDihuni ? 'bg-blue-100 text-blue-600 dark:bg-blue-900/50 dark:text-blue-400' : 'bg-slate-200 text-slate-500 dark:bg-slate-600 dark:text-slate-400'}`}>
                <HiOutlineUser className="w-4 h-4" />
              </div>
              <span className={isDihuni ? 'font-semibold text-slate-800 dark:text-slate-100' : 'text-slate-500 dark:text-slate-400 font-medium'}>
                {isDihuni && selectedWargaObj
                  ? `${selectedWargaObj.nama} (${selectedWargaObj.statusWarga})`
                  : '-- Tidak Ada Penghuni (Kosong) --'}
              </span>
            </div>
            <HiChevronUpDown className="w-5 h-5 text-slate-400" />
          </button>

          {/* Dropdown Menu */}
          {isDropdownOpen && (
            <div className="absolute top-full left-0 w-full mt-1.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
              <div className="p-2 border-b border-slate-100 dark:border-slate-700 relative bg-slate-50/50 dark:bg-slate-800/50">
                <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={searchPenghuniQuery}
                  onChange={(e) => setSearchPenghuniQuery(e.target.value)}
                  placeholder="Cari nama atau telepon..."
                  className="w-full pl-9 pr-3 py-2 text-xs bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-blue-400"
                  autoFocus
                />
              </div>

              <ul className="max-h-56 overflow-y-auto custom-scrollbar divide-y divide-slate-50 dark:divide-slate-700/40">
                
                {/* Opsi Statis: Kosongkan Unit */}
                <li>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPenghuniId('kosong');
                      setIsDropdownOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-4 py-3 text-xs text-left transition-colors ${
                      selectedPenghuniId === 'kosong'
                        ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-600 dark:text-slate-400'
                    }`}
                  >
                    <span className="italic">-- Kosongkan Unit (Tidak Ada Penghuni) --</span>
                    {selectedPenghuniId === 'kosong' && <HiCheck className="w-4 h-4" />}
                  </button>
                </li>

                {/* List Dinamis: Warga yang Tersedia */}
                {filteredPenghuni.length > 0 ? (
                  filteredPenghuni.map((warga) => {
                    const isSelected = String(warga.id) === String(selectedPenghuniId);
                    return (
                      <li key={warga.id}>
                        <button
                          type="button"
                          onClick={() => {
                            setSelectedPenghuniId(String(warga.id));
                            setIsDropdownOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-4 py-2.5 text-xs text-left transition-colors ${
                            isSelected
                              ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 font-semibold'
                              : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                          }`}
                        >
                          <div>
                            <div className="font-bold text-sm mb-0.5">{warga.nama}</div>
                            <div className="text-[10px] text-slate-500 dark:text-slate-400 flex items-center gap-1">
                              <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded">{warga.statusWarga}</span> 
                              <span>• Telp: {warga.telepon}</span>
                            </div>
                          </div>
                          {isSelected && <HiCheck className="w-4 h-4" />}
                        </button>
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-4 text-xs text-center text-slate-400">
                    Semua warga sudah menempati rumah lain.
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>

        {/* Indikator Status Hunian (Read-Only) */}
        <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg border border-slate-100 dark:border-slate-700 flex items-center justify-between">
          <div>
            <span className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">
              Status Hunian Otomatis
            </span>
            <p className="text-xs text-slate-400">Status berubah menyesuaikan pilihan penghuni di atas.</p>
          </div>
          
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-bold ${
            isDihuni 
              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800/50' 
              : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 border border-amber-200 dark:border-amber-800/50'
          }`}>
            <span className={`w-2 h-2 rounded-full ${isDihuni ? 'bg-emerald-500' : 'bg-amber-500'}`} />
            {computedStatus}
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          
          <Button type="submit" variant="primary" disabled={isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              initialData ? 'Simpan Perubahan' : 'Tambah Rumah'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}