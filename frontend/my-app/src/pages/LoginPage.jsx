import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import toast from 'react-hot-toast'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      // TODO: Replace with real API call when backend is ready
      // const res = await authApi.login({ email, password })
      // login(res.data.token, res.data.user)
      toast.error('Backend belum tersedia. Gunakan Demo Login.')
    } catch (err) {
      setError(err.response?.data?.message || 'Email atau kata sandi salah.')
    } finally {
      setLoading(false)
    }
  }

  const handleDemoLogin = () => {
    login('demo-token-123', { name: 'Budi Santoso', email: 'budi@umkm.com' })
    toast.success('Login demo berhasil!')
    navigate('/dashboard')
  }

  return (
    <div className="bg-surface font-inter text-on-surface min-h-screen flex items-center justify-center p-6">
      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow ai-accent-border">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-headline-md font-hanken text-primary mb-2">MicroCred AI</h1>
            <p className="text-body-md text-on-surface-variant">Akses dashboard kredit institusi Anda</p>
          </div>
          {error && (
            <div className="bg-error-container text-on-error-container p-2 rounded-lg flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span className="text-label-sm">{error}</span>
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="flex flex-col gap-2">
              <label className="text-label-md text-on-surface-variant" htmlFor="email">Alamat Email</label>
              <input className="w-full px-6 py-3 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg text-body-md placeholder:text-outline" id="email" placeholder="pemilik@msme-corp.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="flex flex-col gap-2">
              <div className="flex justify-between items-center">
                <label className="text-label-md text-on-surface-variant" htmlFor="password">Kata Sandi</label>
                <a className="text-label-sm text-secondary hover:underline" href="#">Lupa kata sandi?</a>
              </div>
              <input className="w-full px-6 py-3 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg text-body-md placeholder:text-outline" id="password" placeholder="••••••••" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button className="w-full bg-primary-container text-on-primary py-3 rounded-lg text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50" type="submit" disabled={loading}>
              <span className="material-symbols-outlined text-[18px]">login</span>
              {loading ? 'Memproses...' : 'Login'}
            </button>
          </form>
          <button onClick={handleDemoLogin} className="w-full mt-3 border-2 border-secondary text-secondary py-3 rounded-lg text-label-md hover:bg-secondary/5 active:scale-95 transition-all flex items-center justify-center gap-2">
            <span className="material-symbols-outlined text-[18px]">play_arrow</span>
            Demo Login (Tanpa Backend)
          </button>
          <p className="mt-8 text-center text-body-md text-on-surface-variant">
            Belum punya akun? <Link className="text-secondary font-bold hover:underline" to="/register">Daftar</Link>
          </p>
        </div>
        {/* Right: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-primary-container relative flex-col justify-center p-12 text-on-primary overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-1 bg-secondary mb-6"></div>
            <h2 className="text-headline-lg font-hanken mb-3">Kompleksitas Tersembunyi,<br/>Kejelasan Radikal.</h2>
            <p className="text-body-lg text-primary-fixed-dim max-w-sm mb-12">Memberdayakan UMKM dengan analisis kredit kelas institusi melalui lensa minimalis.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed">verified_user</span>
                <span className="text-label-md">Keamanan Bersertifikat ISO 27001</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed">bolt</span>
                <span className="text-label-md">Penilaian Kredit AI Real-time</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
