import { useState } from 'react';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import { 
  HiOutlineUserGroup, 
  HiOutlineReceiptPercent, 
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

export default function RumahDetailDrawer({ isOpen, onClose, rumah }) {
  const [activeTab, setActiveTab] = useState('historyPenghuni'); // 'historyPenghuni' | 'historyPembayaran'

  if (!rumah) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail & Riwayat Rumah ${rumah.nomorRumah}`}>
      <div className="space-y-5">
        {/* Ringkasan Status Rumah */}
        <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
          <div>
            <div className="text-xs text-slate-400">Penghuni Saat Ini</div>
            <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
              {rumah.penghuniNama}
            </div>
          </div>
          <Badge variant={rumah.status === 'Dihuni' ? 'success' : 'warning'}>
            {rumah.status}
          </Badge>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-slate-200 dark:border-slate-700">
          <button
            onClick={() => setActiveTab('historyPenghuni')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'historyPenghuni'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <HiOutlineUserGroup size={16} />
            <span>Riwayat Penghuni ({rumah.historyPenghuni?.length || 0})</span>
          </button>

          <button
            onClick={() => setActiveTab('historyPembayaran')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${
              activeTab === 'historyPembayaran'
                ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
            }`}
          >
            <HiOutlineReceiptPercent size={16} />
            <span>Riwayat Pembayaran</span>
          </button>
        </div>

        {/* Tab Content 1: History Penghuni */}
        {activeTab === 'historyPenghuni' && (
          <div className="space-y-3">
            {rumah.historyPenghuni && rumah.historyPenghuni.length > 0 ? (
              rumah.historyPenghuni.map((item, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-start justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {item.nama}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5 flex items-center gap-1">
                      <HiOutlineCalendarDays size={14} />
                      <span>{item.periodeMasuk} s/d {item.periodeKeluar || 'Sekarang'}</span>
                    </div>
                  </div>
                  <Badge variant={item.statusKontrak === 'Aktif' ? 'success' : 'default'}>
                    {item.statusKontrak}
                  </Badge>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada catatan riwayat penghuni.</p>
            )}
          </div>
        )}

        {/* Tab Content 2: History Pembayaran Iuran */}
        {activeTab === 'historyPembayaran' && (
          <div className="space-y-3">
            {rumah.historyPembayaran && rumah.historyPembayaran.length > 0 ? (
              rumah.historyPembayaran.map((pay, index) => (
                <div
                  key={index}
                  className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                        pay.status === 'Lunas'
                          ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400'
                          : 'bg-rose-100 text-rose-600 dark:bg-rose-950/50 dark:text-rose-400'
                      }`}
                    >
                      {pay.status === 'Lunas' ? <HiOutlineCheckCircle size={18} /> : <HiOutlineXCircle size={18} />}
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                        Bulan {pay.bulan}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        Penghuni: <span className="font-medium text-slate-600 dark:text-slate-300">{pay.penghuniSaatItu}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      Rp {pay.nominal.toLocaleString('id-ID')}
                    </div>
                    <Badge variant={pay.status === 'Lunas' ? 'success' : 'danger'}>
                      {pay.status}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat transaksi iuran.</p>
            )}
          </div>
        )}
      </div>
    </Modal>
  );
}