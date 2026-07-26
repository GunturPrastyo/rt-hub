import { useEffect } from 'react';
import { HiCheckCircle, HiXCircle, HiInformationCircle, HiXMark } from 'react-icons/hi2';

export default function ToastNotification({ message, type, isVisible, onDismiss, duration = 3000 }) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onDismiss();
      }, duration);
      return () => clearTimeout(timer);
    }
  }, [isVisible, onDismiss, duration]);

  if (!isVisible) return null;

  const typeClasses = {
    success: 'bg-emerald-500 border-emerald-600 text-white',
    error: 'bg-red-500 border-red-600 text-white',
    info: 'bg-blue-500 border-blue-600 text-white',
  };

  const iconClasses = {
    success: <HiCheckCircle className="w-5 h-5" />,
    error: <HiXCircle className="w-5 h-5" />,
    info: <HiInformationCircle className="w-5 h-5" />,
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <div
        className={`flex items-center gap-3 p-4 pr-6 rounded-lg shadow-lg border ${typeClasses[type]} animate-in slide-in-from-bottom-full fade-in duration-300`}
        role="alert"
      >
        <div className="shrink-0">
          {iconClasses[type]}
        </div>
        <span className="text-sm font-medium">
          {message}
        </span>
        <button
          onClick={onDismiss}
          className="absolute top-1 right-1 p-1 rounded-full hover:bg-white/20 transition-colors"
          aria-label="Dismiss"
        >
          <HiXMark className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}