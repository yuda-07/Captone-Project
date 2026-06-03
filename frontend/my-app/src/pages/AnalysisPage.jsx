import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import StepIndicator from '../components/ui/StepIndicator.jsx'
import toast from 'react-hot-toast'

const initialForm = {
  nama_usaha: '', usia_pemilik: '', lama_usaha: '',
  pendapatan_bulanan: '', pengeluaran_bulanan: '', jumlah_pinjaman: '',
  riwayat_telat_bayar: '', jumlah_tanggungan: ''
}

export default function AnalysisPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const nextStep = () => { if (step < 4) setStep(step + 1) }
  const prevStep = () => { if (step > 1) setStep(step - 1) }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      // TODO: const res = await predictApi.predict(form)
      // Simulate AI prediction
      await new Promise(r => setTimeout(r, 2000))
      const mockResult = {
        score: Math.floor(Math.random() * 400) + 500,
        status: Math.random() > 0.3 ? 'Layak' : 'Berisiko'
      }
      toast.success('Analisis selesai!')
      navigate('/result', { state: { prediction: mockResult, input: form } })
    } catch (err) {
      toast.error('Gagal melakukan analisis')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg input-focus-ring text-body-md text-primary placeholder:opacity-50"

  return (
    <DashboardLayout
      title="Analisis Kredit"
      subtitle=""
      headerRight={
        <button className="bg-primary text-on-primary px-6 py-2 rounded-lg font-bold hover:opacity-90 transition-opacity active:scale-95">
          Simpan Draft
        </button>
      }
    >
      <StepIndicator currentStep={step} totalSteps={4} />

      <div className="grid grid-cols-12 gap-6">
        {/* Main Form */}
        <div className="col-span-12 lg:col-span-8">
          <div className="bg-white rounded-xl card-shadow p-6 overflow-hidden">
            {/* Step Headers */}
            <div className="flex items-center gap-3 mb-8 pb-4 border-b border-outline-variant">
              <div className="bg-secondary-container/20 p-2 rounded-lg">
                <span className="material-symbols-outlined text-secondary">
                  {step === 1 ? 'store' : step === 2 ? 'account_balance_wallet' : step === 3 ? 'description' : 'fact_check'}
                </span>
              </div>
              <div>
                <h2 className="text-headline-md font-hanken text-primary">
                  {step === 1 ? 'Informasi Bisnis' : step === 2 ? 'Informasi Keuangan Bulanan' : step === 3 ? 'Detail Tambahan' : 'Review & Kirim'}
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  {step === 1 ? 'Masukkan informasi dasar usaha Anda.' : step === 2 ? 'Silakan masukkan detail pendapatan dan pengeluaran.' : step === 3 ? 'Informasi tambahan untuk analisis.' : 'Periksa kembali data Anda sebelum mengirim.'}
                </p>
              </div>
            </div>

            {/* Step 1: Business Info */}
            {step === 1 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-label-md text-primary">Nama Usaha</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">store</span>
                    <input className={inputClass} name="nama_usaha" placeholder="Toko Maju Jaya" value={form.nama_usaha} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Usia Pemilik</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">person</span>
                    <input className={inputClass} name="usia_pemilik" placeholder="35" type="number" value={form.usia_pemilik} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Usia pemilik usaha dalam tahun</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Lama Usaha (tahun)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">schedule</span>
                    <input className={inputClass} name="lama_usaha" placeholder="5" type="number" value={form.lama_usaha} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Berapa lama usaha telah beroperasi</p>
                </div>
              </div>
            )}

            {/* Step 2: Financial Info */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Pendapatan Bulanan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                    <input className={inputClass} name="pendapatan_bulanan" placeholder="10000000" type="number" value={form.pendapatan_bulanan} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Total seluruh pemasukan kotor per bulan</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Pengeluaran Bulanan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                    <input className={inputClass} name="pengeluaran_bulanan" placeholder="6000000" type="number" value={form.pengeluaran_bulanan} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Biaya operasional, gaji, dan stok barang</p>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-label-md text-primary">Jumlah Pinjaman yang Diajukan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                    <input className={`${inputClass} border-2 border-secondary/20`} name="jumlah_pinjaman" placeholder="15000000" type="number" value={form.jumlah_pinjaman} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Total modal yang Anda butuhkan</p>
                </div>
              </div>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Riwayat Telat Bayar</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">warning</span>
                    <input className={inputClass} name="riwayat_telat_bayar" placeholder="0" type="number" value={form.riwayat_telat_bayar} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Jumlah keterlambatan pembayaran pinjaman sebelumnya</p>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Jumlah Tanggungan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">family_restroom</span>
                    <input className={inputClass} name="jumlah_tanggungan" placeholder="2" type="number" value={form.jumlah_tanggungan} onChange={handleChange} />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Jumlah orang yang menjadi tanggungan finansial</p>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-body-md text-on-surface-variant mb-4">Periksa kembali data yang telah Anda masukkan:</p>
                {[
                  ['Nama Usaha', form.nama_usaha],
                  ['Usia Pemilik', form.usia_pemilik ? `${form.usia_pemilik} tahun` : '-'],
                  ['Lama Usaha', form.lama_usaha ? `${form.lama_usaha} tahun` : '-'],
                  ['Pendapatan Bulanan', form.pendapatan_bulanan ? `Rp ${Number(form.pendapatan_bulanan).toLocaleString('id-ID')}` : '-'],
                  ['Pengeluaran Bulanan', form.pengeluaran_bulanan ? `Rp ${Number(form.pengeluaran_bulanan).toLocaleString('id-ID')}` : '-'],
                  ['Jumlah Pinjaman', form.jumlah_pinjaman ? `Rp ${Number(form.jumlah_pinjaman).toLocaleString('id-ID')}` : '-'],
                  ['Riwayat Telat Bayar', form.riwayat_telat_bayar || '0'],
                  ['Jumlah Tanggungan', form.jumlah_tanggungan || '0'],
                ].map(([label, value]) => (
                  <div key={label} className="flex justify-between p-4 bg-surface-container-low rounded-lg">
                    <span className="text-on-surface-variant text-label-md">{label}</span>
                    <span className="text-primary font-bold">{value || '-'}</span>
                  </div>
                ))}
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="pt-8 flex items-center justify-between border-t border-outline-variant mt-8">
              {step > 1 ? (
                <button onClick={prevStep} className="flex items-center gap-2 text-primary font-bold hover:translate-x-[-4px] transition-transform" type="button">
                  <span className="material-symbols-outlined">arrow_back</span> Kembali
                </button>
              ) : <div></div>}
              {step < 4 ? (
                <button onClick={nextStep} className="bg-primary text-on-primary px-10 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2">
                  Lanjutkan <span className="material-symbols-outlined">arrow_forward</span>
                </button>
              ) : (
                <button onClick={handleSubmit} disabled={loading} className="bg-secondary text-on-secondary px-10 py-3 rounded-lg font-bold shadow-lg hover:opacity-90 active:scale-95 transition-all flex items-center gap-2 disabled:opacity-50">
                  {loading ? 'Menganalisis...' : 'Kirim & Analisis'}
                  <span className="material-symbols-outlined">send</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="bg-primary-container p-6 rounded-xl text-on-primary relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-2 mb-4">
                <span className="material-symbols-outlined text-secondary-fixed filled">auto_awesome</span>
                <span className="text-label-sm uppercase tracking-widest text-secondary-fixed">AI Advisor</span>
              </div>
              <h3 className="text-headline-md font-hanken mb-2">Tips Persetujuan</h3>
              <p className="text-body-md opacity-80 mb-6 leading-relaxed">
                Pastikan rasio pembayaran hutang Anda tidak melebihi 30% dari keuntungan bulanan untuk meningkatkan peluang persetujuan otomatis.
              </p>
              <div className="bg-white/10 p-4 rounded-lg border border-white/10">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm opacity-70">Potensi Skor</span>
                  <span className="text-secondary-fixed font-bold">Tinggi</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="w-4/5 h-full bg-secondary-fixed shadow-[0_0_10px_rgba(123,208,255,0.5)]"></div>
                </div>
              </div>
            </div>
            <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-secondary/20 rounded-full blur-3xl"></div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
