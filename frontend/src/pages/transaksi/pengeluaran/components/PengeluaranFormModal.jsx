import Modal from '../../../../components/ui/Modal';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import { HiOutlineDocumentText, HiOutlineBanknotes } from 'react-icons/hi2';

export default function PengeluaranFormModal({ isOpen, onClose, onSubmit }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    onSubmit({
      keterangan: formData.get('keterangan'),
      nominal: Number(formData.get('nominal')),
      kategori: formData.get('kategori'),
      tanggal: formData.get('tanggal'),
    });
  };

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
          type="number"
          icon={HiOutlineBanknotes}
          placeholder="1200000"
          required
        />

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
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            Catat Pengeluaran
          </Button>
        </div>
      </form>
    </Modal>
  );
}