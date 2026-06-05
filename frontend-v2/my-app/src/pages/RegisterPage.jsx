import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api'

export default function RegisterPage() {
  const [form, setForm] = useState({ name: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (form.password !== form.confirmPassword) {
      toast.error('Kata sandi tidak cocok!')
      return
    }
    setLoading(true)
    try {
      await authApi.register(form)
      toast.success('Registrasi berhasil! Silakan login.')
      navigate('/login')
    } catch (err) {
      toast.error(err.response?.data?.message || 'Gagal mendaftar')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-surface font-inter text-on-surface min-h-screen flex flex-col">
      {/* Header */}
      <header className="w-full bg-surface-container-lowest shadow-sm z-50">
        <div className="flex justify-between items-center px-10 w-full max-w-container-max mx-auto h-16">
          <Link to="/" className="text-headline-md font-hanken font-extrabold text-primary">MicroCred AI</Link>
          <div className="flex gap-2">
            <Link to="/login" className="px-6 py-2 text-on-surface-variant font-medium hover:text-secondary transition-all text-label-md">Masuk</Link>
            <Link to="/register" className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 active:scale-95 transition-all text-label-md">Daftar</Link>
          </div>
        </div>
      </header>

      <main className="flex-grow flex items-center justify-center w-full px-4 py-12 relative overflow-hidden">
        <div className="absolute -top-40 -right-40 w-96 h-96 bg-primary-fixed opacity-20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-secondary-fixed opacity-20 rounded-full blur-3xl"></div>

        <div className="w-full max-w-[480px] bg-white rounded-xl card-shadow p-6 md:p-12 relative z-10">
          <div className="flex flex-col items-center mb-6 text-center">
            <div className="w-16 h-16 bg-primary-container rounded-full flex items-center justify-center mb-2">
              <span className="material-symbols-outlined text-primary-fixed text-4xl">lock_open</span>
            </div>
            <h1 className="text-headline-lg font-hanken text-primary">Buat Akun Anda</h1>
            <p className="text-body-md text-on-surface-variant mt-2">Memberdayakan UMKM dengan solusi kredit yang cerdas.</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-2">
            <div className="space-y-2">
              <label className="text-label-md text-on-surface-variant ml-1">Nama Lengkap</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">person</span>
                <input className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md placeholder:text-outline-variant" name="name" placeholder="Nama Lengkap Anda" type="text" value={form.name} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-label-md text-on-surface-variant ml-1">Alamat Email</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">mail</span>
                <input className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md placeholder:text-outline-variant" name="email" placeholder="nama@bisnis.com" type="email" value={form.email} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-label-md text-on-surface-variant ml-1">Kata Sandi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">key</span>
                <input className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md placeholder:text-outline-variant" name="password" placeholder="••••••••" type="password" value={form.password} onChange={handleChange} required />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-label-md text-on-surface-variant ml-1">Konfirmasi Kata Sandi</label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-outline">verified_user</span>
                <input className="w-full pl-12 pr-4 py-3 bg-[#F8FAFC] border-0 rounded-lg focus:ring-2 focus:ring-primary focus:bg-white transition-all text-body-md placeholder:text-outline-variant" name="confirmPassword" placeholder="••••••••" type="password" value={form.confirmPassword} onChange={handleChange} required />
              </div>
            </div>
            <div className="flex items-start gap-3 py-2">
              <input className="mt-1 rounded text-primary focus:ring-primary" type="checkbox" required />
              <p className="text-label-sm text-on-surface-variant">Dengan mendaftar, saya setuju dengan <a className="text-secondary hover:underline" href="#">Syarat Layanan</a> dan <a className="text-secondary hover:underline" href="#">Kebijakan Privasi</a>.</p>
            </div>
            <button className="w-full bg-primary text-on-primary py-4 rounded-lg text-headline-md font-hanken hover:bg-opacity-90 active:scale-[0.98] transition-all mt-4 flex items-center justify-center gap-2 disabled:opacity-50" type="submit" disabled={loading}>
              {loading ? 'Memproses...' : 'Daftar Sekarang'}
              <span className="material-symbols-outlined">arrow_forward</span>
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-outline-variant flex flex-col items-center gap-2">
            <div className="flex items-center gap-2 text-body-md text-on-surface-variant">
              Sudah punya akun? <Link className="text-primary font-bold hover:text-secondary transition-colors" to="/login">Login</Link>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="w-full bg-surface-container-highest border-t border-outline-variant">
        <div className="w-full px-10 py-6 flex justify-center items-center max-w-container-max mx-auto">
          <div className="text-body-md text-on-surface">© 2026 Capstone Team CC26-PSU354</div>
        </div>
      </footer>
    </div>
  )
}
