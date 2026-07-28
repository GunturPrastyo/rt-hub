import { useState, useEffect, useRef } from 'react';
import Modal from '../../../components/ui/Modal';
import Badge from '../../../components/ui/Badge';
import api from '../../../services/api';
import {
  HiOutlineUserGroup,
  HiOutlineReceiptPercent,
  HiOutlineCalendarDays,
  HiOutlineCheckCircle,
  HiOutlineXCircle
} from 'react-icons/hi2';

export default function RumahDetailDrawer({ isOpen, onClose, rumah }) {
  const [activeTab, setActiveTab] = useState('historyPenghuni');

  const [detailData, setDetailData] = useState(null);
  const [isDetailLoading, setIsDetailLoading] = useState(false);

  const [penghuniData, setPenghuniData] = useState([]);
  const [penghuniPage, setPenghuniPage] = useState(1);
  const [hasMorePenghuni, setHasMorePenghuni] = useState(true);
  const [isPenghuniLoading, setIsPenghuniLoading] = useState(false);

  const [pembayaranData, setPembayaranData] = useState([]);
  const [pembayaranPage, setPembayaranPage] = useState(1);
  const [hasMorePembayaran, setHasMorePembayaran] = useState(true);
  const [isPembayaranLoading, setIsPembayaranLoading] = useState(false);

  const scrollRef = useRef(null);

  useEffect(() => {
    if (isOpen && rumah?.id) {
      fetchDetail();
      setPenghuniPage(1);
      setPembayaranPage(1);
    } else {
      setDetailData(null);
      setPenghuniData([]);
      setPembayaranData([]);
      setActiveTab('historyPenghuni');
    }
  }, [isOpen, rumah]);


  const fetchDetail = async () => {
    setIsDetailLoading(true);
    try {
      const res = await api.get(`/rumah/${rumah.id}`);
      setDetailData(res.data.data);
    } catch (error) {
      console.error(error);
    } finally {
      setIsDetailLoading(false);
    }
  };

  useEffect(() => {
    if (!isOpen || !rumah?.id) return;

    const fetchPenghuni = async () => {
      setIsPenghuniLoading(true);
      try {
        const res = await api.get(`/rumah/${rumah.id}/history-penghuni?page=${penghuniPage}`);
        const { data, current_page, last_page } = res.data;

        setPenghuniData(prev => current_page === 1 ? data : [...prev, ...data]);
        setHasMorePenghuni(current_page < last_page);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPenghuniLoading(false);
      }
    };

    fetchPenghuni();
  }, [penghuniPage, isOpen, rumah]);

  useEffect(() => {
    if (!isOpen || !rumah?.id) return;

    const fetchPembayaran = async () => {
      setIsPembayaranLoading(true);
      try {
        const res = await api.get(`/rumah/${rumah.id}/history-pembayaran?page=${pembayaranPage}`);
        const { data, current_page, last_page } = res.data;

        setPembayaranData(prev => current_page === 1 ? data : [...prev, ...data]);
        setHasMorePembayaran(current_page < last_page);
      } catch (error) {
        console.error(error);
      } finally {
        setIsPembayaranLoading(false);
      }
    };

    fetchPembayaran();
  }, [pembayaranPage, isOpen, rumah]);


  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollTop, clientHeight, scrollHeight } = scrollRef.current;

    if (scrollHeight - scrollTop <= clientHeight + 50) {
      if (activeTab === 'historyPenghuni' && hasMorePenghuni && !isPenghuniLoading) {
        setPenghuniPage(prev => prev + 1);
      }
      if (activeTab === 'historyPembayaran' && hasMorePembayaran && !isPembayaranLoading) {
        setPembayaranPage(prev => prev + 1);
      }
    }
  };

  if (!isOpen || !rumah) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Detail & Riwayat Rumah ${rumah.nomorRumah}`}>
      {isDetailLoading || !detailData ? (
        // Skeleton untuk Header Detail
        <div className="space-y-4 animate-pulse">
          <div className="h-20 bg-slate-100 dark:bg-slate-700/60 rounded-lg w-full"></div>
          <div className="flex gap-4 border-b border-slate-200">
            <div className="h-8 bg-slate-200 dark:bg-slate-700 w-32 rounded"></div>
            <div className="h-8 bg-slate-200 dark:bg-slate-700 w-32 rounded"></div>
          </div>
          <div className="h-48 bg-slate-50 dark:bg-slate-800 rounded-lg w-full"></div>
        </div>
      ) : (
        <div className="space-y-5">
          {/* Ringkasan Status Rumah */}
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-700/40 border border-slate-100 dark:border-slate-700/60 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-400">Penghuni Saat Ini</div>
              <div className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5">
                {detailData.penghuniNama}
              </div>
            </div>
            <Badge variant={detailData.status === 'Dihuni' ? 'success' : 'warning'}>
              {detailData.status}
            </Badge>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setActiveTab('historyPenghuni')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'historyPenghuni'
                  ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <HiOutlineUserGroup size={16} />
              <span>Riwayat Penghuni</span>
            </button>

            <button
              onClick={() => setActiveTab('historyPembayaran')}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold border-b-2 transition-colors ${activeTab === 'historyPembayaran'
                  ? 'border-slate-900 text-slate-900 dark:border-white dark:text-white'
                  : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-300'
                }`}
            >
              <HiOutlineReceiptPercent size={16} />
              <span>Riwayat Pembayaran</span>
            </button>
          </div>

          {/* Kontainer Scrollable */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="space-y-3 max-h-[350px] overflow-y-auto pr-2 custom-scrollbar"
          >
            {/* TAB: HISTORY PENGHUNI */}
            {activeTab === 'historyPenghuni' && (
              <>
                {penghuniData.length > 0 ? penghuniData.map((item, idx) => (
                  <div key={`penghuni-${item.id || idx}`} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-start justify-between">
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
                )) : (!isPenghuniLoading && <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat penghuni.</p>)}

                {/* Skeleton Penghuni (Ditampilkan saat fetch data) */}
                {isPenghuniLoading && Array.from({ length: 3 }).map((_, i) => (
                  <div key={`sk-peng-${i}`} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-start justify-between animate-pulse">
                    <div className="space-y-2">
                      <div className="h-3 w-24 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                    </div>
                    <div className="h-5 w-16 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                  </div>
                ))}
              </>
            )}

            {/* TAB: HISTORY PEMBAYARAN */}
            {activeTab === 'historyPembayaran' && (
              <>
                {pembayaranData.length > 0 ? pembayaranData.map((pay, idx) => (
                  <div key={`pay-${pay.id || idx}`} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${pay.status === 'Lunas' ? 'bg-emerald-100 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400' : 'bg-rose-100 text-rose-600'
                        }`}>
                        {pay.status === 'Lunas' ? <HiOutlineCheckCircle size={18} /> : <HiOutlineXCircle size={18} />}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-slate-800 dark:text-slate-200">
                          Bayar: {pay.bulan}
                        </div>
                        {/* Menampilkan rincian item pembayaran */}
                        <div className="text-[11px] text-blue-600 dark:text-blue-400 font-medium mt-0.5">
                          {pay.rincian}
                        </div>
                        <div className="text-[10px] text-slate-400 mt-0.5">
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
                )) : (!isPembayaranLoading && <p className="text-xs text-slate-400 text-center py-4">Belum ada riwayat transaksi iuran.</p>)}

                {/* Skeleton Pembayaran */}
                {isPembayaranLoading && Array.from({ length: 4 }).map((_, i) => (
                  <div key={`sk-pay-${i}`} className="p-3 rounded-lg border border-slate-100 dark:border-slate-700/60 bg-white dark:bg-slate-800 flex items-center justify-between animate-pulse">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-slate-200 dark:bg-slate-700 shrink-0"></div>
                      <div className="space-y-2">
                        <div className="h-3 w-20 bg-slate-200 dark:bg-slate-700 rounded"></div>
                        <div className="h-2 w-32 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <div className="h-3 w-16 bg-slate-200 dark:bg-slate-700 rounded"></div>
                      <div className="h-5 w-12 bg-slate-200 dark:bg-slate-700 rounded-full"></div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>
      )}
    </Modal>
  );
}