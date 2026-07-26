import Modal from './Modal';
import Button from './Button';
import { HiOutlineExclamationTriangle } from 'react-icons/hi2';

export default function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title = "Konfirmasi",
  message = "Apakah Anda yakin ingin melanjutkan tindakan ini?",
  confirmText = "Konfirmasi",
  cancelText = "Batal",
  isConfirming = false,
  variant = 'danger'
}) {
  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="md">
      <div className="flex flex-col items-center text-center">
        <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 ${variant === 'danger' ? 'bg-rose-100 dark:bg-rose-900/50' : 'bg-blue-100 dark:bg-blue-900/50'}`}>
          <HiOutlineExclamationTriangle className={`w-8 h-8 ${variant === 'danger' ? 'text-rose-500' : 'text-blue-500'}`} />
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 mb-6 max-w-sm">
          {message}
        </p>
        <div className="flex items-center justify-center gap-3 w-full">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isConfirming} className="w-full">
            {cancelText}
          </Button>
          <Button type="button" variant={variant} onClick={onConfirm} disabled={isConfirming} className="w-full">
            {isConfirming ? 'Memproses...' : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}