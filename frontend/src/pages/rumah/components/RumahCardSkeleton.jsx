import React from 'react';

export default function RumahCardSkeleton() {
  return (
    <div className="p-5 bg-slate-50 dark:bg-slate-800/50 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm flex flex-col justify-between min-h-[200px]">
      <div>
        {/* Header Skeleton */}
        <div className="flex items-start justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-700/60">
          <div className="flex items-center gap-2">
            {/* Box Nomor Rumah */}
            <div className="w-9 h-9 rounded-lg bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0"></div>
            {/* Teks Blok */}
            <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          </div>
          {/* Badge Status */}
          <div className="w-14 h-5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse shrink-0"></div>
        </div>

        {/* Body Skeleton */}
        <div className="py-4 space-y-3">
          <div className="flex items-start gap-2.5">
            {/* Icon User */}
            <div className="w-4 h-4 rounded-full bg-slate-200 dark:bg-slate-700 animate-pulse mt-0.5 shrink-0"></div>
            <div className="space-y-2">
              {/* Label Penghuni Utama */}
              <div className="w-20 h-2.5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
              {/* Nama Penghuni */}
              <div className="w-32 h-3.5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            </div>
          </div>

          <div className="flex items-center justify-between pt-1">
            <div className="w-16 h-2.5 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
            <div className="w-12 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          </div>
        </div>
      </div>

      {/* Footer Skeleton */}
      <div className="pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
        {/* Info Iuran */}
        <div className="w-16 h-3 rounded bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        
        {/* Tombol Aksi */}
        <div className="flex items-center gap-1">
          <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
          <div className="w-7 h-7 rounded-md bg-slate-200 dark:bg-slate-700 animate-pulse"></div>
        </div>
      </div>
    </div>
  );
}