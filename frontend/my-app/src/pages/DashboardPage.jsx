import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import CreditScoreGauge from '../components/ui/CreditScoreGauge.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'

const recentHistory = [
  { id: '#MC-8821', date: '10 Okt 2024', type: 'Modal Usaha MSME', score: 720, status: 'Approved' },
  { id: '#MC-8745', date: '25 Sep 2024', type: 'Kredit Alat Produksi', score: 685, status: 'Approved' },
  { id: '#MC-8612', date: '14 Agu 2024', type: 'Ekspansi Cabang', score: 590, status: 'Review' },
]

export default function DashboardPage() {
  return (
    <DashboardLayout
      subtitle="Selamat datang kembali di dashboard keuangan Anda."
      headerRight={
        <>
          <button className="p-2 hover:bg-surface-container rounded-full transition-colors relative">
            <span className="material-symbols-outlined text-outline">notifications</span>
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full"></span>
          </button>
          <div className="h-8 w-[1px] bg-outline-variant mx-2"></div>
          <Link to="/analysis" className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-3 rounded-full text-label-md shadow-sm hover:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            Mulai Analisis Baru
          </Link>
        </>
      }
    >
      <div className="bento-grid">
        {/* Credit Score Card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-headline-md font-hanken text-primary">Credit Score</h3>
              <p className="text-on-surface-variant text-label-md">Berdasarkan AI Analysis terkini</p>
            </div>
            <span className="bg-emerald-100 text-emerald-800 text-label-sm px-2 py-1 rounded-full border border-emerald-200">Eligible</span>
          </div>
          <div className="flex items-center justify-center py-6">
            <CreditScoreGauge score={720} maxScore={1000} size="lg" />
          </div>
          <div className="pt-2 border-t border-outline-variant mt-6 flex justify-between items-center">
            <span className="text-on-surface-variant text-label-sm italic">Terakhir diperbarui: 12 Okt 2024</span>
            <button className="text-secondary text-label-md hover:underline flex items-center gap-1">
              Detail <span className="material-symbols-outlined text-[18px]">chevron_right</span>
            </button>
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-headline-md font-hanken text-primary">Statistik Keuangan</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-label-sm">Income</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-container"></span><span className="text-label-sm">Expenses</span></div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-64 px-2">
            {['Sen','Sel','Rab','Kam','Jum','Sab','Min'].map((day, i) => {
              const heights = [[60,40],[80,30],[55,45],[90,20],[70,60],[40,20],[30,15]]
              return (
                <div key={day} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
                  <div className="w-full flex gap-1 items-end h-full">
                    <div className="bg-secondary w-1/2 rounded-t transition-all hover:opacity-80" style={{height: `${heights[i][0]}%`}}></div>
                    <div className="bg-primary-container w-1/2 rounded-t transition-all hover:opacity-80" style={{height: `${heights[i][1]}%`}}></div>
                  </div>
                  <span className="text-label-sm mt-2">{day}</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Recent Analysis History */}
        <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-md font-hanken text-primary">Riwayat Analisis Terbaru</h3>
            <Link to="/history" className="text-secondary text-label-md hover:underline">Lihat Semua</Link>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-surface-container-low text-on-surface-variant text-label-sm">
                <tr>
                  <th className="px-6 py-3">ID Analisis</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Jenis Pinjaman</th>
                  <th className="px-6 py-3">Skor</th>
                  <th className="px-6 py-3 text-right">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {recentHistory.map((item) => (
                  <tr key={item.id} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                    <td className="px-6 py-4 text-label-md">{item.id}</td>
                    <td className="px-6 py-4 text-on-surface-variant">{item.date}</td>
                    <td className="px-6 py-4">{item.type}</td>
                    <td className="px-6 py-4 font-bold text-secondary">{item.score}</td>
                    <td className="px-6 py-4 text-right"><StatusBadge status={item.status} /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* AI Insights */}
        <div className="col-span-12 lg:col-span-4 bg-primary-container p-6 rounded-xl text-on-primary relative overflow-hidden h-48 flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <span className="material-symbols-outlined text-[80px] filled">auto_awesome</span>
          </div>
          <h4 className="text-headline-md font-hanken mb-2">AI Insight</h4>
          <p className="text-on-primary-container text-label-md">Pertumbuhan arus kas Anda naik 12% bulan ini. Rekomendasi: Ekspansi inventaris.</p>
        </div>

        {/* Market Trends */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-highest p-6 rounded-xl border border-outline-variant h-48 flex items-center gap-6">
          <div className="flex-1">
            <h4 className="text-headline-md font-hanken text-primary mb-2">Market Trends</h4>
            <p className="text-on-surface-variant text-label-md">Sektor Ritel di wilayah Anda sedang mengalami kenaikan permintaan musiman. Sangat baik untuk pengajuan kredit tambahan.</p>
          </div>
          <div className="w-1/3 h-full rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[48px]">trending_up</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
