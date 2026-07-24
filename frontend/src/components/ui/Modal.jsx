import { useEffect } from 'react';
import { HiXMark } from 'react-icons/hi2';

export default function Modal({ isOpen, onClose, title, children, contentClassName = '' }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity" onClick={onClose} />

      {/* Content Container */}
      <div className="relative w-full max-w-4xl bg-white dark:bg-slate-800 rounded-t-2xl sm:rounded-lg shadow-xl border border-slate-200/80 dark:border-slate-700/80 z-10 transform transition-all animate-in slide-in-from-bottom sm:animate-in sm:fade-in-50 sm:zoom-in-95">
        
        {/* Mobile Handle Bar */}
        <div className="w-12 h-1.5 bg-slate-300 dark:bg-slate-600 rounded-full mx-auto mt-3 mb-1 sm:hidden" />

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-700/80">
          <h2 className="text-lg font-bold font-heading text-slate-800 dark:text-slate-100">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            <HiXMark size={20} />
          </button>
        </div>

        {/* Body (Diizinkan Overflow-visible untuk Desktop Popover) */}
        <div className={`p-6 ${contentClassName}`}>
          {children}
        </div>
      </div>
    </div>
  );
}