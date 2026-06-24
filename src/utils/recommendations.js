export function getRecommendedPlan(revenue) {
  switch (revenue) {
    case '0-10k':
    case '10k-50k':  return 'pro'
    case '50k-100k':
    case '100k+':    return 'pro'
    default:         return 'pro'
  }
}

export function getRevenueLabel(revenue) {
  const map = {
    '0-10k':    '$0–$10K',
    '10k-50k':  '$10K–$50K',
    '50k-100k': '$50K–$100K',
    '100k+':    '$100K+',
  }
  return map[revenue] || revenue
}

// Under-threshold = $0-$10K and $10K-$50K. Used to route has-business users:
// under threshold → packages, over threshold → consultation.
// (For no-business users, ALL revenue brackets route to packages.)
export function isUnderFiftyK(revenue) {
  return revenue === '0-10k' || revenue === '10k-50k'
}
