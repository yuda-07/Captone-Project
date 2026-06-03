import { useState } from 'react'
import DashboardLayout from '../components/layout/DashboardLayout.jsx'
import StatusBadge from '../components/ui/StatusBadge.jsx'

const mockHistory = [
  { id: '#MC-89210', date: 'Oct 24, 2024', entity: 'AgroConnect Logistics', score: 785, status: 'Eligible' },
  { id: '#MC-89195', date: 'Oct 22, 2024', entity: 'Urban Spice Cafe', score: 410, status: 'Risky' },
  { id: '#MC-89144', date: 'Oct 21, 2024', entity: 'Handicraft Collective', score: 655, status: 'Eligible' },
  { id: '#MC-89021', date: 'Oct 19, 2024', entity: 'TechFix Solutions', score: null, status: 'Pending' },
]

export default function HistoryPage() {
  const [statusFilter, setStatusFilter] = useState('All Status')

  const filtered = statusFilter === 'All Status'
    ? mockHistory
    : mockHistory.filter(h => h.status === statusFilter)

  return (
    <DashboardLayout title="Analysis History">
      <div className="space-y-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Total Analyzed</p>
            <h3 className="text-headline-md font-hanken text-primary">128</h3>
            <p className="text-label-sm text-secondary mt-1">+12% from last month</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Avg. Credit Score</p>
            <h3 className="text-headline-md font-hanken text-secondary">742</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">Institutional Grade</p>
          </div>
          <div className="bg-surface-container-lowest p-6 rounded-xl shadow-sm border border-outline-variant/30">
            <p className="text-label-sm text-outline uppercase tracking-wider mb-2">Eligibility Rate</p>
            <h3 className="text-headline-md font-hanken text-primary">84.5%</h3>
            <p className="text-label-sm text-on-surface-variant mt-1">High conversion</p>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex items-center gap-2">
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-surface-container-low border-none rounded-lg text-label-md py-2 px-4 focus:ring-1 focus:ring-secondary">
              <option>All Status</option>
              <option>Eligible</option>
              <option>Risky</option>
              <option>Pending</option>
            </select>
          </div>
          <button className="text-secondary text-label-md flex items-center gap-2">
            <span className="material-symbols-outlined">download</span> Export CSV
          </button>
        </div>

        {/* Table */}
        <div className="bg-surface-container-lowest rounded-xl shadow-sm border border-outline-variant/30 overflow-hidden">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-surface-container-low border-b border-outline-variant">
                <th className="py-3 px-6 text-label-md text-on-surface-variant">Analysis ID</th>
                <th className="py-3 px-6 text-label-md text-on-surface-variant">Date</th>
                <th className="py-3 px-6 text-label-md text-on-surface-variant">Entity Name</th>
                <th className="py-3 px-6 text-label-md text-on-surface-variant text-center">Score</th>
                <th className="py-3 px-6 text-label-md text-on-surface-variant">Status</th>
                <th className="py-3 px-6 text-label-md text-on-surface-variant text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-outline-variant/30">
              {filtered.map((item) => (
                <tr key={item.id} className="hover:bg-surface-container-low transition-colors">
                  <td className="py-4 px-6"><span className="text-label-md text-primary">{item.id}</span></td>
                  <td className="py-4 px-6"><span className="text-body-md text-on-surface-variant">{item.date}</span></td>
                  <td className="py-4 px-6"><span className="text-label-md text-on-surface">{item.entity}</span></td>
                  <td className="py-4 px-6 text-center">
                    {item.score ? (
                      <span className={`inline-flex items-center justify-center w-12 h-12 rounded-full border-4 font-bold text-label-md ${item.score >= 600 ? 'border-secondary/20 text-secondary' : 'border-error/20 text-error'}`}>
                        {item.score}
                      </span>
                    ) : (
                      <span className="inline-flex items-center justify-center w-12 h-12 rounded-full border-4 border-outline/20 text-on-surface-variant font-bold text-[10px]">N/A</span>
                    )}
                  </td>
                  <td className="py-4 px-6"><StatusBadge status={item.status} /></td>
                  <td className="py-4 px-6 text-right">
                    <button className="text-secondary text-label-md hover:underline inline-flex items-center gap-1">
                      Details <span className="material-symbols-outlined text-[18px]">chevron_right</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Pagination */}
          <div className="px-6 py-3 flex justify-between items-center bg-surface-container-low">
            <p className="text-label-sm text-on-surface-variant">Showing 1-{filtered.length} of {filtered.length} results</p>
            <div className="flex items-center gap-2">
              <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined">chevron_left</span>
              </button>
              <button className="w-8 h-8 rounded bg-secondary text-on-secondary text-label-md">1</button>
              <button className="w-8 h-8 rounded flex items-center justify-center text-outline hover:bg-surface-container-highest transition-all">
                <span className="material-symbols-outlined">chevron_right</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
