export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-slate-100 text-slate-700 dark:bg-slate-700 dark:text-slate-200',
    success: 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-400',
    warning: 'bg-amber-100 text-amber-700 dark:bg-amber-950/60 dark:text-amber-400',
    danger: 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-md text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}