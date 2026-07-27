import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

// Custom Tooltip untuk styling yang lebih baik
const CustomTooltip = ({ active, payload, label, formatCurrency }) => {
  if (active && payload && payload.length) {
    return (
      <div className="p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg shadow-lg">
        <p className="label text-sm font-bold text-slate-800 dark:text-slate-100">{`${label}`}</p>
        <p className="intro text-emerald-500">{`Pemasukan: ${formatCurrency(payload[0].value)}`}</p>
        <p className="intro text-rose-500">{`Pengeluaran: ${formatCurrency(payload[1].value)}`}</p>
      </div>
    );
  }
  return null;
};

export default function GrafikArusKas({ grafik, formatCurrency }) {
  // Formatter untuk label Sumbu Y (misal: 1000000 -> 1jt)
  const formatYAxis = (tick) => {
    if (tick >= 1000000) {
      return `${tick / 1000000}jt`;
    }
    if (tick >= 1000) {
      return `${tick / 1000}k`;
    }
    return tick;
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-lg border border-slate-200/80 dark:border-slate-700/80 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Grafik Arus Kas (Tahun Ini)</h2>
          <p className="text-xs text-slate-400">Visualisasi pemasukan vs pengeluaran per bulan.</p>
        </div>
      </div>

      <div style={{ width: '100%', height: 300 }}>
        <ResponsiveContainer>
          <BarChart
            data={grafik}
            margin={{ top: 5, right: 20, left: -10, bottom: 5 }}
            barGap={6}
          >
            <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.2} vertical={false} />
            <XAxis 
              dataKey="bulan" 
              tick={{ fontSize: 11, fill: 'rgb(100 116 139)' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <YAxis 
              tickFormatter={formatYAxis} 
              tick={{ fontSize: 11, fill: 'rgb(100 116 139)' }} 
              axisLine={false} 
              tickLine={false} 
            />
            <Tooltip content={<CustomTooltip formatCurrency={formatCurrency} />} cursor={{ fill: 'rgba(100, 116, 139, 0.1)' }} />
            <Legend iconType="circle" iconSize={8} wrapperStyle={{ fontSize: '12px', paddingTop: '20px' }} />
            <Bar dataKey="pemasukan" name="Pemasukan" fill="#10b981" radius={[4, 4, 0, 0]} />
            <Bar dataKey="pengeluaran" name="Pengeluaran" fill="#f43f5e" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}