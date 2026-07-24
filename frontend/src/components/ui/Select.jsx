export default function Select({ label, children, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <select
        className={`w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all ${className}`}
        {...props}
      >
        {children}
      </select>
    </div>
  );
}