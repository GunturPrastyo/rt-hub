export default function Input({ label, icon: Icon, error, className = '', ...props }) {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
          {label}
        </label>
      )}
      <div className="relative">
        {Icon && <Icon className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
        <input
          className={`w-full ${Icon ? 'pl-10' : 'px-4'} pr-4 py-2.5 bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-600 rounded-lg text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-400/20 transition-all ${className}`}
          {...props}
        />
      </div>
      {error && <p className="text-xs text-rose-500 mt-1">{error}</p>}
    </div>
  );
}