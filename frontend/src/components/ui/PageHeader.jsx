export default function PageHeader({ title, description, titleSize = '2xl', children }) {
  const titleSizeVariants = {
    '2xl': 'text-2xl',
    
  };

  const titleClass = titleSizeVariants[titleSize] || titleSizeVariants['2xl'];

  return (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mt-4">
      <div>
        <h1 className={`${titleClass} font-bold font-heading text-slate-800 dark:text-slate-100`}>
          {title}
        </h1>
        {description && (
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        )}
      </div>
      {children}
    </div>
  );
}