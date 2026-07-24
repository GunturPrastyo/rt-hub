import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  HiMagnifyingGlass, 
  HiOutlineHome, 
  HiOutlineBuildingOffice2, 
  HiOutlineUsers, 
  HiOutlineReceiptPercent, 
  HiOutlineArrowTrendingDown, 
  HiOutlineChartBar 
} from 'react-icons/hi2';

export default function NavSearchBar() {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const adminMenus = [
    { name: 'Dashboard Utama', link: '/dashboard', desc: 'Ringkasan data & total saldo RT', keywords: ['home', 'beranda', 'statistik'], icon: HiOutlineHome },
    { name: 'Kelola Rumah', link: '/rumah', desc: 'Status 20 rumah & history penghuni', keywords: ['rumah', 'dihuni', 'kosong'], icon: HiOutlineBuildingOffice2 },
    { name: 'Kelola Penghuni', link: '/penghuni', desc: 'Master data warga & KTP', keywords: ['penghuni', 'warga', 'ktp', 'kontrak'], icon: HiOutlineUsers },
    { name: 'Pemasukan Iuran', link: '/transaksi/iuran', desc: 'Iuran Satpam (100k) & Kebersihan (15k)', keywords: ['iuran', 'satpam', 'kebersihan'], icon: HiOutlineReceiptPercent },
    { name: 'Pengeluaran RT', link: '/transaksi/pengeluaran', desc: 'Pengeluaran operasional RT', keywords: ['pengeluaran', 'biaya', 'gaji'], icon: HiOutlineArrowTrendingDown },
    { name: 'Laporan Finansial', link: '/laporan', desc: 'Grafik ringkasan pemasukan & pengeluaran', keywords: ['laporan', 'grafik', 'finansial'], icon: HiOutlineChartBar }
  ];

  const handleSearch = (e) => {
    const value = e.target.value;
    setSearchQuery(value);

    if (!value.trim()) {
      setSearchResults([]);
      setIsSearchOpen(false);
      setHighlightedIndex(-1);
      return;
    }

    const queryWords = value.toLowerCase().split(/\s+/).filter(Boolean);
    const filtered = adminMenus.filter((menu) => {
      const searchableText = [menu.name, menu.desc, ...(menu.keywords || [])].join(' ').toLowerCase();
      return queryWords.every((word) => searchableText.includes(word));
    });

    setSearchResults(filtered);
    setIsSearchOpen(true);
    setHighlightedIndex(-1);
  };

  const navigateTo = (link) => {
    navigate(link);
    setSearchQuery('');
    setIsSearchOpen(false);
    setHighlightedIndex(-1);
  };

  const handleKeyDown = (e) => {
    if (!isSearchOpen || searchResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev < searchResults.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : searchResults.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < searchResults.length) {
        navigateTo(searchResults[highlightedIndex].link);
      } else if (searchResults.length > 0) {
        navigateTo(searchResults[0].link);
      }
    } else if (e.key === 'Escape') {
      setIsSearchOpen(false);
      setHighlightedIndex(-1);
    }
  };

  return (
    <div className="relative w-full max-w-full">
      <HiMagnifyingGlass className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 dark:text-slate-500" />
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        onFocus={handleSearch}
        onKeyDown={handleKeyDown}
        placeholder="Cari menu atau fitur RT..."
        className="w-full pl-11 pr-4 py-2 rounded-lg border-transparent bg-slate-100 dark:bg-slate-700/50 text-sm text-slate-700 dark:text-slate-200 placeholder-slate-400 focus:border-transparent focus:bg-white dark:focus:bg-slate-700 focus:ring-2 focus:ring-slate-400/20 focus:outline-none transition-all"
      />

      {isSearchOpen && searchQuery.trim() && (
        <div className="absolute top-full left-0 w-full mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-100 dark:border-slate-700 z-50 max-h-80 overflow-y-auto custom-scrollbar">
          {searchResults.length > 0 ? (
            <ul className="py-2">
              {searchResults.map((result, index) => {
                const IconComponent = result.icon || HiMagnifyingGlass;
                const isSelected = highlightedIndex === index;
                return (
                  <li key={index}>
                    <button
                      onClick={() => navigateTo(result.link)}
                      className={`w-full text-left px-4 py-2.5 transition-colors ${
                        isSelected ? 'bg-slate-100 dark:bg-slate-700' : 'hover:bg-slate-50 dark:hover:bg-slate-700/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`flex-shrink-0 flex items-center justify-center w-8 h-8 rounded-lg ${isSelected ? 'bg-slate-200 dark:bg-slate-600 text-slate-800 dark:text-slate-100' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>
                          <IconComponent size={18} />
                        </div>
                        <div>
                          <div className={`text-sm font-semibold ${isSelected ? 'text-slate-900 dark:text-white' : 'text-slate-800 dark:text-slate-200'}`}>
                            {result.name}
                          </div>
                          <div className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1">{result.desc}</div>
                        </div>
                      </div>
                    </button>
                  </li>
                );
              })}
            </ul>
          ) : (
            <div className="px-4 py-3 text-sm text-slate-500 dark:text-slate-400 text-center">
              Fitur tidak ditemukan.
            </div>
          )}
        </div>
      )}
    </div>
  );
}