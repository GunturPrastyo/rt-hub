import { useState } from 'react';
import { useNavigate, Navigate, Link } from "react-router-dom";
import { useAuth } from '../../context/AuthContext';
import { HiOutlineEnvelope, HiOutlineLockClosed, HiArrowRightOnRectangle } from 'react-icons/hi2';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      await login(email, password, remember);
      navigate('/dashboard', { replace: true });
    } catch (err) {
      const message = err.response?.data?.message || 'Login gagal. Periksa email dan password Anda.';
      setError(message);
    } finally {
      setIsSubmitting(false);
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
              Portal Admin<br /><span className="text-blue-200">RT-Hub</span>
            </h1>
            <p className="text-lg text-blue-100/80 leading-relaxed">
              Sistem informasi manajemen terpadu untuk mengelola administrasi warga, iuran, kas, dan pengeluaran RT secara transparan.
            </p>

            <div className="mt-12 flex items-center gap-4 text-sm text-blue-200/60 font-medium">
              <span>&copy; {new Date().getFullYear()} RT-Hub System. All rights reserved.</span>
            </div>
          </div>

          {/* Animasi Ornamen Blob */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-[128px] opacity-50 animate-blob animation-delay-2000"></div>
        </div>

        {/* BAGIAN KANAN: Form Login */}
        <div className="w-full lg:w-1/2 flex items-center justify-center px-6 sm:px-12 lg:px-20 bg-white dark:bg-slate-900 relative">
          <div className="max-w-md w-full space-y-10 relative z-10 py-12">
            
            <div className="text-center lg:text-left">
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Selamat Datang!
              </h2>
              <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">
                Silakan masuk menggunakan kredensial Anda untuk mengakses sistem.
              </p>
            </div>

            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="space-y-5">
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
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
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
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="appearance-none rounded-xl relative block w-full pl-11 px-4 py-3.5 border border-gray-200 dark:border-slate-700 placeholder-gray-400 text-gray-900 dark:text-white bg-white dark:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 sm:text-sm transition-all duration-200 shadow-sm hover:border-gray-300 dark:hover:border-slate-600"
                      placeholder="••••••••"
                    />
                  </div>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  id="remember-me"
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded dark:border-slate-600 dark:bg-slate-700 cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-600 dark:text-gray-300 cursor-pointer">
                  Ingat saya
                </label>
              </div>

              {/* Pesan Error */}
              {error && (
                <div className="p-3 rounded-lg bg-red-50 dark:bg-red-900/30 border border-red-100 dark:border-red-800 animate-fade-in">
                  <p className="text-sm text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              {/* Tombol Submit */}
              <div>
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
                      Memverifikasi...
                    </span>
                  ) : (
                    <>
                      <HiArrowRightOnRectangle className="h-5 w-5 mr-2 text-blue-200 group-hover:text-white transition-colors" />
                      Masuk ke Sistem
                    </>
                  )}
                </button>
              </div>

              {/* Link Registrasi */}
              <div className="mt-6 text-center text-sm text-gray-500 dark:text-gray-400">
                Belum memiliki akun?{' '}
                <Link to="/register" className="font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors">
                  Daftar Sekarang
                </Link>
              </div>

            </form>
          </div>
        </div>
      </div>
    </>
  );
}