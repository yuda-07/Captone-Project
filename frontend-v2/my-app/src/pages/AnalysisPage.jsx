import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import StepIndicator from '../components/ui/StepIndicator.jsx'
import toast from 'react-hot-toast'
import { predictApi } from '../api'

const initialForm = {
  nama_usaha: '', 
  person_age: '', 
  person_income: '', 
  person_emp_length: '',
  loan_amnt: '', 
  loan_percent_income: '', 
  person_home_ownership: 'RENT',
  loan_intent: 'PERSONAL',
  cb_person_default_on_file: 'N'
}

export default function AnalysisPage() {
  const [step, setStep] = useState(1)
  const [form, setForm] = useState(initialForm)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  // Auto-calculate loan_percent_income
  useEffect(() => {
    if (form.loan_amnt && form.person_income && Number(form.person_income) > 0) {
      const ratio = (Number(form.loan_amnt) / Number(form.person_income)).toFixed(2);
      setForm(prev => ({ ...prev, loan_percent_income: ratio }));
    }
  }, [form.loan_amnt, form.person_income]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const nextStep = () => { 
    if (step === 1) {
      if (!form.nama_usaha || !form.person_age || !form.person_emp_length) {
        toast.error('Mohon lengkapi semua data pada langkah ini')
        return
      }
    } else if (step === 2) {
      if (!form.person_income || !form.loan_amnt) {
        toast.error('Mohon lengkapi semua data pada langkah ini')
        return
      }
    } else if (step === 3) {
      if (!form.person_home_ownership || !form.loan_intent || !form.cb_person_default_on_file) {
        toast.error('Mohon lengkapi semua data pada langkah ini')
        return
      }
    }
    if (step < 4) setStep(step + 1) 
  }
  const prevStep = () => { if (step > 1) setStep(step - 1) }

  const formatRupiahInput = (value) => {
    if (!value) return ''
    const numericStr = value.toString().replace(/\D/g, '')
    return numericStr.replace(/\B(?=(\d{3})+(?!\d))/g, '.')
  }

  const handleCurrencyChange = (e) => {
    const rawValue = e.target.value.replace(/\D/g, '')
    setForm({ ...form, [e.target.name]: rawValue })
  }

  const handleSubmit = async () => {
    setLoading(true)
    try {
      const res = await predictApi.predict(form)
      toast.success('Analisis selesai!')
      navigate('/result', { state: { prediction: res.data?.data, input: form } })
    } catch (err) {
      toast.error('Gagal melakukan analisis')
    } finally {
      setLoading(false)
    }
  }

  const inputClass = "w-full pl-12 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg input-focus-ring text-body-md text-primary placeholder:opacity-50"
  const selectClass = "w-full pl-12 pr-4 py-3 bg-surface-container-low border-transparent rounded-lg input-focus-ring text-body-md text-primary appearance-none"

  return (
    <DashboardLayout
      title="Analisis Kredit"
      subtitle=""
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
                  {step === 1 ? 'Informasi Pribadi & Bisnis' : step === 2 ? 'Informasi Pinjaman' : step === 3 ? 'Kondisi Kredit' : 'Review & Kirim'}
                </h2>
                <p className="text-body-md text-on-surface-variant">
                  {step === 1 ? 'Masukkan data diri dan lama bekerja.' : step === 2 ? 'Masukkan detail pendapatan dan pinjaman.' : step === 3 ? 'Pilih detail kredit dan status kepemilikan.' : 'Periksa kembali data Anda sebelum mengirim.'}
                </p>
              </div>
            </div>

            {/* Step 1: Personal & Business Info */}
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
                  <label className="block text-label-md text-primary">Usia (person_age)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">person</span>
                    <input className={inputClass} name="person_age" placeholder="35" type="number" value={form.person_age} onChange={handleChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Lama Bekerja / Usaha (tahun)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">schedule</span>
                    <input className={inputClass} name="person_emp_length" placeholder="5" type="number" value={form.person_emp_length} onChange={handleChange} />
                  </div>
                </div>
              </div>
            )}

            {/* Step 2: Financial Info */}
            {step === 2 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Pendapatan Tahunan (person_income)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                    <input className={inputClass} name="person_income" placeholder="100.000.000" type="text" value={formatRupiahInput(form.person_income)} onChange={handleCurrencyChange} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Jumlah Pinjaman (loan_amnt)</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-on-surface-variant">Rp</span>
                    <input className={inputClass} name="loan_amnt" placeholder="15.000.000" type="text" value={formatRupiahInput(form.loan_amnt)} onChange={handleCurrencyChange} />
                  </div>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <label className="block text-label-md text-primary">Rasio Pinjaman/Pendapatan</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">pie_chart</span>
                    <input className={`${inputClass} bg-surface-container opacity-70`} name="loan_percent_income" placeholder="0.15" type="number" step="0.01" value={form.loan_percent_income} onChange={handleChange} readOnly />
                  </div>
                  <p className="text-[11px] text-on-surface-variant">Dihitung otomatis</p>
                </div>

              </div>
            )}

            {/* Step 3: Additional Info */}
            {step === 3 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Status Kepemilikan Rumah</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">home</span>
                    <select className={selectClass} name="person_home_ownership" value={form.person_home_ownership} onChange={handleChange}>
                      <option value="RENT">Menyewa (RENT)</option>
                      <option value="OWN">Milik Sendiri (OWN)</option>
                      <option value="MORTGAGE">KPR (MORTGAGE)</option>
                      <option value="OTHER">Lainnya (OTHER)</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-label-md text-primary">Tujuan Pinjaman</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">target</span>
                    <select className={selectClass} name="loan_intent" value={form.loan_intent} onChange={handleChange}>
                      <option value="PERSONAL">Personal</option>
                      <option value="EDUCATION">Pendidikan (EDUCATION)</option>
                      <option value="MEDICAL">Medis (MEDICAL)</option>
                      <option value="VENTURE">Usaha (VENTURE)</option>
                      <option value="HOMEIMPROVEMENT">Renovasi (HOMEIMPROVEMENT)</option>
                    </select>
                  </div>
                </div>


                <div className="space-y-2 md:col-span-2">
                  <label className="block text-label-md text-primary">Pernah Gagal Bayar?</label>
                  <div className="relative">
                    <span className="absolute left-4 top-1/2 -translate-y-1/2 material-symbols-outlined text-on-surface-variant">warning</span>
                    <select className={selectClass} name="cb_person_default_on_file" value={form.cb_person_default_on_file} onChange={handleChange}>
                      <option value="N">Tidak Pernah (N)</option>
                      <option value="Y">Pernah Gagal Bayar (Y)</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {step === 4 && (
              <div className="space-y-4">
                <p className="text-body-md text-on-surface-variant mb-4">Periksa kembali data yang telah Anda masukkan:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    ['Nama Usaha', form.nama_usaha],
                    ['Usia', form.person_age],
                    ['Pendapatan Tahunan', form.person_income ? `Rp ${Number(form.person_income).toLocaleString('id-ID')}` : '-'],
                    ['Lama Bekerja (thn)', form.person_emp_length],
                    ['Jumlah Pinjaman', form.loan_amnt ? `Rp ${Number(form.loan_amnt).toLocaleString('id-ID')}` : '-'],
                    ['Rasio Pinjaman', form.loan_percent_income],
                    ['Status Rumah', form.person_home_ownership],
                    ['Tujuan Pinjaman', form.loan_intent],
                    ['Pernah Gagal Bayar', form.cb_person_default_on_file === 'Y' ? 'Ya' : 'Tidak'],
                  ].map(([label, value]) => (
                    <div key={label} className="flex flex-col p-3 bg-surface-container-low rounded-lg">
                      <span className="text-on-surface-variant text-[11px] uppercase tracking-wider">{label}</span>
                      <span className="text-primary font-bold">{value || '-'}</span>
                    </div>
                  ))}
                </div>
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
                Menjaga rasio pinjaman terhadap pendapatan (DTI) di bawah 0.3 dan tidak memiliki riwayat gagal bayar akan meningkatkan skor AI Anda secara drastis!
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
