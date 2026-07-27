import { useState, useEffect } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { HiOutlineDocumentText, HiOutlineBanknotes } from 'react-icons/hi2';

export default function PengeluaranFormModal({ isOpen, onClose, onSubmit, sisaSaldo, isSubmitting }) {
  const [nominal, setNominal] = useState('');
  const [error, setError] = useState('');

  // Reset form saat modal ditutup
  useEffect(() => {
    if (!isOpen) {
      setNominal('');
      setError('');
    }
  }, [isOpen]);

  const handleNominalChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setNominal(rawValue);

    // Validasi Real-time: Jika nominal melebihi sisa saldo
    if (sisaSaldo !== undefined && rawValue && Number(rawValue) > sisaSaldo) {
      setError(`Nominal melebihi sisa saldo kas (Rp ${new Intl.NumberFormat('id-ID').format(sisaSaldo)})`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error || !nominal) return; 
    
    const formData = new FormData(e.target);

    onSubmit({
      keterangan: formData.get('keterangan'),
      nominal: Number(nominal),
      kategori: formData.get('kategori'),
      tanggal: formData.get('tanggal'),
    });
  };

  const formattedNominal = nominal === '' ? '' : new Intl.NumberFormat('id-ID').format(nominal);

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catat Pengeluaran RT">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Keterangan Pengeluaran"
          name="keterangan"
          icon={HiOutlineDocumentText}
          placeholder="Contoh: Gaji Satpam Bulan Juli"
          required
        />

        <Input
          label="Nominal (Rp)"
          name="nominal"
          type="text"
          inputMode="numeric"
          icon={HiOutlineBanknotes}
          placeholder="1.200.000"
          value={formattedNominal}
          onChange={handleNominalChange}
          required
        />
        {/* Tampilkan pesan error real-time */}
        {error && <p className="text-xs text-red-500 -mt-2">{error}</p>}

        <div>
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Kategori Pengeluaran
          </label>
          <select
            name="kategori"
            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none"
            required
          >
            <option value="Operasional Kebersihan">Operasional Kebersihan</option>
            <option value="Gaji & Keamanan">Gaji & Keamanan</option>
            <option value="Perbaikan Fasum">Perbaikan Fasum</option>
            <option value="Lain-lain">Lain-lain</option>
          </select>
        </div>

        <Input
          label="Tanggal Pengeluaran"
          name="tanggal"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          
          {/* Tombol akan disabled jika ada error (saldo kurang) ATAU nominal kosong ATAU sedang submitting */}
          <Button type="submit" variant="primary" disabled={!!error || !nominal || isSubmitting}>
            {isSubmitting ? (
              <span className="flex items-center gap-2">
                <svg className="animate-spin h-4 w-4 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Menyimpan...
              </span>
            ) : (
              'Catat Pengeluaran'
            )}
          </Button>
        </div>
      </form>
    </Modal>
  );
}