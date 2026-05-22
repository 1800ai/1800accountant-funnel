import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Sparkles, TrendingUp, Receipt, MapPin, Briefcase } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { calculateSavings } from '../utils/taxSavings'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'

const PLAN_NAMES = { basic: 'Do-It-Yourself', pro: 'Do-It-With-Me' }
const PLAN_PRICES = { basic: 19, pro: 29 }
const ICON_MAP = { 'Industry-specific deductions': Receipt, 'S-Corp election (self-employment tax)': Briefcase, 'State tax optimization & quarterly planning': MapPin }

export default function TaxSavings() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [revealed, setRevealed] = useState(false)

  const result = useMemo(() => calculateSavings({
    revenue: data.revenue,
    industry: data.industry,
    otherIndustry: data.otherIndustry,
    state: data.state,
  }), [data.revenue, data.industry, data.otherIndustry, data.state])

  useEffect(() => {
    update({ taxSavingsEstimate: result })
    const t = setTimeout(() => setRevealed(true), 600)
    return () => clearTimeout(t)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fmt = (n) => `$${n.toLocaleString()}`
  const planLabel = PLAN_NAMES[data.selectedPlan] || 'your selected plan'
  const planPrice = PLAN_PRICES[data.selectedPlan] || 29
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your business')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your business')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <button onClick={() => nav('/your-plan')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back to plans
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> Personalized Estimate
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3">
            Here's what you're likely leaving on the table.
          </h1>
          <p className="text-gray-500 font-body">
            Based on your <span className="text-gray-700 font-medium">{industryLabel}</span> business in <span className="text-gray-700 font-medium">{stateName}</span>.
          </p>
        </motion.div>

        {/* Big number */}
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl p-8 lg:p-10 text-center mb-6 shadow-lg border-2 border-[#F7941D]/30">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-medium mb-3">Estimated Annual Tax Savings</p>
          <div className="text-5xl md:text-6xl font-extrabold font-heading text-gray-900 mb-2">
            {revealed ? (
              <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6 }}>
                {fmt(result.totalLow)}
                <span className="text-gray-300 mx-2">–</span>
                {fmt(result.totalHigh)}
              </motion.span>
            ) : (
              <span className="text-gray-300">Calculating...</span>
            )}
          </div>
          <p className="text-sm text-gray-500 mt-3 font-body">
            Independent estimate based on industry data, your state's tax code, and current IRS rules.
          </p>
        </motion.div>

        {/* Breakdown */}
        <div className="space-y-3 mb-8">
          {result.breakdown.map((b, i) => {
            const Icon = ICON_MAP[b.title] || Receipt
            return (
              <motion.div key={b.title}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }}
                transition={{ delay: 0.3 + i * 0.1 }}
                className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center shrink-0">
                    <Icon size={20} className="text-[#F7941D]" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-gray-900 font-semibold font-heading">{b.title}</h3>
                      <span className="text-[#10B981] font-bold whitespace-nowrap">{fmt(b.low)}–{fmt(b.high)}</span>
                    </div>
                    <p className="text-sm text-gray-500 font-body">{b.detail}</p>
                  </div>
                </div>
              </motion.div>
            )
          })}
        </div>

        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: revealed ? 1 : 0, y: revealed ? 0 : 10 }} transition={{ delay: 0.7 }}
          className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-2xl p-6 mb-6">
          <div className="flex items-start gap-3">
            <TrendingUp size={20} className="text-[#10B981] shrink-0 mt-0.5" />
            <div>
              <h3 className="text-gray-900 font-semibold font-heading mb-1">Your {planLabel} subscription pays for itself.</h3>
              <p className="text-sm text-gray-600 font-body">
                ${planPrice}/mo × 12 = ${planPrice * 12}/year — a small fraction of what you stand to save. Most clients capture this within their first year.
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: revealed ? 1 : 0 }} transition={{ delay: 0.9 }} className="text-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => nav('/checkout')}
            className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 px-12 rounded-full transition-all cursor-pointer text-lg inline-flex items-center gap-2">
            Continue to Checkout <ArrowRight size={18} />
          </motion.button>
          <p className="text-xs text-gray-400 mt-4 font-body">
            Estimate is for informational purposes. Actual savings depend on your full financial picture and will be confirmed by your dedicated accountant.
          </p>
        </motion.div>
      </div>
    </div>
  )
}
