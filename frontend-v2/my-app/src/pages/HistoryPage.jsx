import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'
import { predictApi } from '../api'
import { formatDate } from '../utils/helpers.js'

export default function HistoryPage() {
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState('All Status')

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

  // Filter
  const filtered = statusFilter === 'All Status'
    ? history
    : history.filter(h => {
        const s = h.status?.toLowerCase()
        const f = statusFilter.toLowerCase()
        if (f === 'eligible') return s === 'layak' || s === 'eligible'
        if (f === 'risky') return s === 'berisiko' || s === 'risky'
        return s === f
      })

  // Stats
  const totalAnalyzed = history.length
  const avgScore = totalAnalyzed > 0
    ? Math.round(history.reduce((sum, h) => sum + (h.score || 0), 0) / totalAnalyzed)
    : 0
  const eligibleCount = history.filter(h => {
    const s = h.status?.toLowerCase()
    return s === 'layak' || s === 'eligible'
  }).length
  const eligibilityRate = totalAnalyzed > 0
    ? ((eligibleCount / totalAnalyzed) * 100).toFixed(1)
    : '0.0'

  return (
    <DashboardLayout title="Analysis History">
      {loading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin w-8 h-8 border-4 border-secondary border-t-transparent rounded-full"></div>
        </div>
      ) : (
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Total Analyzed</p>
            <h3 className="text-headline-md font-hanken text-primary">{totalAnalyzed}</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">Semua prediksi Anda</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Avg. Credit Score</p>
            <h3 className="text-headline-md font-hanken text-secondary">{avgScore || '-'}</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">{avgScore >= 700 ? 'Institutional Grade' : avgScore >= 500 ? 'Standard Grade' : 'Needs Improvement'}</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Eligibility Rate</p>
            <h3 className="text-headline-md font-hanken text-primary">{eligibilityRate}%</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">{eligibleCount} dari {totalAnalyzed} layak</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-1 focus:ring-secondary">
              <option>All Status</option>
              <option>Eligible</option>
              <option>Risky</option>
            </select>
          </div>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          {filtered.length > 0 ? (
            <>
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-surface-container-low border-b border-outline-variant">
                    <th className="py-3 px-6 text-label-md text-on-surface-variant">Nama Usaha</th>
                    <th className="py-3 px-6 text-label-md text-on-surface-variant">Tanggal</th>
                    <th className="py-3 px-6 text-label-md text-on-surface-variant text-center">Score</th>
                    <th className="py-3 px-6 text-label-md text-on-surface-variant">Status</th>
                    <th className="py-3 px-6 text-label-md text-on-surface-variant text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant/30">
                  {filtered.map((item) => (
                    <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                      <td className="py-4 px-6"><span className="text-label-md text-on-surface">{item.nama_usaha || '-'}</span></td>
                      <td className="py-4 px-6"><span className="text-body-md text-on-surface-variant">{formatDate(item.created_at)}</span></td>
                      <td className="py-4 px-6 text-center">
                        {item.score != null ? (
                          <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-label-md ${item.score >= 600 ? 'border-secondary/20 text-secondary' : 'border-error/20 text-error'}`}>
                            {item.score}
                          </span>
                        ) : (
                          <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-outline/20 text-on-surface-variant font-bold text-[10px]">N/A</span>
                        )}
                      </td>
                      <td className="py-4 px-6"><StatusBadge status={item.status} /></td>
                      <td className="py-4 px-6 text-right">
                        <Link to={`/result/${item.id}`} className="text-secondary text-label-md hover:underline inline-flex items-center gap-1">
                          Details <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {/* Pagination info */}
              <div className="px-6 py-3 flex justify-between items-center bg-surface-container-low">
                <p className="text-label-sm text-on-surface-variant">Menampilkan {filtered.length} dari {history.length} hasil</p>
              </div>
            </>
          ) : (
            <div className="p-12 text-center text-on-surface-variant">
              <span className="material-symbols-outlined text-[48px] mb-2 block opacity-30">history</span>
              <p className="text-label-md mb-2">{history.length === 0 ? 'Belum ada riwayat analisis' : 'Tidak ada hasil dengan filter ini'}</p>
              {history.length === 0 && (
                <Link to="/analysis" className="text-secondary text-label-sm hover:underline">Mulai analisis pertama →</Link>
              )}
            </div>
          )}
        </div>
      </div>
      )}
    </DashboardLayout>
  )
}
