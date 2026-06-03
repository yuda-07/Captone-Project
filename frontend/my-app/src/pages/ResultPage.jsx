import { useLocation, Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import { formatRupiah } from '../utils/helpers.js'

export default function ResultPage() {
  const location = useLocation()
  const { prediction, input } = location.state || {
    prediction: { score: 850, status: 'Layak' },
    input: { nama_usaha: 'Demo Usaha', pendapatan_bulanan: 10000000, pengeluaran_bulanan: 6000000, jumlah_pinjaman: 15000000 }
  }

  const scorePercent = Math.min((prediction.score / 1000) * 100, 100)
  const isEligible = prediction.status?.toLowerCase() === 'layak'

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
          <div className="radial-progress-score flex items-center justify-center mb-6 shadow-xl relative" style={{ '--value': scorePercent }}>
            <div className="text-center">
              <span className="text-display font-hanken text-primary block leading-none">{prediction.score}</span>
              <span className="text-label-sm text-on-surface-variant uppercase">Poin / 1000</span>
            </div>
          </div>
          {/* Status */}
          <div className={`inline-flex items-center gap-2 px-6 py-2 rounded-full border ${isEligible ? 'bg-secondary-container/20 text-on-secondary-container border-secondary-container/50' : 'bg-error-container text-on-error-container border-error/30'}`}>
            <span className={`material-symbols-outlined filled ${isEligible ? 'text-secondary' : 'text-error'}`}>
              {isEligible ? 'check_circle' : 'cancel'}
            </span>
            <span className="text-headline-md font-hanken font-bold">{prediction.status?.toUpperCase()}</span>
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
            <div className="bg-surface-container-low p-6 rounded-lg border-l-4 border-secondary">
              <p className="text-body-lg text-on-surface leading-relaxed">
                Berdasarkan data finansial Anda, profil risiko Anda{' '}
                <span className={`font-bold ${isEligible ? 'text-secondary' : 'text-error'}`}>
                  {isEligible ? 'rendah' : 'tinggi'}
                </span>.
                {isEligible
                  ? ' Stabilitas arus kas bulanan dan rasio utang terhadap pendapatan menunjukkan performa yang sangat sehat untuk kategori UMKM di sektor Anda.'
                  : ' Perlu peningkatan stabilitas arus kas dan penurunan rasio utang terhadap pendapatan untuk meningkatkan kelayakan kredit.'}
              </p>
            </div>
            <div className="mt-8 grid grid-cols-2 gap-4">
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <p className="text-label-sm text-on-surface-variant mb-1">Rasio Pendapatan</p>
                <p className="text-headline-md font-hanken text-primary font-bold">
                  {input.pendapatan_bulanan && input.pengeluaran_bulanan
                    ? (Number(input.pendapatan_bulanan) / Math.max(Number(input.pengeluaran_bulanan), 1)).toFixed(1) + 'x'
                    : '4.2x'}
                </p>
              </div>
              <div className="p-4 bg-surface rounded-lg border border-outline-variant/20">
                <p className="text-label-sm text-on-surface-variant mb-1">Indeks Pertumbuhan</p>
                <p className="text-headline-md font-hanken text-primary font-bold">+12%</p>
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
              <li className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-secondary-fixed flex-shrink-0 flex items-center justify-center text-on-secondary-fixed">
                  <span className="text-[14px] font-bold">1</span>
                </div>
                <p className="text-body-md text-on-surface-variant">Tingkatkan pendapatan bulanan sebesar 15% untuk menaikkan skor Anda ke kategori Premium.</p>
              </li>
              <li className="flex gap-4 items-start">
                <div className="mt-1 w-6 h-6 rounded-full bg-secondary-fixed flex-shrink-0 flex items-center justify-center text-on-secondary-fixed">
                  <span className="text-[14px] font-bold">2</span>
                </div>
                <p className="text-body-md text-on-surface-variant">Pertahankan catatan transaksi digital melalui platform e-wallet atau bank resmi untuk validasi data otomatis.</p>
              </li>
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
