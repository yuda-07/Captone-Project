export default function StatusBadge({ status }) {
  const config = {
    layak: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed', dot: 'bg-secondary', label: 'Layak' },
    eligible: { bg: 'bg-secondary-fixed', text: 'text-on-secondary-fixed', dot: 'bg-secondary', label: 'Eligible' },
    approved: { bg: 'bg-green-100', text: 'text-green-800', dot: 'bg-green-600', label: 'Approved' },
    berisiko: { bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error', label: 'Berisiko' },
    risky: { bg: 'bg-error-container', text: 'text-on-error-container', dot: 'bg-error', label: 'Risky' },
    pending: { bg: 'bg-surface-container-highest', text: 'text-on-surface-variant', dot: 'bg-outline', label: 'Pending' },
    review: { bg: 'bg-yellow-100', text: 'text-yellow-800', dot: 'bg-yellow-600', label: 'Review' },
  }

  const statusKey = status?.toLowerCase() || 'pending'
  const c = config[statusKey] || config.pending

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full ${c.bg} ${c.text} text-label-sm`}>
      <span className={`w-2 h-2 rounded-full ${c.dot} mr-2`}></span>
      {c.label}
    </span>
  )
}
