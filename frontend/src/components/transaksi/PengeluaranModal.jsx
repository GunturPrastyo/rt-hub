import { useState, useEffect, useRef } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/Button';
import Input from '../ui/Input';
import api from '../../services/api';
import { 
  HiOutlineDocumentText, 
  HiOutlineBanknotes,
  HiOutlinePencil,
  HiOutlineTrash,
  HiOutlineCheck,
  HiOutlineXMark,
  HiChevronDown
} from 'react-icons/hi2';

// 1. Definisikan Kategori Bawaan (Default) yang kebal dari edit/hapus
const DEFAULT_CATEGORIES = [
  { id: 'def-1', nama: 'Operasional Kebersihan', isDefault: true },
  { id: 'def-2', nama: 'Gaji & Keamanan', isDefault: true },
  { id: 'def-3', nama: 'Perbaikan Fasum', isDefault: true },
  { id: 'def-4', nama: 'Lain-lain', isDefault: true },
];

export default function PengeluaranFormModal({ isOpen, onClose, onSubmit, sisaSaldo, isSubmitting }) {
  const [nominal, setNominal] = useState('');
  const [error, setError] = useState('');
  
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');

  const fetchCategories = async () => {
    try {
      const response = await api.get('/kategori-pengeluaran');
 
      const dbCategories = response.data.data.filter(
        dbCat => !DEFAULT_CATEGORIES.some(defCat => defCat.nama.toLowerCase() === dbCat.nama.toLowerCase())
      );

      const combinedCategories = [...DEFAULT_CATEGORIES, ...dbCategories];
      
      setCategories(combinedCategories);
      
      if (!selectedCategory) {
        setSelectedCategory(combinedCategories[0].id); 
      }
    } catch (error) {
      console.error("Gagal memuat kategori dari API, menggunakan default:", error);
      setCategories(DEFAULT_CATEGORIES); 
      if (!selectedCategory) setSelectedCategory(DEFAULT_CATEGORIES[0].id);
    }
  };

  useEffect(() => {
    if (isOpen) {
      fetchCategories();
    } else {
      setNominal('');
      setError('');
      setShowNewCategoryInput(false);
      setEditingCategoryId(null);
      setIsCategoryDropdownOpen(false);
    }
  }, [isOpen]);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsCategoryDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [dropdownRef]);


  const handleSelectCategory = (id) => {
    if (id === "ADD_NEW") {
      setShowNewCategoryInput(true);
      setSelectedCategory("");
    } else {
      setSelectedCategory(id);
    }
    setIsCategoryDropdownOpen(false);
  };

  const addNewCategory = async () => {
    const name = newCategoryName.trim();
    if (!name) return alert("Nama kategori baru tidak boleh kosong!");
    
    const isDuplicateWithDefault = DEFAULT_CATEGORIES.some(c => c.nama.toLowerCase() === name.toLowerCase());
    if (isDuplicateWithDefault) {
       return alert("Kategori ini sudah menjadi bawaan sistem. Silakan pilih dari daftar.");
    }
    
    try {
      const response = await api.post('/kategori-pengeluaran', { nama: name });
      const newCat = response.data.data;
      setCategories([...categories, newCat]);
      setSelectedCategory(newCat.id);
      setShowNewCategoryInput(false);
      setNewCategoryName('');
    } catch (error) {
      alert(error.response?.data?.message || "Gagal menambah kategori");
    }
  };

  const startEditCategory = (id, name, e) => {
    e.stopPropagation(); 
    setEditingCategoryId(id);
    setEditingCategoryName(name);
  };

  const saveEditCategory = async (id, e) => {
    if (e) e.stopPropagation();
    const newName = editingCategoryName.trim();
    if (!newName) return alert("Nama kategori tidak boleh kosong!");

    try {
      const response = await api.put(`/kategori-pengeluaran/${id}`, { nama: newName });
      const updatedCat = response.data.data;
      
      setCategories(categories.map(c => c.id === id ? updatedCat : c));
      setEditingCategoryId(null);
      setEditingCategoryName('');
    } catch (error) {
      alert(error.response?.data?.message || "Gagal memperbarui kategori");
    }
  };

  const cancelEditCategory = (e) => {
    if (e) e.stopPropagation();
    setEditingCategoryId(null);
    setEditingCategoryName('');
  };

  const handleDeleteCategory = async (id, categoryName, e) => {
    e.stopPropagation();
    if (window.confirm(`Apakah Anda yakin ingin menghapus kategori '${categoryName}'?`)) {
      try {
        await api.delete(`/kategori-pengeluaran/${id}`);
        setCategories(categories.filter(c => c.id !== id));
        if (selectedCategory === id) {
          setSelectedCategory(categories.length > 1 ? categories[0].id : '');
        }
      } catch (error) {
        alert(error.response?.data?.message || "Gagal menghapus kategori. Mungkin sedang digunakan.");
      }
    }
  };

  const handleNominalChange = (e) => {
    const rawValue = e.target.value.replace(/[^0-9]/g, '');
    setNominal(rawValue);

    if (sisaSaldo !== undefined && rawValue && Number(rawValue) > sisaSaldo) {
      setError(`Nominal melebihi sisa saldo kas (Rp ${new Intl.NumberFormat('id-ID').format(sisaSaldo)})`);
    } else {
      setError('');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (error || !nominal || !selectedCategory) {
      if(!selectedCategory) alert("Silakan pilih kategori pengeluaran!");
      return; 
    }
    
    const formData = new FormData(e.target);
    const selectedCategoryObj = categories.find(c => c.id === selectedCategory);

    onSubmit({
      keterangan: formData.get('keterangan'),
      nominal: Number(nominal),
      kategori: selectedCategoryObj ? selectedCategoryObj.nama : '-',
      tanggal: formData.get('tanggal'),
    });
  };

  const formattedNominal = nominal === '' ? '' : new Intl.NumberFormat('id-ID').format(nominal);
  const currentCategoryName = categories.find(c => c.id === selectedCategory)?.nama;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Catat Pengeluaran RT" contentClassName="overflow-visible">
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Keterangan Pengeluaran"
          name="keterangan"
          icon={HiOutlineDocumentText}
          placeholder="Contoh: Gaji Satpam Bulan Juli"
          required
        />

        <div>
          <Input
            label="Nominal (Rp)"
            name="nominal"
            type="text"
            inputMode="numeric"
            icon={HiOutlineBanknotes}
            placeholder="1.200.000"
            value={formattedNominal}
            onChange={handleNominalChange}
            required
          />
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <div ref={dropdownRef} className="relative">
          <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5 uppercase tracking-wider">
            Kategori Pengeluaran
          </label>
          
          {!showNewCategoryInput ? (
            <>
              <button
                type="button"
                onClick={() => setIsCategoryDropdownOpen(!isCategoryDropdownOpen)}
                className={`w-full px-4 py-2.5 border rounded-lg text-sm flex justify-between items-center transition-colors ${
                  isCategoryDropdownOpen 
                    ? 'border-blue-500 ring-2 ring-blue-500/20 bg-white dark:bg-slate-800' 
                    : 'border-slate-200 dark:border-slate-600 bg-slate-50 dark:bg-slate-700/50'
                }`}
              >
                <span className={selectedCategory ? 'text-slate-900 dark:text-white' : 'text-slate-400'}>
                  {currentCategoryName || "Pilih kategori..."}
                </span>
                <HiChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {isCategoryDropdownOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-600 rounded-lg shadow-xl max-h-60 overflow-y-auto custom-scrollbar">
                  <ul className="py-1 text-sm">
                    {categories.map((cat) => (
                      <li key={cat.id} className="hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors group">
                        
                        {editingCategoryId === cat.id ? (
                          <div className="flex items-center gap-2 w-full px-4 py-2" onClick={(e) => e.stopPropagation()}>
                            <input
                              type="text"
                              value={editingCategoryName}
                              onChange={(e) => setEditingCategoryName(e.target.value)}
                              className="flex-1 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 focus:outline-none focus:border-blue-500"
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') saveEditCategory(cat.id, e);
                                if (e.key === 'Escape') cancelEditCategory(e);
                              }}
                              autoFocus
                            />
                            <button type="button" onClick={(e) => saveEditCategory(cat.id, e)} className="p-1 text-emerald-600 hover:bg-emerald-100 rounded">
                              <HiOutlineCheck className="w-4 h-4" />
                            </button>
                            <button type="button" onClick={(e) => cancelEditCategory(e)} className="p-1 text-slate-500 hover:bg-slate-200 rounded">
                              <HiOutlineXMark className="w-4 h-4" />
                            </button>
                          </div>
                        ) : (
                          
                          <div 
                            className="flex items-center justify-between w-full px-4 py-2.5 cursor-pointer"
                            onClick={() => handleSelectCategory(cat.id)}
                          >
                            <span className="truncate pr-2 text-slate-700 dark:text-slate-300 font-medium">
                              {cat.nama} 
                              {/* Tambahkan tag kecil untuk menandai bawaan */}
                              {cat.isDefault && <span className="ml-2 text-[10px] bg-slate-100 dark:bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded">Bawaan</span>}
                            </span>
                            
                            {/* 3. Sembunyikan tombol Edit & Hapus jika ini kategori Default */}
                            {!cat.isDefault && (
                              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1 shrink-0" onClick={(e) => e.stopPropagation()}>
                                <button
                                  type="button"
                                  onClick={(e) => startEditCategory(cat.id, cat.nama, e)}
                                  className="p-1 text-blue-600 hover:bg-blue-100 rounded transition-colors"
                                >
                                  <HiOutlinePencil className="w-4 h-4" />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => handleDeleteCategory(cat.id, cat.nama, e)}
                                  className="p-1 text-rose-600 hover:bg-rose-100 rounded transition-colors"
                                >
                                  <HiOutlineTrash className="w-4 h-4" />
                                </button>
                              </div>
                            )}

                          </div>
                        )}
                      </li>
                    ))}
                    
                    <li 
                      onClick={() => handleSelectCategory('ADD_NEW')}
                      className="px-4 py-2.5 hover:bg-blue-50 dark:hover:bg-slate-700 cursor-pointer font-bold text-blue-600 border-t border-slate-100 dark:border-slate-700 transition-colors sticky bottom-0 bg-white dark:bg-slate-800"
                    >
                      + Tambah Kategori Baru...
                    </li>
                  </ul>
                </div>
              )}
            </>
          ) : (
            <div className="flex gap-2">
              <input
                type="text"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                className="flex-1 px-4 py-2 border border-blue-300 ring-2 ring-blue-500/20 rounded-lg text-sm bg-white dark:bg-slate-700 dark:border-blue-500 text-slate-900 dark:text-white focus:outline-none"
                placeholder="Ketik nama kategori..."
                onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addNewCategory())}
                autoFocus
              />
              <Button type="button" variant="primary" onClick={addNewCategory} className="px-4">
                Simpan
              </Button>
              <Button type="button" variant="secondary" onClick={() => setShowNewCategoryInput(false)}>
                Batal
              </Button>
            </div>
          )}
        </div>

        <Input
          label="Tanggal Pengeluaran"
          name="tanggal"
          type="date"
          defaultValue={new Date().toISOString().split('T')[0]}
          required
        />

        <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100 dark:border-slate-700">
          <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
            Batal
          </Button>
          
          <Button type="submit" variant="primary" disabled={!!error || !nominal || isSubmitting || !selectedCategory}>
            {isSubmitting ? 'Menyimpan...' : 'Catat Pengeluaran'}
          </Button>
        </div>
      </form>
    </Modal>
  );
}