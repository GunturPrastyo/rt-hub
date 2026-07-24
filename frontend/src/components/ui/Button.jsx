export default function Button({ children, variant = 'primary', size = 'md', className = '', ...props }) {
  const baseStyles = 'inline-flex items-center justify-center font-semibold rounded-lg transition-colors focus:outline-none';
  
  const variants = {
    primary: 'bg-slate-900 hover:bg-slate-800 dark:bg-slate-100 dark:hover:bg-white text-white dark:text-slate-900 shadow-sm',
    secondary: 'bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 shadow-sm',
    ghost: 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700',
    danger: 'bg-rose-500 hover:bg-rose-600 text-white shadow-sm',
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-xs gap-1.5',
    md: 'px-4 py-2.5 text-xs gap-2',
    lg: 'px-5 py-3 text-sm gap-2',
  };

  return (
    <button className={`${baseStyles} ${variants[variant]} ${sizes[size]} ${className}`} {...props}>
      {children}
    </button>
  );
}