import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { authApi } from '../api'

export default function ForgotPasswordPage() {
  const [step, setStep] = useState(1) // 1 = verify identity, 2 = new password
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (step === 1) {
      // Validate inputs before proceeding
      if (!name.trim() || !email.trim()) {
        setError('Nama lengkap dan email wajib diisi')
        return
      }
      setStep(2)
      return
    }

    // Step 2: Submit reset
    if (newPassword.length < 6) {
      setError('Password baru minimal 6 karakter')
      return
    }
    if (newPassword !== confirmPassword) {
      setError('Konfirmasi password tidak cocok')
      return
    }

    setLoading(true)
    try {
      await authApi.resetPassword({ name: name.trim(), email: email.trim(), newPassword })
      toast.success('Password berhasil direset! Silakan login.')
      navigate('/login')
    } catch (err) {
      setError(err.response?.data?.message || 'Gagal mereset password. Periksa kembali nama dan email Anda.')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full px-6 py-3 bg-surface-container-low border-transparent focus:border-primary focus:ring-0 rounded-lg text-body-md placeholder:text-outline"

  return (
    <div className="bg-surface font-inter text-on-surface min-h-screen flex flex-col items-center justify-center p-6">
      
      {/* Back Button */}
      <div className="w-full max-w-[1000px] flex justify-start mb-6">
        <Link to="/login" className="flex items-center gap-2 text-on-surface-variant hover:text-primary transition-colors group bg-surface-container-lowest px-5 py-2.5 rounded-full shadow-sm border border-outline-variant/30 hover:shadow-md">
          <span className="material-symbols-outlined text-[20px] group-hover:-translate-x-1 transition-transform">arrow_back</span>
          <span className="text-label-md font-medium">Kembali ke Login</span>
        </Link>
      </div>

      <div className="w-full max-w-[1000px] flex flex-col md:flex-row bg-surface-container-lowest rounded-xl overflow-hidden soft-shadow ai-accent-border">
        {/* Left: Form */}
        <div className="w-full md:w-1/2 p-12 flex flex-col justify-center">
          <div className="mb-6">
            <h1 className="text-headline-md font-hanken text-primary mb-2">Reset Password</h1>
            <p className="text-body-md text-on-surface-variant">
              {step === 1
                ? 'Masukkan nama lengkap dan email yang terdaftar untuk memverifikasi identitas Anda.'
                : 'Identitas terverifikasi. Silakan buat password baru.'}
            </p>
          </div>

          {/* Step Indicator */}
          <div className="flex items-center gap-3 mb-8">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-label-sm font-bold transition-colors ${step >= 1 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>1</div>
            <div className={`h-0.5 flex-1 rounded transition-colors ${step >= 2 ? 'bg-primary' : 'bg-surface-container'}`}></div>
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-label-sm font-bold transition-colors ${step >= 2 ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant'}`}>2</div>
          </div>

          {error && (
            <div className="bg-error-container text-on-error-container p-2 rounded-lg flex items-center gap-2 mb-6">
              <span className="material-symbols-outlined text-[20px]">error</span>
              <span className="text-label-sm">{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === 1 && (
              <>
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant" htmlFor="name">Nama Lengkap</label>
                  <input className={inputClass} id="name" placeholder="Masukkan nama lengkap saat registrasi" type="text" value={name} onChange={(e) => setName(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant" htmlFor="email">Alamat Email</label>
                  <input className={inputClass} id="email" placeholder="email@contoh.com" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              </>
            )}

            {step === 2 && (
              <>
                <div className="bg-surface-container-low p-4 rounded-lg border border-outline-variant/30 mb-2">
                  <div className="flex items-center gap-2 text-secondary">
                    <span className="material-symbols-outlined text-[18px]">verified</span>
                    <span className="text-label-sm font-bold">Identitas Terverifikasi</span>
                  </div>
                  <p className="text-body-sm text-on-surface-variant mt-1">{name} — {email}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant" htmlFor="newPassword">Password Baru</label>
                  <input className={inputClass} id="newPassword" placeholder="Minimal 6 karakter" type="password" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} required />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-label-md text-on-surface-variant" htmlFor="confirmPassword">Konfirmasi Password Baru</label>
                  <input className={inputClass} id="confirmPassword" placeholder="Ulangi password baru" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
                </div>
              </>
            )}

            <div className="flex gap-3">
              {step === 2 && (
                <button type="button" onClick={() => { setStep(1); setError('') }} className="flex-1 bg-surface-container text-on-surface-variant py-3 rounded-lg text-label-md hover:opacity-80 active:scale-95 transition-all flex items-center justify-center gap-2">
                  <span className="material-symbols-outlined text-[18px]">arrow_back</span>
                  Kembali
                </button>
              )}
              <button className="flex-1 bg-primary-container text-on-primary py-3 rounded-lg text-label-md hover:opacity-90 active:scale-95 transition-all flex items-center justify-center gap-2 disabled:opacity-50" type="submit" disabled={loading}>
                <span className="material-symbols-outlined text-[18px]">{step === 1 ? 'verified_user' : 'lock_reset'}</span>
                {loading ? 'Memproses...' : step === 1 ? 'Verifikasi Identitas' : 'Reset Password'}
              </button>
            </div>
          </form>

          <p className="mt-8 text-center text-body-md text-on-surface-variant">
            Sudah ingat? <Link className="text-secondary font-bold hover:underline" to="/login">Kembali ke Login</Link>
          </p>
        </div>

        {/* Right: Branding */}
        <div className="hidden md:flex md:w-1/2 bg-primary-container relative flex-col justify-center p-12 text-on-primary overflow-hidden">
          <div className="relative z-10">
            <div className="w-16 h-1 bg-secondary mb-6"></div>
            <h2 className="text-headline-lg font-hanken mb-3">Lupa Password?<br/>Kami Bantu.</h2>
            <p className="text-body-lg text-primary-fixed-dim max-w-sm mb-12">Verifikasi identitas Anda dengan nama lengkap dan email yang terdaftar untuk mengatur ulang password.</p>
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed">shield</span>
                <span className="text-label-md">Verifikasi Nama & Email</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-white/5 backdrop-blur-md rounded-lg border border-white/10">
                <span className="material-symbols-outlined text-secondary-fixed">lock_reset</span>
                <span className="text-label-md">Reset Password Instan</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
