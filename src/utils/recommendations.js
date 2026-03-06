export function getRecommendedPlan(revenue) {
  switch (revenue) {
    case '<50k': return 'basic'
    case '50k-150k': return 'pro'
    case '150k-500k':
    case '500k+': return 'premium'
    default: return 'pro'
  }
}

export function getRevenueLabel(revenue) {
  const map = { '<50k': 'under $50K', '50k-150k': '$50K\u2013$150K', '150k-500k': '$150K\u2013$500K', '500k+': '$500K+' }
  return map[revenue] || revenue
}
