export default function PenghuniCardSkeleton() {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm animate-pulse">
      <div>
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="min-w-0 flex-1">
            <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-3/4"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-1/2 mt-2"></div>
          </div>
          <div className="h-5 bg-slate-200 dark:bg-slate-700 rounded w-16 shrink-0"></div>
        </div>

        <div className="py-4 space-y-3 text-xs">
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-24"></div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="w-4 h-4 bg-slate-200 dark:bg-slate-700 rounded-full shrink-0"></div>
            <div className="h-3 bg-slate-200 dark:bg-slate-700 rounded w-32"></div>
          </div>
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        <div className="h-4 bg-slate-200 dark:bg-slate-700 rounded w-20"></div>
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
          <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-md"></div>
        </div>
      </div>
    </div>
  );
}