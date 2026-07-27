import { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { 
  HiOutlineHome, 
  HiMagnifyingGlass, 
  HiChevronUpDown, 
  HiCheck 
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
  const [statusHunian, setStatusHunian] = useState('Dihuni');
  
  const [selectedPenghuniId, setSelectedPenghuniId] = useState('');
  const [searchPenghuniQuery, setSearchPenghuniQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (initialData) {
      setStatusHunian(initialData.status || 'Dihuni');
      setSelectedPenghuniId(initialData.penghuniId ? String(initialData.penghuniId) : '');
    } else {
      setStatusHunian('Dihuni');
      setSelectedPenghuniId('');
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

  //  Filter dropdown warga
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

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const isDihuni = statusHunian === 'Dihuni';
    const selectedWarga = isDihuni ? selectedWargaObj : null;

    onSubmit({
      nomorRumah: formData.get('nomorRumah'),
      status: statusHunian,
      penghuniId: isDihuni && selectedWarga ? selectedWarga.id : null,
      penghuniNama: isDihuni && selectedWarga ? selectedWarga.nama : '-',
      tipePenghuni: isDihuni && selectedWarga ? selectedWarga.statusWarga : '-',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}
      contentClassName="sm:overflow-visible overflow-y-auto max-h-[85vh] sm:max-h-none custom-scrollbar"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nomor Rumah */}
        <Input
          label="Nomor Rumah"
          name="nomorRumah"
          icon={HiOutlineHome}
          defaultValue={initialData?.nomorRumah || ''}
          placeholder="Contoh: A-01"
          required
        />

        {/* Status Hunian */}
        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Status Hunian
          </label>

          <div className="grid grid-cols-2 gap-3">
            <label
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                statusHunian === 'Dihuni'
                  ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusHunian === 'Dihuni' ? 'bg-emerald-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>Dihuni</span>
              </div>
              <input
                type="radio"
                name="status"
                value="Dihuni"
                checked={statusHunian === 'Dihuni'}
                onChange={() => setStatusHunian('Dihuni')}
                className="sr-only"
              />
              {statusHunian === 'Dihuni' && <HiCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
            </label>

            <label
              className={`flex items-center justify-between px-4 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                statusHunian === 'Kosong'
                  ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                  : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
              }`}
            >
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${statusHunian === 'Kosong' ? 'bg-amber-500' : 'bg-slate-300 dark:bg-slate-600'}`} />
                <span>Kosong</span>
              </div>
              <input
                type="radio"
                name="status"
                value="Kosong"
                checked={statusHunian === 'Kosong'}
                onChange={() => setStatusHunian('Kosong')}
                className="sr-only"
              />
              {statusHunian === 'Kosong' && <HiCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
            </label>
          </div>
        </div>

        {/* Custom Searchable Dropdown */}
        {statusHunian === 'Dihuni' && (
          <div className="relative" ref={dropdownRef}>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
              Pilih Penghuni Utama
            </label>

            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full flex items-center justify-between px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-left text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all"
            >
              <span className={selectedWargaObj ? 'font-medium' : 'text-slate-400'}>
                {selectedWargaObj
                  ? `${selectedWargaObj.nama} (${selectedWargaObj.statusWarga})`
                  : '-- Pilih Warga / Penghuni --'}
              </span>
              <HiChevronUpDown className="w-5 h-5 text-slate-400" />
            </button>

            {/* Dropdown Menu (Terbuka Kebawah di Semua Screen) */}
            {isDropdownOpen && (
              <div className="absolute top-full left-0 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-xl z-50 overflow-hidden">
                {/* Searchbar */}
                <div className="p-2 border-b border-slate-100 dark:border-slate-700 relative">
                  <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={searchPenghuniQuery}
                    onChange={(e) => setSearchPenghuniQuery(e.target.value)}
                    placeholder="Cari nama atau telepon..."
                    className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 dark:bg-slate-700/60 border border-slate-200 dark:border-slate-600 rounded-md text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
                    autoFocus
                  />
                </div>

                {/* List Warga */}
                <ul className="max-h-48 overflow-y-auto custom-scrollbar divide-y divide-slate-50 dark:divide-slate-700/40">
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
                                ? 'bg-slate-100 dark:bg-slate-700 text-slate-900 dark:text-white font-semibold'
                                : 'hover:bg-slate-50 dark:hover:bg-slate-700/50 text-slate-700 dark:text-slate-300'
                            }`}
                          >
                            <div>
                              <div className="font-semibold text-slate-800 dark:text-slate-200">{warga.nama}</div>
                              <div className="text-[10px] text-slate-400">
                                {warga.statusWarga} • Telp: {warga.telepon}
                              </div>
                            </div>
                            {isSelected && <HiCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
                          </button>
                        </li>
                      );
                    })
                  ) : (
                    <li className="px-4 py-3 text-xs text-center text-slate-400">
                      Tidak ada warga yang tersedia.
                    </li>
                  )}
                </ul>
              </div>
            )}
          </div>
        )}

        {/* Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          
          {/* LOGIKA BARU: Indikator Loading di Tombol Submit */}
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