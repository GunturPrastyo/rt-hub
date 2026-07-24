import { useState, useEffect } from 'react';
import Modal from '../../../components/ui/Modal';
import Input from '../../../components/ui/Input';
import Button from '../../../components/ui/Button';
import { 
  HiOutlineUser, 
  HiOutlinePhone, 
  HiOutlineCheck,
  HiOutlineArrowUpTray
} from 'react-icons/hi2';

export default function PenghuniFormModal({ isOpen, onClose, onSubmit, initialData }) {
  const [statusWarga, setStatusWarga] = useState('Tetap');
  const [statusPernikahan, setStatusPernikahan] = useState('Belum Menikah');
  const [ktpPreview, setKtpPreview] = useState(null);

  useEffect(() => {
    if (initialData) {
      setStatusWarga(initialData.statusWarga || 'Tetap');
      setStatusPernikahan(initialData.statusPernikahan || 'Belum Menikah');
      setKtpPreview(initialData.fotoKtp || null);
    } else {
      setStatusWarga('Tetap');
      setStatusPernikahan('Belum Menikah');
      setKtpPreview(null);
    }
  }, [initialData, isOpen]);

  // Handle Preview File KTP
  const handleKtpChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setKtpPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);

    onSubmit({
      nama: formData.get('nama'),
      telepon: formData.get('telepon'),
      statusWarga: statusWarga,
      statusPernikahan: statusPernikahan,
      fotoKtp: ktpPreview || 'https://placehold.co/600x400/e2e8f0/475569?text=KTP+Sample',
    });
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={initialData ? 'Edit Data Penghuni' : 'Tambah Penghuni Baru'}
      contentClassName="overflow-y-auto max-h-[85vh] custom-scrollbar sm:max-w-4xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Layout Split 2 Kolom Seimbang & Sejajar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-6 items-stretch">
          
          {/* Sisi Kiri: Upload & Preview KTP (Flex-col & Stretch Sejajar dengan Kanan) */}
          <div className="sm:col-span-5 flex flex-col space-y-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 uppercase tracking-wider shrink-0">
              Foto KTP Warga
            </label>

            <div className="border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-lg p-3 text-center hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors relative cursor-pointer flex-1 min-h-[220px] sm:min-h-0 flex flex-col items-center justify-center overflow-hidden">
              <input
                type="file"
                accept="image/*"
                onChange={handleKtpChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10"
              />

              {ktpPreview ? (
                <div className="relative w-full h-full flex items-center justify-center">
                  <img
                    src={ktpPreview}
                    alt="Preview KTP"
                    className="w-full h-full rounded-md object-cover border border-slate-200 dark:border-slate-600 shadow-xs"
                  />
                  <div className="absolute inset-0 bg-slate-900/40 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center rounded-md">
                    <span className="text-xs font-semibold text-white bg-slate-900/80 px-3 py-1.5 rounded-md shadow-xs">
                      Ganti Foto KTP
                    </span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 py-4">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 flex items-center justify-center mx-auto">
                    <HiOutlineArrowUpTray size={22} />
                  </div>
                  <div className="text-xs font-semibold text-slate-700 dark:text-slate-200">
                    Upload Foto KTP
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed px-2">
                    PNG, JPG, WEBP (Maks 2MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Sisi Kanan: Form Input Data Diri */}
          <div className="sm:col-span-7 space-y-4">
            {/* Nama Lengkap */}
            <Input
              label="Nama Lengkap"
              name="nama"
              icon={HiOutlineUser}
              defaultValue={initialData?.nama || ''}
              placeholder="Sesuai KTP..."
              required
            />

            {/* Nomor Telepon */}
            <Input
              label="Nomor Telepon / Whatsapp"
              name="telepon"
              type="tel"
              icon={HiOutlinePhone}
              defaultValue={initialData?.telepon || ''}
              placeholder="081234567890"
              required
            />

            {/* Status Penghuni (Tetap / Kontrak) */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Status Penghuni
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    statusWarga === 'Tetap'
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>Warga Tetap</span>
                  <input
                    type="radio"
                    name="statusWarga"
                    value="Tetap"
                    checked={statusWarga === 'Tetap'}
                    onChange={() => setStatusWarga('Tetap')}
                    className="sr-only"
                  />
                  {statusWarga === 'Tetap' && <HiOutlineCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
                </label>

                <label
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    statusWarga === 'Kontrak'
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>Warga Kontrak</span>
                  <input
                    type="radio"
                    name="statusWarga"
                    value="Kontrak"
                    checked={statusWarga === 'Kontrak'}
                    onChange={() => setStatusWarga('Kontrak')}
                    className="sr-only"
                  />
                  {statusWarga === 'Kontrak' && <HiOutlineCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
                </label>
              </div>
            </div>

            {/* Status Pernikahan */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
                Status Pernikahan
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    statusPernikahan === 'Menikah'
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>Sudah Menikah</span>
                  <input
                    type="radio"
                    name="statusPernikahan"
                    value="Menikah"
                    checked={statusPernikahan === 'Menikah'}
                    onChange={() => setStatusPernikahan('Menikah')}
                    className="sr-only"
                  />
                  {statusPernikahan === 'Menikah' && <HiOutlineCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
                </label>

                <label
                  className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg border text-xs font-medium cursor-pointer transition-all ${
                    statusPernikahan === 'Belum Menikah'
                      ? 'bg-slate-100 dark:bg-slate-700 border-slate-300 dark:border-slate-500 text-slate-900 dark:text-white font-semibold'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50'
                  }`}
                >
                  <span>Belum Menikah</span>
                  <input
                    type="radio"
                    name="statusPernikahan"
                    value="Belum Menikah"
                    checked={statusPernikahan === 'Belum Menikah'}
                    onChange={() => setStatusPernikahan('Belum Menikah')}
                    className="sr-only"
                  />
                  {statusPernikahan === 'Belum Menikah' && <HiOutlineCheck className="w-4 h-4 text-slate-700 dark:text-slate-200" />}
                </label>
              </div>
            </div>
          </div>
        </div>

        {/* Form Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/80">
          <Button type="button" variant="ghost" onClick={onClose}>
            Batal
          </Button>
          <Button type="submit" variant="primary">
            {initialData ? 'Simpan Perubahan' : 'Tambah Penghuni'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}