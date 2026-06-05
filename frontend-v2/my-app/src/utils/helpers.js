/**
 * Format number to Indonesian Rupiah currency
 */
export function formatRupiah(number) {
  if (!number && number !== 0) return 'Rp 0'
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(number)
}

/**
 * Format date to Indonesian locale
 */
export function formatDate(dateString) {
  if (!dateString) return '-'
  return new Date(dateString).toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/**
 * Get status color classes based on credit status
 */
export function getStatusClasses(status) {
  switch (status?.toLowerCase()) {
    case 'layak':
    case 'eligible':
    case 'approved':
      return 'bg-secondary-fixed text-on-secondary-fixed'
    case 'berisiko':
    case 'risky':
    case 'rejected':
      return 'bg-error-container text-on-error-container'
    case 'pending':
    case 'review':
      return 'bg-surface-container-highest text-on-surface-variant'
    default:
      return 'bg-surface-container-highest text-on-surface-variant'
  }
}

/**
 * Get score color
 */
export function getScoreColor(score) {
  if (score >= 700) return 'text-secondary'
  if (score >= 500) return 'text-yellow-600'
  return 'text-error'
}
