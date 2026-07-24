import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Select from '../../../components/ui/Select';
import Button from '../../../components/ui/Button';
import { HiOutlineHome } from 'react-icons/hi2';

export default function RumahFormModal({ isOpen, onClose, onSubmit, initialData, availablePenghuni = [] }) {
  const [statusHunian, setStatusHunian] = useState('Dihuni');

  useEffect(() => {
    if (initialData) {
      setStatusHunian(initialData.status || 'Dihuni');
    } else {
      setStatusHunian('Dihuni');
    }
  }, [initialData, isOpen]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    
    const isDihuni = statusHunian === 'Dihuni';
    const penghuniId = isDihuni ? formData.get('penghuniId') : null;
    const selectedWarga = availablePenghuni.find((p) => String(p.id) === String(penghuniId));

    onSubmit({
      nomorRumah: formData.get('nomorRumah'),
      status: statusHunian,
      penghuniId: isDihuni ? penghuniId : null,
      penghuniNama: isDihuni && selectedWarga ? selectedWarga.nama : '-',
      tipePenghuni: isDihuni && selectedWarga ? selectedWarga.statusWarga : '-',
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={initialData ? 'Edit Data Rumah' : 'Tambah Rumah Baru'}>
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
        <Select
          label="Status Hunian"
          name="status"
          value={statusHunian}
          onChange={(e) => setStatusHunian(e.target.value)}
        >
          <option value="Dihuni">Dihuni</option>
          <option value="Kosong">Kosong</option>
        </Select>

        {/* Dynamic Dropdown Penghuni: Hanya muncul jika status Dihuni */}
        {statusHunian === 'Dihuni' && (
          <Select
            label="Pilih Penghuni Utama"
            name="penghuniId"
            defaultValue={initialData?.penghuniId || ''}
            required
          >
            <option value="">-- Pilih Warga / Penghuni --</option>
            {availablePenghuni.map((warga) => (
              <option key={warga.id} value={warga.id}>
                {warga.nama} ({warga.statusWarga} - NIK: {warga.nik})
              </option>
            ))}
          </Select>
        )}

        {/* Actions */}
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