import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { HiOutlineHome, HiOutlineUser } from 'react-icons/hi2';

export default function RumahFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    onSubmit({
      nomorRumah: formData.get('nomorRumah'),
      status: formData.get('status'),
      penghuni: formData.get('penghuni') || '-',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Nomor Rumah"
          name="nomorRumah"
          icon={HiOutlineHome}
          defaultValue={initialData?.nomorRumah || ''}
          placeholder="Contoh: A-01"
          required
        />

        <Select label="Status Hunian" name="status" defaultValue={initialData?.status || 'Dihuni'}>
          <option value="Dihuni">Dihuni</option>
          <option value="Kosong">Kosong</option>
        </Select>

        <Input
          label="Penghuni Utama (Opsional)"
          name="penghuni"
          icon={HiOutlineUser}
          defaultValue={initialData?.penghuni !== '-' ? initialData?.penghuni : ''}
          placeholder="Nama Kepala Keluarga / Penghuni"
        />

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Simpan Perubahan' : 'Tambah Rumah'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}