// Industry-specific commonly-missed deduction estimates (annual $)
const INDUSTRY_DEDUCTIONS = {
  ecommerce:      { low: 2000, high: 4000, examples: ['inventory/COGS reclassification', 'home office', 'shipping & merchant fees'] },
  food:           { low: 3000, high: 5000, examples: ['food cost write-offs', 'equipment depreciation', 'employee meals'] },
  technology:     { low: 2500, high: 4500, examples: ['home office', 'software subscriptions', 'R&D expenses'] },
  construction:   { low: 3500, high: 6000, examples: ['tools & equipment', 'vehicle expenses', 'job-site materials'] },
  healthcare:     { low: 2000, high: 3500, examples: ['continuing education', 'license fees', 'medical equipment'] },
  creative:       { low: 2000, high: 3500, examples: ['home office', 'equipment', 'software & subscriptions'] },
  transportation: { low: 5000, high: 8000, examples: ['vehicle depreciation', 'fuel & maintenance', 'per-diem meals'] },
  realestate:     { low: 3000, high: 6000, examples: ['property depreciation', 'mileage', 'marketing & MLS fees'] },
  consulting:     { low: 2000, high: 3500, examples: ['home office', 'software & subscriptions', 'continuing education'] },
}

// Approx top marginal state income tax rates (close enough for an estimate)
const STATE_TAX_RATES = {
  AL: 0.05, AK: 0, AZ: 0.025, AR: 0.044, CA: 0.093, CO: 0.044, CT: 0.0699, DE: 0.066,
  DC: 0.0875, FL: 0, GA: 0.0549, HI: 0.082, ID: 0.058, IL: 0.0495, IN: 0.0305, IA: 0.057,
  KS: 0.057, KY: 0.04, LA: 0.0425, ME: 0.0715, MD: 0.0575, MA: 0.05, MI: 0.0425, MN: 0.0785,
  MS: 0.05, MO: 0.0495, MT: 0.059, NE: 0.0584, NV: 0, NH: 0, NJ: 0.0637, NM: 0.049,
  NY: 0.0685, NC: 0.045, ND: 0.0204, OH: 0.035, OK: 0.0475, OR: 0.0875, PA: 0.0307,
  RI: 0.0599, SC: 0.064, SD: 0, TN: 0, TX: 0, UT: 0.0485, VT: 0.066, VA: 0.0575,
  WA: 0, WV: 0.0482, WI: 0.0535, WY: 0,
}

// Estimated revenue midpoint (under-$50k path)
const REVENUE_ESTIMATE_UNDER = 40000

const FEDERAL_RATE = 0.22
const SE_TAX_RATE = 0.153

export function calculateSavings({ revenue, industry, otherIndustry, state }) {
  const estRevenue = REVENUE_ESTIMATE_UNDER
  const stateRate = STATE_TAX_RATES[state] ?? 0.05

  // Industry deductions — fall back if industry not in map (e.g. user typed "Other")
  const ded = INDUSTRY_DEDUCTIONS[industry] || {
    low: 2000, high: 4000,
    examples: ['home office', 'business expenses', 'mileage & travel'],
  }

  // Federal + state savings on recaptured deductions
  const dedTaxLow = Math.round(ded.low * (FEDERAL_RATE + stateRate))
  const dedTaxHigh = Math.round(ded.high * (FEDERAL_RATE + stateRate))

  // S-Corp election savings (~40% income as distributions, save SE tax, 0.7 haircut for reasonable salary)
  const distributionPortion = 0.4
  const sCorpRaw = Math.round(estRevenue * distributionPortion * SE_TAX_RATE * 0.7)
  const sCorpLow = sCorpRaw
  const sCorpHigh = Math.round(sCorpRaw * 1.4)

  // Quarterly tax planning / penalty avoidance
  const planLow = 300
  const planHigh = 600

  return {
    totalLow: dedTaxLow + sCorpLow + planLow,
    totalHigh: dedTaxHigh + sCorpHigh + planHigh,
    breakdown: [
      {
        title: 'Industry-specific deductions',
        low: dedTaxLow, high: dedTaxHigh,
        detail: `Common write-offs for ${industry === 'other' ? (otherIndustry || 'small business') : industry} businesses: ${ded.examples.join(', ')}.`,
      },
      {
        title: 'S-Corp election (self-employment tax)',
        low: sCorpLow, high: sCorpHigh,
        detail: 'Electing S-Corporation status lets you split income between salary and distributions, avoiding the 15.3% self-employment tax on the distribution portion.',
      },
      {
        title: 'State tax optimization & quarterly planning',
        low: planLow, high: planHigh,
        detail: 'Proactive quarterly estimates avoid IRS underpayment penalties and surface state-specific credits.',
      },
    ],
  }
}
