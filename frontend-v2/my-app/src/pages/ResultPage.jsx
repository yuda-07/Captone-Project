import { useState, useEffect } from 'react'
import { useLocation, Link, useParams } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { predictApi } from '../api'

// ─── Helper: Generate dynamic AI analysis ─────────────
function getAiAnalysis(score, input) {
  const dti = Number(input.loan_percent_income || 0)
  const age = Number(input.person_age || 0)
  const emp = Number(input.person_emp_length || 0)
  const home = input.person_home_ownership || ''
  const intent = input.loan_intent || ''
  const hasDefault = input.cb_person_default_on_file === 'Y'

  if (score >= 750) {
    return `Profil keuangan Anda menunjukkan tingkat kelayakan kredit yang **sangat baik**. Rasio utang terhadap pendapatan sebesar ${(dti * 100).toFixed(1)}% berada di zona aman${emp >= 5 ? `, ditunjang pengalaman kerja/usaha selama ${emp} tahun yang memberikan stabilitas finansial tinggi` : ''}. ${home === 'OWN' ? 'Kepemilikan rumah sendiri menjadi aset jaminan kuat.' : home === 'MORTGAGE' ? 'Status KPR aktif menunjukkan kemampuan mengelola cicilan jangka panjang.' : ''} Model AI mengklasifikasikan Anda sebagai peminjam dengan risiko gagal bayar **sangat rendah**.`
  }
  if (score >= 600) {
    return `Analisis AI menunjukkan profil kredit Anda berada dalam kategori **cukup baik** dengan beberapa catatan. Rasio pinjaman terhadap pendapatan (${(dti * 100).toFixed(1)}%) ${dti <= 0.3 ? 'masih dalam batas wajar' : 'perlu diperhatikan karena mendekati ambang batas risiko'}. ${emp < 3 ? 'Pengalaman kerja/usaha yang masih singkat menjadi faktor yang perlu ditingkatkan.' : 'Pengalaman kerja Anda cukup memadai.'} ${hasDefault ? '⚠️ Riwayat gagal bayar sebelumnya menjadi catatan penting dalam penilaian.' : 'Tidak adanya riwayat gagal bayar menjadi nilai tambah.'}`
  }
  if (score >= 450) {
    return `Berdasarkan analisis mendalam, profil Anda berada di zona **perlu pertimbangan**. Rasio utang terhadap pendapatan (${(dti * 100).toFixed(1)}%) ${dti > 0.5 ? 'tergolong tinggi dan menjadi perhatian utama' : 'masih bisa dioptimalkan'}. ${emp < 2 ? 'Pengalaman kerja/usaha yang masih minim meningkatkan faktor risiko.' : ''} ${age < 25 ? 'Usia yang relatif muda berarti track record keuangan masih terbatas.' : ''} ${hasDefault ? 'Riwayat gagal bayar sebelumnya secara signifikan menurunkan skor kelayakan.' : ''} Diperlukan langkah-langkah strategis untuk memperkuat profil kredit Anda.`
  }
  return `Model AI mengidentifikasi profil Anda dalam kategori **risiko tinggi**. ${dti > 0.8 ? `Rasio pinjaman terhadap pendapatan yang sangat tinggi (${(dti * 100).toFixed(1)}%) menjadi faktor dominan.` : `Rasio pinjaman ${(dti * 100).toFixed(1)}% dikombinasikan dengan faktor risiko lain menurunkan skor secara kumulatif.`} ${emp === 0 ? 'Belum memiliki pengalaman kerja/usaha menjadi hambatan utama.' : emp < 2 ? 'Pengalaman kerja yang masih minim menambah profil risiko.' : ''} ${hasDefault ? 'Riwayat gagal bayar tercatat dan menjadi penalti signifikan.' : ''} ${home === 'OTHER' ? 'Status tempat tinggal yang tidak menentu juga berpengaruh.' : ''} Kami menyarankan untuk memperbaiki beberapa aspek sebelum mengajukan kembali.`
}

// ─── Helper: Generate dynamic recommendations ─────────
function getRecommendations(score, input) {
  const dti = Number(input.loan_percent_income || 0)
  const emp = Number(input.person_emp_length || 0)
  const home = input.person_home_ownership || ''
  const intent = input.loan_intent || ''
  const hasDefault = input.cb_person_default_on_file === 'Y'
  const income = Number(input.person_income || 0)
  const loan = Number(input.loan_amnt || 0)

  const recs = []

  // Score-specific recommendations
  if (score >= 750) {
    recs.push('Profil Anda sudah sangat kuat. Pertimbangkan untuk mengajukan limit kredit yang lebih tinggi atau tenor yang lebih panjang untuk mendapatkan bunga lebih kompetitif.')
    if (dti < 0.15) recs.push('Rasio DTI Anda sangat rendah — Anda memiliki kapasitas untuk mengambil pinjaman tambahan jika dibutuhkan untuk ekspansi usaha.')
    if (home === 'OWN') recs.push('Aset properti Anda bisa digunakan sebagai jaminan untuk mendapatkan suku bunga preferensial dari lembaga keuangan.')
    recs.push('Pertahankan catatan transaksi digital melalui platform e-wallet atau bank resmi untuk mempermudah verifikasi di masa depan.')
  } else if (score >= 600) {
    if (dti > 0.3) recs.push(`Kurangi rasio pinjaman terhadap pendapatan dari ${(dti * 100).toFixed(0)}% ke di bawah 30% — bisa dengan meningkatkan pendapatan atau mengurangi nominal pinjaman.`)
    if (emp < 5) recs.push(`Dengan pengalaman ${emp} tahun, tunggu hingga mencapai 5+ tahun untuk meningkatkan skor secara signifikan, atau sertakan bukti kontrak kerja tetap.`)
    if (home === 'RENT') recs.push('Pertimbangkan program KPR untuk beralih dari status penyewa — kepemilikan aset akan meningkatkan profil kredit Anda secara substansial.')
    if (hasDefault) recs.push('Fokus membangun kembali riwayat pembayaran positif minimal 12 bulan berturut-turut untuk memulihkan skor kredit.')
    recs.push('Simpan dokumentasi keuangan usaha (laporan laba-rugi, bukti transaksi) selama minimal 6 bulan terakhir.')
  } else if (score >= 450) {
    if (dti > 0.5) recs.push(`Rasio pinjaman Anda (${(dti * 100).toFixed(0)}%) terlalu tinggi. Prioritaskan pelunasan utang yang ada sebelum mengajukan pinjaman baru.`)
    else recs.push(`Turunkan rasio pinjaman dari ${(dti * 100).toFixed(0)}% ke di bawah 30% agar masuk zona aman.`)
    if (emp < 2) recs.push('Bangun track record usaha/pekerjaan minimal 2-3 tahun. Sertakan surat keterangan usaha dari kelurahan atau bukti kontrak kerja.')
    if (hasDefault) recs.push('Selesaikan seluruh kewajiban yang tertunggak dan bangun kembali riwayat pembayaran positif selama minimal 12-18 bulan.')
    if (home === 'RENT' || home === 'OTHER') recs.push('Stabilkan tempat tinggal Anda — status menyewa atau tidak tetap menurunkan skor. Program KPR bersubsidi bisa menjadi opsi.')
    if (intent === 'VENTURE') recs.push('Untuk pinjaman usaha, siapkan proposal bisnis dan proyeksi keuangan 12 bulan ke depan agar memperkuat pengajuan.')
    recs.push('Mulai gunakan rekening bisnis terpisah dari rekening pribadi untuk menunjukkan profesionalisme keuangan.')
  } else {
    recs.push('Fokuskan pada peningkatan pendapatan terlebih dahulu sebelum mengajukan pinjaman. Pertimbangkan pelatihan skill atau diversifikasi sumber pendapatan.')
    if (dti > 1) recs.push(`Nominal pinjaman melebihi pendapatan (DTI ${(dti * 100).toFixed(0)}%). Ajukan pinjaman yang lebih kecil, idealnya di bawah 30% dari pendapatan tahunan.`)
    if (emp === 0) recs.push('Bangun pengalaman kerja/usaha terlebih dahulu. Sertakan bukti pekerjaan atau surat keterangan usaha saat mengajukan kembali.')
    if (hasDefault) recs.push('Prioritas utama: selesaikan semua kewajiban tertunggak. Riwayat gagal bayar secara signifikan menurunkan peluang persetujuan.')
    recs.push('Mulai membangun rekam jejak keuangan digital — buka rekening tabungan dan gunakan secara aktif minimal 6 bulan sebelum mengajukan ulang.')
    if (home === 'OTHER') recs.push('Stabilkan status tempat tinggal Anda, baik dengan menyewa kontrak tetap atau program perumahan bersubsidi.')
  }

  return recs.slice(0, 4) // max 4 recommendations
}

// ─── Helper: Compute score category label & color ─────
function getScoreCategory(score) {
  if (score >= 800) return { label: 'Sangat Baik', color: 'text-green-600', bg: 'bg-green-50', border: 'border-green-500' }
  if (score >= 700) return { label: 'Baik', color: 'text-emerald-600', bg: 'bg-emerald-50', border: 'border-emerald-500' }
  if (score >= 600) return { label: 'Cukup Baik', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-500' }
  if (score >= 500) return { label: 'Perlu Ditingkatkan', color: 'text-amber-600', bg: 'bg-amber-50', border: 'border-amber-500' }
  if (score >= 400) return { label: 'Kurang', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-500' }
  return { label: 'Sangat Kurang', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-500' }
}

// ─── Helper: Risk level from score ────────────────────
function getRiskLevel(score) {
  if (score >= 750) return { level: 'Sangat Rendah', pct: Math.max(3, 100 - score / 10).toFixed(0) + '%' }
  if (score >= 600) return { level: 'Rendah', pct: Math.max(8, 120 - score / 8).toFixed(0) + '%' }
  if (score >= 450) return { level: 'Sedang', pct: Math.max(20, 150 - score / 6).toFixed(0) + '%' }
  return { level: 'Tinggi', pct: Math.min(85, 200 - score / 5).toFixed(0) + '%' }
}

export default function ResultPage() {
  const { id } = useParams()
  const location = useLocation()
  
  const [prediction, setPrediction] = useState(location.state?.prediction || null)
  const [input, setInput] = useState(location.state?.input || null)
  const [loading, setLoading] = useState(!!(id && !location.state?.prediction))

  useEffect(() => {
    if (id && !location.state?.prediction) {
      const fetchDetail = async () => {
        try {
          const res = await predictApi.getHistoryById(id)
          setPrediction(res.data.data)
          setInput(res.data.data) // database schema contains the inputs as well
        } catch (err) {
          console.error('Gagal memuat detail', err)
        } finally {
          setLoading(false)
        }
      }
      fetchDetail()
    }
  }, [id, location.state])

  if (loading) {
    return (
      <DashboardLayout title="Memuat Hasil..." subtitle="">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
        </div>
      </DashboardLayout>
    )
  }

  const safePrediction = prediction || { score: 0, status: 'Tidak Diketahui' }
  const safeInput = input || { loan_percent_income: 0 }
  const score = safePrediction.score || 0
  const scorePercent = Math.min((score / 900) * 100, 100)
  const status = safePrediction.status || 'Tidak Diketahui'
  const isLayak = status.toLowerCase() === 'layak'
  const isPerlu = status.toLowerCase() === 'perlu pertimbangan'

  const category = getScoreCategory(score)
  const risk = getRiskLevel(score)
  const dti = Number(safeInput.loan_percent_income || 0)
  const analysis = getAiAnalysis(score, safeInput)
  const recommendations = getRecommendations(score, safeInput)

  // Dynamic status styling
  const statusStyle = isLayak
    ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/50'
    : isPerlu
    ? 'bg-amber-50 text-amber-800 border-amber-300'
    : 'bg-error-container text-on-error-container border-error/30'
  const statusIcon = isLayak ? 'check_circle' : isPerlu ? 'info' : 'cancel'
  const statusIconColor = isLayak ? 'text-secondary' : isPerlu ? 'text-amber-600' : 'text-error'

  return (
    <DashboardLayout title="Hasil Prediksi Kelayakan" subtitle="Laporan analisis kredit AI untuk usaha Anda">
      <div className="grid grid-cols-12 gap-6">
        {/* Score Card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6 flex flex-col items-center justify-center text-center relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <span className="material-symbols-outlined text-[120px]">verified</span>
          </div>
          <h3 className="text-label-md text-on-surface-variant uppercase tracking-wider mb-6">Skor Kredit MicroCred</h3>
          {/* Radial */}
          <div className="radial-progress-score flex items-center justify-center mb-4 shadow-xl relative" style={{ '--value': scorePercent }}>
            <div className="text-center">
              <span className="text-display font-hanken text-primary block leading-none">{score}</span>
              <span className="text-label-sm text-on-surface-variant uppercase">Poin / 900</span>
            </div>
          </div>
          {/* Category Label */}
          <p className={`text-label-md font-bold mb-4 ${category.color}`}>{category.label}</p>
          {/* Status */}
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border ${statusStyle}`}>
            <span className={`material-symbols-outlined filled ${statusIconColor}`}>
              {statusIcon}
            </span>
            <span className="text-headline-md font-hanken font-bold">{status.toUpperCase()}</span>
          </div>
          <p className="mt-6 text-on-surface-variant text-label-sm italic">Terakhir diperbarui: {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
        </div>

        {/* Analysis + Recommendations */}
        <div className="col-span-12 lg:col-span-7 space-y-6">
          {/* AI Analysis */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-lg bg-primary-container flex items-center justify-center text-on-primary">
                <span className="material-symbols-outlined">psychology</span>
              </div>
              <h3 className="text-headline-md font-hanken">Analisis Kecerdasan Buatan</h3>
            </div>
            <div className={`bg-surface-container-low p-6 rounded-lg border-l-4 ${category.border}`}>
              <p className="text-body-lg text-on-surface leading-relaxed">
                {analysis.split('**').map((part, i) =>
                  i % 2 === 1
                    ? <span key={i} className={`font-bold ${category.color}`}>{part}</span>
                    : <span key={i}>{part}</span>
                )}
              </p>
            </div>
            <div className="mt-6 grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <p className="text-label-sm text-on-surface-variant mb-1">Rasio Pinjaman (DTI)</p>
                <p className={`text-headline-md font-hanken font-bold ${dti > 0.5 ? 'text-error' : dti > 0.3 ? 'text-amber-600' : 'text-secondary'}`}>
                  {(dti * 100).toFixed(1)}%
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  {dti <= 0.2 ? 'Sangat Sehat' : dti <= 0.3 ? 'Sehat' : dti <= 0.5 ? 'Perlu Perhatian' : 'Risiko Tinggi'}
                </p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <p className="text-label-sm text-on-surface-variant mb-1">Estimasi Risiko Gagal Bayar</p>
                <p className={`text-headline-md font-hanken font-bold ${score >= 600 ? 'text-secondary' : score >= 450 ? 'text-amber-600' : 'text-error'}`}>
                  {risk.pct}
                </p>
                <p className="text-[11px] text-on-surface-variant mt-1">
                  Risiko {risk.level}
                </p>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 p-6">
            <h3 className="text-headline-md font-hanken mb-4 flex items-center gap-2">
              <span className="material-symbols-outlined text-tertiary-fixed-dim">tips_and_updates</span>
              Rekomendasi Strategis
            </h3>
            <ul className="space-y-4">
              {recommendations.map((rec, i) => (
                <li key={i} className="flex gap-4 items-start">
                  <div className="mt-1 w-6 h-6 rounded-full bg-secondary-fixed flex-shrink-0 flex items-center justify-center text-on-secondary-fixed">
                    <span className="text-[14px] font-bold">{i + 1}</span>
                  </div>
                  <p className="text-body-md text-on-surface-variant">{rec}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="col-span-12 flex flex-col md:flex-row items-center justify-center gap-4 py-6">
          <Link to="/dashboard" className="w-full md:w-auto px-12 py-4 bg-secondary text-on-secondary rounded-lg text-headline-md font-hanken shadow-md hover:scale-[1.02] active:scale-95 transition-all text-center">
            Kembali ke Dashboard
          </Link>
          <Link to="/analysis" className="w-full md:w-auto px-12 py-4 border-2 border-primary text-primary rounded-lg text-headline-md font-hanken hover:bg-primary/5 active:scale-95 transition-all text-center">
            Coba Lagi
          </Link>
        </div>
      </div>
    </DashboardLayout>
  )
}
