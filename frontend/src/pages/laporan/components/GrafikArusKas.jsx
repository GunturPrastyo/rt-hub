import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend
} from 'recharts';
import { HiCalendarDays } from 'react-icons/hi2';

export default function GrafikArusKas({ grafik, formatCurrency, selectedYear, yearOptions, onYearChange }) {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">
            Grafik Arus Kas
          </h2>
          <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
            Perbandingan pemasukan dan pengeluaran selama setahun.
          </p>
        </div>

        {/* Dropdown Filter Tahun */}
        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-600 shrink-0">
          <HiCalendarDays className="w-4 h-4 text-slate-500" />
          <select
            value={selectedYear}
            onChange={(e) => onYearChange(Number(e.target.value))}
            className="bg-transparent border-none text-slate-700 dark:text-slate-200 font-semibold focus:ring-0 cursor-pointer text-xs p-0"
          >
            {yearOptions && yearOptions.length > 0 ? (
              yearOptions.map((year) => (
                <option key={year} value={year}>Tahun {year}</option>
              ))
            ) : (
              <option value={selectedYear}>Tahun {selectedYear}</option>
            )}
          </select>
        </div>
      </div>

      <div className="h-80 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={grafik} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#cbd5e1" opacity={0.4} />
            <XAxis 
              dataKey="bulan" 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              dy={10}
            />
            <YAxis 
              tickLine={false} 
              axisLine={false} 
              tick={{ fontSize: 12, fill: '#64748b' }} 
              tickFormatter={(val) => `${val / 1000}k`} 
            />
            <Tooltip
              formatter={(value) => [formatCurrency(value)]}
              contentStyle={{ backgroundColor: '#0f172a', borderRadius: '8px', border: 'none', color: '#fff', fontSize: '12px' }}
              cursor={{ fill: '#f1f5f9', opacity: 0.1 }} // Memberikan highlight tipis pada background saat di-hover
            />
            <Legend wrapperStyle={{ paddingTop: '15px', fontSize: '12px' }} />
            
            {/* Dikembalikan menggunakan Bar Chart dengan sudut membulat di atas (radius) */}
            <Bar 
              dataKey="pemasukan" 
              name="Pemasukan (Iuran)" 
              fill="#10b981" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
            <Bar 
              dataKey="pengeluaran" 
              name="Pengeluaran RT" 
              fill="#f43f5e" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40} 
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}