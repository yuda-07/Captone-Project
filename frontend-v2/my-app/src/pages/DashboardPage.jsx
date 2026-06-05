import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import CreditScoreGauge from '../components/ui/CreditScoreGauge.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { predictApi } from '../api'
import { formatDate, formatRupiah } from '../utils/helpers.js'

export default function DashboardPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await predictApi.getHistory()
        setHistory(res.data.data || [])
      } catch (err) {
        console.error('Gagal mengambil riwayat:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchHistory()
  }, [])

  // Derived data
  const latestPrediction = history.length > 0 ? history[0] : null
  const latestScore = latestPrediction?.score ?? 0
  const latestStatus = latestPrediction?.status ?? '-'
  const latestDate = latestPrediction?.created_at ? formatDate(latestPrediction.created_at) : '-'
  const recentHistory = history.slice(0, 3)

  // Build financial chart data from last 7 predictions (or fewer)
  const chartData = history.slice(0, 7).reverse()

  // Find max values for scaling the bars
  const maxIncome = Math.max(...chartData.map(d => Number(d.person_income) || 0), 1)
  const maxExpense = Math.max(...chartData.map(d => Number(d.loan_amnt) || 0), 1)
  const maxVal = Math.max(maxIncome, maxExpense)

  return (
    <DashboardLayout
      subtitle="Selamat datang di dashboard keuangan Anda."
      headerRight={
        <>
          <Link to="/analysis" className="flex items-center gap-2 bg-secondary text-on-secondary px-4 py-3 rounded-full text-label-md shadow-sm hover:scale-95 transition-transform">
            <span className="material-symbols-outlined">add</span>
            Mulai Analisis Baru
          </Link>
        </>
      }
    >
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
        </div>
      ) : (
      <div className="bento-grid">
        {/* Credit Score Card */}
        <div className="col-span-12 lg:col-span-5 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col justify-between overflow-hidden relative">
          <div className="flex justify-between items-start mb-6">
            <div>
              <h3 className="text-headline-md font-hanken text-primary">Credit Score</h3>
              <p className="text-on-surface-variant text-label-md">Berdasarkan AI Analysis terkini</p>
            </div>
            {latestPrediction && (
              <span className={`text-label-sm px-2 py-1 rounded-full border ${latestStatus?.toLowerCase() === 'layak' ? 'bg-emerald-100 text-emerald-800 border-emerald-200' : 'bg-red-100 text-red-800 border-red-200'}`}>
                {latestStatus}
              </span>
            )}
          </div>
          <div className="flex items-center justify-center py-6">
            {latestPrediction ? (
              <CreditScoreGauge score={latestScore} maxScore={1000} size="lg" />
            ) : (
              <div className="text-center text-on-surface-variant">
                <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">analytics</span>
                <p className="text-label-md">Belum ada analisis</p>
                <Link to="/analysis" className="text-secondary text-label-sm hover:underline">Mulai analisis pertama →</Link>
              </div>
            )}
          </div>
          <div className="pt-2 border-t border-outline-variant mt-6 flex justify-between items-center">
            <span className="text-on-surface-variant text-label-sm italic">Terakhir diperbarui: {latestDate}</span>
            {latestPrediction && (
              <Link to="/history" className="text-secondary text-label-md hover:underline flex items-center gap-1">
                Detail <span className="material-symbols-outlined text-[18px]">chevron_right</span>
              </Link>
            )}
          </div>
        </div>

        {/* Financial Statistics */}
        <div className="col-span-12 lg:col-span-7 bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant flex flex-col">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-headline-md font-hanken text-primary">Statistik Keuangan</h3>
            <div className="flex gap-4">
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-secondary"></span><span className="text-label-sm">Income</span></div>
              <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-full bg-primary-container"></span><span className="text-label-sm">Loan</span></div>
            </div>
          </div>
          <div className="flex-1 flex items-end justify-between gap-2 h-64 px-2">
            {chartData.length > 0 ? (
              chartData.map((item, i) => {
                const incomeH = (Number(item.person_income) / maxVal) * 90 + 5
                const expenseH = (Number(item.loan_amnt) / maxVal) * 90 + 5
                const label = item.nama_usaha?.substring(0, 3) || `#${i + 1}`
                return (
                  <div key={item.id || i} className="flex flex-col items-center flex-1 h-full justify-end gap-1">
                    <div className="w-full flex gap-1 items-end h-full">
                      <div className="bg-secondary w-1/2 rounded-t transition-all hover:opacity-80" style={{height: `${incomeH}%`}}></div>
                      <div className="bg-primary-container w-1/2 rounded-t transition-all hover:opacity-80" style={{height: `${expenseH}%`}}></div>
                    </div>
                    <span className="text-label-sm mt-2 truncate w-full text-center" title={item.nama_usaha}>{label}</span>
                  </div>
                )
              })
            ) : (
              <div className="flex-1 flex items-center justify-center text-on-surface-variant">
                <p className="text-label-md">Data keuangan akan muncul setelah melakukan analisis</p>
              </div>
            )}
          </div>
        </div>

        {/* Recent Analysis History */}
        <div className="col-span-12 bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant overflow-hidden">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-md font-hanken text-primary">Riwayat Analisis Terbaru</h3>
            <Link to="/history" className="text-secondary text-label-md hover:underline">Lihat Semua</Link>
          </div>
          {recentHistory.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="bg-surface-container-low text-on-surface-variant text-label-sm">
                  <tr>
                    <th className="px-6 py-3">Nama Usaha</th>
                    <th className="px-6 py-3">Tanggal</th>
                    <th className="px-6 py-3">Pinjaman</th>
                    <th className="px-6 py-3">Skor</th>
                    <th className="px-6 py-3 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {recentHistory.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors cursor-pointer">
                      <td className="px-6 py-4 text-label-md">{item.nama_usaha || '-'}</td>
                      <td className="px-6 py-4 text-on-surface-variant">{formatDate(item.created_at)}</td>
                      <td className="px-6 py-4">{formatRupiah(item.loan_amnt)}</td>
                      <td className="px-6 py-4 font-bold text-secondary">{item.score ?? '-'}</td>
                      <td className="px-6 py-4 text-right"><StatusBadge status={item.status} /></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">history</span>
              <p className="text-label-md">Belum ada riwayat analisis</p>
              <Link to="/analysis" className="text-secondary text-label-sm hover:underline mt-2 inline-block">Mulai analisis pertama →</Link>
            </div>
          )}
        </div>

        {/* AI Insights */}
        <div className="col-span-12 lg:col-span-4 bg-primary-container p-6 rounded-xl text-on-primary relative overflow-hidden h-48 flex flex-col justify-end">
          <div className="absolute top-0 right-0 p-6 opacity-20">
            <span className="material-symbols-outlined text-[80px] filled">auto_awesome</span>
          </div>
          <h4 className="text-headline-md font-hanken mb-2">AI Insight</h4>
          <p className="text-on-primary-container text-label-md">
            {latestPrediction
              ? `Skor terakhir Anda: ${latestScore}. ${latestScore >= 700 ? 'Profil keuangan Anda sangat sehat. Pertimbangkan untuk ekspansi usaha.' : 'Pertimbangkan untuk meningkatkan rasio pendapatan terhadap pengeluaran.'}`
              : 'Lakukan analisis pertama untuk mendapatkan insight AI yang dipersonalisasi.'}
          </p>
        </div>

        {/* Market Trends */}
        <div className="col-span-12 lg:col-span-8 bg-surface-container-highest p-6 rounded-xl border border-outline-variant h-48 flex items-center gap-6">
          <div className="flex-1">
            <h4 className="text-headline-md font-hanken text-primary mb-2">Ringkasan</h4>
            <p className="text-on-surface-variant text-label-md">
              {history.length > 0
                ? `Anda telah melakukan ${history.length} analisis kredit. Rata-rata skor: ${Math.round(history.reduce((sum, h) => sum + (h.score || 0), 0) / history.length)}.`
                : 'Sektor Ritel di wilayah Anda sedang mengalami kenaikan permintaan musiman. Sangat baik untuk pengajuan kredit tambahan.'}
            </p>
          </div>
          <div className="w-1/3 h-full rounded-lg bg-surface-container-lowest border border-outline-variant flex items-center justify-center">
            <span className="material-symbols-outlined text-secondary text-[48px]">trending_up</span>
          </div>
        </div>
      </div>
      )}
    </DashboardLayout>
  )
}
