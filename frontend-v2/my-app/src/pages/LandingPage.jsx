import { Link } from 'react-router-dom'
import Navbar from '../components/layout/Navbar.jsx'
import Footer from '../components/layout/Footer.jsx'

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-surface text-on-surface">
      <Navbar />

      {/* Hero Section */}
      <header className="relative overflow-hidden pt-12 pb-12 lg:pt-32 lg:pb-40">
        <div className="max-w-container-max mx-auto px-5 md:px-10 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="z-10">
            <span className="inline-block px-4 py-1.5 rounded-full bg-secondary-fixed text-on-secondary-fixed font-inter text-label-sm mb-6 uppercase tracking-wider">
              Pemberdayaan UMKM
            </span>
            <h1 className="font-hanken text-display text-primary leading-tight mb-6">
              AI-Based Credit Scoring for UMKM
            </h1>
            <p className="font-inter text-body-lg text-on-surface-variant mb-10 max-w-lg">
              Bantu usaha Anda mendapatkan analisis kelayakan kredit secara cepat dan objektif menggunakan teknologi AI.
            </p>
            <div className="flex flex-wrap gap-3">
              <Link
                to="/register"
                className="px-10 py-4 bg-primary text-on-primary rounded-lg font-hanken text-headline-md font-bold shadow-lg hover:shadow-xl transition-all hover:translate-y-[-2px] active:scale-95"
              >
                Mulai Analisis
              </Link>
            </div>
          </div>

          {/* Credit Score Preview Card */}
          <div className="relative">
            <div className="absolute -top-20 -right-20 w-96 h-96 bg-secondary/10 rounded-full blur-3xl"></div>
            <div className="relative bg-surface-container-lowest rounded-xl p-6 shadow-2xl border border-outline-variant/30">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <p className="text-label-sm font-inter text-on-surface-variant">CREDIT HEALTH SCORE</p>
                  <p className="text-headline-md font-hanken text-primary">Potensi Tinggi</p>
                </div>
                <span className="material-symbols-outlined text-secondary text-4xl">analytics</span>
              </div>
              <div className="flex flex-col items-center py-4">
                <div className="relative w-48 h-48 rounded-full border-[12px] border-surface-container-highest flex items-center justify-center">
                  <div className="absolute inset-[-12px] w-48 h-48 rounded-full border-[12px] border-secondary border-r-transparent border-b-transparent rotate-[45deg]"></div>
                  <div className="text-center">
                    <span className="text-5xl font-extrabold text-primary block font-hanken">782</span>
                    <span className="text-label-sm text-on-surface-variant font-inter">Vantage 4.0</span>
                  </div>
                </div>
              </div>
              <div className="mt-8 pt-6 border-t border-outline-variant/20 grid grid-cols-2 gap-4">
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="text-label-sm text-on-surface-variant font-inter">Pertumbuhan</p>
                  <p className="text-body-md font-bold text-secondary font-inter">+14.2%</p>
                </div>
                <div className="p-4 bg-surface-container rounded-lg">
                  <p className="text-label-sm text-on-surface-variant font-inter">Reliabilitas</p>
                  <p className="text-body-md font-bold text-secondary font-inter">Terverifikasi</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-12 bg-surface-container-low" id="features">
        <div className="max-w-container-max mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg font-hanken text-primary mb-4">Fitur Unggulan</h2>
            <p className="font-inter text-body-md text-on-surface-variant max-w-2xl mx-auto">
              Teknologi mutakhir untuk mendukung pertumbuhan finansial UMKM Indonesia.
            </p>
          </div>
          <div className="bento-grid">
            <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-72">
              <div>
                <span className="material-symbols-outlined text-secondary text-5xl mb-6">psychology</span>
                <h3 className="text-headline-md font-hanken text-primary mb-3">Analisis berbasis AI</h3>
              </div>
              <p className="font-inter text-body-md text-on-surface-variant">
                Algoritma cerdas yang memproses ribuan titik data untuk memahami profil risiko secara mendalam.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 bg-primary p-8 rounded-xl shadow-sm flex flex-col justify-between h-72">
              <div>
                <span className="material-symbols-outlined text-secondary-fixed text-5xl mb-6">fact_check</span>
                <h3 className="text-headline-md font-hanken text-on-primary mb-3">Penilaian kredit otomatis</h3>
              </div>
              <p className="font-inter text-body-md text-on-primary-container">
                Hasil instan tanpa proses manual yang berbelit, memberikan kepastian lebih cepat bagi pelaku usaha.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 bg-surface-container-highest p-8 rounded-xl flex flex-col justify-between h-72">
              <div>
                <span className="material-symbols-outlined text-primary text-5xl mb-6">bolt</span>
                <h3 className="text-headline-md font-hanken text-primary mb-3">Proses cepat dan mudah</h3>
              </div>
              <p className="font-inter text-body-md text-on-surface-variant">
                Alur pendaftaran dan input data yang disederhanakan, selesai hanya dalam hitungan menit.
              </p>
            </div>
            <div className="col-span-12 md:col-span-6 bg-surface-container-lowest p-8 rounded-xl shadow-sm border border-outline-variant/30 flex flex-col justify-between h-72">
              <div>
                <span className="material-symbols-outlined text-secondary text-5xl mb-6">bar_chart</span>
                <h3 className="text-headline-md font-hanken text-primary mb-3">Hasil objektif berbasis data</h3>
              </div>
              <p className="font-inter text-body-md text-on-surface-variant">
                Laporan transparan berdasarkan fakta performa bisnis, membantu Anda memahami posisi kredit Anda.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-12 bg-surface-container-lowest" id="how-it-works">
        <div className="max-w-container-max mx-auto px-5 md:px-10">
          <div className="text-center mb-16">
            <h2 className="text-headline-lg font-hanken text-primary mb-4">Cara Kerja</h2>
            <p className="font-inter text-body-md text-on-surface-variant">
              Langkah mudah untuk mengetahui kelayakan kredit usaha Anda.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative pt-2">
            {/* Connecting Line aligned with the center of the circles (top-10 roughly matches half of w-16 + pt-2) */}
            <div className="hidden md:block absolute top-[2.5rem] left-[10%] w-[80%] h-[2px] bg-outline-variant/50 -translate-y-1/2 z-0"></div>

            {[
              { num: '1', title: 'Isi data usaha', desc: 'Lengkapi informasi dasar dan dokumen pendukung usaha Anda melalui portal kami.', color: 'bg-primary text-on-primary' },
              { num: '2', title: 'AI menganalisis data', desc: 'Sistem AI kami akan memproses data Anda untuk memberikan penilaian yang komprehensif.', color: 'bg-primary text-on-primary' },
              { num: '3', title: 'Dapatkan hasil credit scoring', desc: 'Terima laporan skor kredit dan analisis kelayakan dalam waktu singkat.', color: 'bg-secondary text-on-secondary' },
            ].map((step) => (
              <div key={step.num} className="relative z-10 text-center flex flex-col items-center group">
                <div className={`w-16 h-16 rounded-full ${step.color} flex items-center justify-center font-hanken text-headline-md mb-6 ring-8 ring-surface-container-lowest group-hover:scale-110 transition-transform`}>
                  {step.num}
                </div>
                <h3 className="text-headline-md font-hanken text-primary mb-2">{step.title}</h3>
                <p className="font-inter text-body-md text-on-surface-variant px-4">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits / CTA Section */}
      <section className="py-12 bg-primary-container text-on-primary" id="about">
        <div className="max-w-container-max mx-auto px-5 md:px-10 text-center">
          <h2 className="font-hanken text-display text-on-primary mb-6">Manfaat untuk UMKM</h2>
          <p className="font-inter text-body-lg text-primary-fixed-dim mb-10 max-w-2xl mx-auto opacity-80">
            Kami hadir untuk membuka akses finansial yang lebih luas bagi pelaku usaha kecil dan menengah melalui teknologi inklusif.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {[
              { title: 'Akses Modal', desc: 'Meningkatkan peluang disetujuinya pinjaman modal dari berbagai lembaga keuangan.' },
              { title: 'Bunga Kompetitif', desc: 'Dengan skor yang baik, Anda bisa menegosiasikan suku bunga yang lebih rendah.' },
              { title: 'Wawasan Bisnis', desc: 'Pahami faktor apa saja yang mempengaruhi kesehatan finansial usaha Anda.' },
            ].map((item) => (
              <div key={item.title} className="p-6 bg-white/5 rounded-xl border border-white/10 text-left">
                <h4 className="text-headline-md font-hanken mb-2">{item.title}</h4>
                <p className="text-body-md font-inter opacity-70">{item.desc}</p>
              </div>
            ))}
          </div>
          <Link
            to="/register"
            className="inline-block px-12 py-5 bg-secondary text-on-secondary rounded-lg font-hanken text-headline-md font-bold hover:bg-secondary-container transition-all active:scale-95 shadow-lg"
          >
            Mulai Analisis Sekarang
          </Link>
        </div>
      </section>

      <Footer />
    </div>
  )
}
