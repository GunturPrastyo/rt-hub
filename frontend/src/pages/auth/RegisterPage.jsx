import { useState } from 'react';
import { useNavigate, Link } from "react-router-dom";
import api from '../../services/api';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiOutlineUser, HiOutlineUserPlus } from 'react-icons/hi2';
import ToastNotification from '../../components/ui/ToastNotification'; // <-- Import Toast Notification

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: ''
  });
  
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // State untuk Toast Notification
  const [toast, setToast] = useState({ message: '', type: 'info', isVisible: false });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const showToast = (message, type = 'info') => {
    setToast({ message, type, isVisible: true });
  };

  const hideToast = () => {
    setToast((prev) => ({ ...prev, isVisible: false }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.password_confirmation) {
      setError('Konfirmasi password tidak cocok.');
      return;
    }

    setIsSubmitting(true);

    try {
      await api.post('/register', formData);
      
      // Munculkan Toast Sukses
      showToast('Registrasi berhasil! Mengalihkan ke halaman login...', 'success');
      
      // Beri jeda 2.5 detik agar user bisa membaca toast sebelum dialihkan
      setTimeout(() => {
        navigate('/login');
      }, 2500);

    } catch (err) {
      const message = err.response?.data?.message || 'Registrasi gagal. Silakan periksa kembali data Anda.';
      setError(message);
      setIsSubmitting(false); // Matikan loading hanya jika error (jika sukses biarkan loading sampai redirect)
    } 
  };

  return (
    <>
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
      `}</style>

      <div className="min-h-screen flex bg-white dark:bg-slate-900">
        
        {/* BAGIAN KIRI: Banner & Branding */}
        <div className="hidden lg:flex lg:w-1/2 relative bg-blue-900 overflow-hidden items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-blue-600/90 mix-blend-multiply"></div>

          <div className="relative z-10 p-12 text-white max-w-lg">
            <div className="bg-white/10 w-16 h-16 rounded-2xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 shadow-xl">
              <span className="text-3xl font-black tracking-tighter">RT</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">
              Bergabung dengan<br /><span className="text-blue-200">RT-Hub</span>
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Daftarkan akun administrator Anda untuk mulai mengelola administrasi lingkungan secara digital.
            </p>

            <div className="mt-12 flex items-center gap-4 text-sm text-blue-200/60 font-medium">
              <span>&copy; {new Date().getFullYear()} RT-Hub System. All rights reserved.</span>
            </div>
          </div>

          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        {/* BAGIAN KANAN: Form Register */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-white dark:bg-slate-900 relative">
          <div className="max-w-md w-full space-y-8 relative z-10 py-12">
            
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Buat Akun Baru
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Isi formulir di bawah ini untuk mendaftarkan akun.
              </p>
            </div>

            <form className="mt-8 space-y-5" onSubmit={handleSubmit}>
              
              {/* Input Nama */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Nama Lengkap
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineUser className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-slate-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-300 dark:hover:border-slate-600"
                    placeholder="Budi Santoso"
                  />
                </div>
              </div>

              {/* Input Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Alamat Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineEnvelope className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-slate-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-300 dark:hover:border-slate-600"
                    placeholder="admin@rt-hub.com"
                  />
                </div>
              </div>

              {/* Input Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-slate-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-300 dark:hover:border-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Input Confirm Password */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1.5">
                  Ulangi Sandi
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                    <HiOutlineLockClosed className="h-5 w-5 text-gray-400 dark:text-gray-500" />
                  </div>
                  <input
                    type="password"
                    name="password_confirmation"
                    required
                    value={formData.password_confirmation}
                    onChange={handleChange}
                    className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-slate-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-300 dark:hover:border-slate-600"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              {/* Pesan Error Statis */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 animate-fade-in mt-2">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Tombol Submit */}
              <div className="pt-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="group relative w-full flex justify-center items-center py-3.5 px-4 border border-transparent text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Menyimpan...
                    </span>
                  ) : (
                    <>
                      <HiOutlineUserPlus className="h-5 w-5 mr-2 text-blue-200 group-hover:text-white transition-colors" />
                      Daftar Akun
                    </>
                  )}
                </button>
              </div>

              {/* Link Login */}
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Sudah memiliki akun?{' '}
                <Link to="/login" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                  Masuk di sini
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>

      {/* Render Toast Notification */}
      <ToastNotification
        message={toast.message}
        type={toast.type}
        isVisible={toast.isVisible}
        onDismiss={hideToast}
      />
    </>
  );
}