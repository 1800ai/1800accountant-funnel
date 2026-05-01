export function getRecommendedPlan(revenue) {
  switch (revenue) {
    case '<50k': return 'pro'        // DIWM is most chosen for under-50k
    case '50k-150k': return 'core'   // Core Accounting
    case '150k-500k':
    case '500k+': return 'complete'  // Business Complete (core + bookkeeping + payroll)
    default: return 'pro'
  }
}

export function getRevenueLabel(revenue) {
  const map = {
    '<50k': 'under $50K',
    '50k-150k': '$50K–$150K',
    '150k-500k': '$150K–$500K',
    '500k+': '$500K+',
  }
  return map[revenue] || revenue
}

export function isUnderFiftyK(revenue) {
  return revenue === '<50k'
}
