import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, TrendingUp, ChevronRight, AlertTriangle, MessageCircle } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { isUnderFiftyK } from '../utils/recommendations'
import { calculatePlanSavings } from '../utils/taxSavings'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import { STATE_FILING_FEES } from '../utils/stateFees'

const fmt = (n) => `$${n.toLocaleString()}`

// Format: "Service name (what it is) — value & benefit (what it does)"
const SHARED_FEATURES_EF = [
  { name: 'LLC Formation', detail: 'we file your business with the state and shield your personal assets from day one' },
  { name: 'Federal EIN', detail: "your business's IRS ID so you can open a business bank account and elect S-Corp" },
]
const SHARED_FEATURES = [
  { name: 'AI Bookkeeping with industry Chart of Accounts', detail: "every expense categorized correctly so you don't miss deductions" },
  { name: 'AI Business Tax Return (federal + state, e-filed)', detail: 'no preparer fees, no software to learn' },
  { name: 'Free Business Tax Extension', detail: "extra time to file when you need it, no penalties" },
  { name: 'Unlimited 1099 E-Filing', detail: 'bulk file contractor 1099s in minutes' },
  { name: 'Automated Monthly Financial Reports', detail: 'P&L, balance sheet, and cash flow updated automatically' },
]
// All in this list get ORANGE checkmarks — "what's new in Pro"
const PRO_ONLY_FEATURES = [
  { name: 'S-Corp Tax Election', detail: 'the single biggest tax-saving move — saves the average client $4,000+/yr in self-employment tax' },
  { name: 'On-Demand Tax Advisor', detail: 'chat anytime or schedule a video meeting with an expert to ask anything about your business' },
  { name: 'Expert review of every tax filing', detail: 'a tax pro signs off before you submit so nothing slips through' },
  { name: 'Payroll Setup & Guidance', detail: 'pay yourself the right way (required for S-Corp) and pay employees on time' },
]

function planName(level, industryId) {
  const ind = INDUSTRIES.find((i) => i.id === industryId)
  if (!ind || ind.id === 'other') return level === 'basic' ? 'Basic Plan' : 'Pro Plan'
  // Strip "& X" suffix and pluralization for a clean adjective
  const short = ind.label.split(/[&\/]/)[0].trim()
  return level === 'basic' ? `Basic ${short} Plan` : `Pro ${short} Plan`
}

function PriceBreakdown({ hasBusiness, filingFee, stateName, annual, recommended }) {
  return (
    <div className={`rounded-2xl border p-4 mb-5 ${recommended ? 'bg-[#F7941D]/5 border-[#F7941D]/30' : 'bg-gray-50 border-gray-200'}`}>
      {hasBusiness === false && (
        <div className="flex items-center justify-between pb-3 border-b border-gray-200/70 mb-3">
          <div>
            <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">Due Today</p>
            <p className="text-xs text-gray-500 mt-0.5">{stateName} state filing fee</p>
          </div>
          <p className="text-lg font-bold font-heading text-gray-900">${filingFee}</p>
        </div>
      )}
      <div className="flex items-center justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-wider font-bold text-gray-500">
            {hasBusiness === false ? 'In 14 days' : 'Total'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {hasBusiness === false ? 'After we file your business' : 'Billed annually'}
          </p>
        </div>
        <p className="text-2xl font-extrabold font-heading text-gray-900">${annual}</p>
      </div>
    </div>
  )
}

function FeatureRow({ name, detail, orange }) {
  return (
    <li className="flex items-start gap-3">
      <Check size={16} className={`shrink-0 mt-0.5 ${orange ? 'text-[#F7941D]' : 'text-[#10B981]'}`} />
      <div className="text-sm leading-snug">
        <span className={`font-semibold ${orange ? 'text-gray-900' : 'text-gray-900'}`}>{name}</span>
        <span className="text-gray-500"> — {detail}</span>
      </div>
    </li>
  )
}

function PlanCard({ level, hasBusiness, industryId, savings, filingFee, stateName, selected, onSelect }) {
  const isPro = level === 'pro'
  const annual = isPro ? 348 : 228
  const features = isPro
    ? [
        // Basic features first (green checkmarks) — "everything in basic"
        ...(hasBusiness === false ? SHARED_FEATURES_EF : []),
        ...SHARED_FEATURES,
        // Then pro-only (orange checkmarks) — "what's new in Pro"
        ...PRO_ONLY_FEATURES.map((f) => ({ ...f, orange: true })),
      ]
    : [
        ...(hasBusiness === false ? SHARED_FEATURES_EF : []),
        ...SHARED_FEATURES,
      ]

  return (
    <motion.button onClick={onSelect}
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      className={`relative rounded-3xl bg-white text-left transition-all w-full p-6 md:p-7 border-2
        ${selected
          ? 'border-[#F7941D] shadow-[0_0_40px_rgba(247,148,29,0.25)]'
          : 'border-gray-200 shadow-md hover:shadow-lg'}
      `}>
      {isPro && (
        <div className={`absolute -top-3.5 right-6 px-3 py-1 rounded-full text-[11px] font-bold text-white whitespace-nowrap bg-gradient-to-r from-[#F7941D] to-[#e07e0a] flex items-center gap-1`}>
          <Sparkles size={11} /> Recommended
        </div>
      )}

      {/* Selected radio indicator */}
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-xl font-bold font-heading text-gray-900">{planName(level, industryId)}</h3>
          <p className="text-sm text-gray-500 font-body mt-0.5">
            {isPro ? 'Everything in Basic — plus S-Corp election and an expert on call.' : 'Get incorporated, books done, taxes filed.'}
          </p>
        </div>
        <div className={`w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 ml-3 mt-1
          ${selected ? 'border-[#F7941D] bg-[#F7941D]' : 'border-gray-300 bg-white'}
        `}>
          {selected && <Check size={14} className="text-white" />}
        </div>
      </div>

      <PriceBreakdown hasBusiness={hasBusiness} filingFee={filingFee} stateName={stateName} annual={annual} recommended={isPro} />

      <ul className="space-y-2.5">
        {features.map((f, i) => (
          <FeatureRow key={i} name={f.name} detail={f.detail} orange={f.orange} />
        ))}
      </ul>

      {/* Savings strip */}
      <div className={`mt-5 rounded-xl p-3 flex items-center gap-2 ${isPro ? 'bg-[#10B981]/10' : 'bg-gray-50'}`}>
        <TrendingUp size={16} className={isPro ? 'text-[#10B981]' : 'text-gray-500'} />
        <span className={`text-xs font-medium ${isPro ? 'text-[#10B981]' : 'text-gray-600'}`}>
          Est. annual tax savings: <span className="font-bold">{fmt(savings.low)}–{fmt(savings.high)}</span>
        </span>
      </div>
    </motion.button>
  )
}

export default function Packages() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const hasBusiness = data.hasExistingBusiness
  const under = isUnderFiftyK(data.revenue)
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const filingFee = STATE_FILING_FEES[data.state] ?? 100

  // Pro is preselected by default
  const [selected, setSelected] = useState(data.selectedPlan === 'basic' ? 'basic' : 'pro')

  // Has-business + over-50K shouldn't be here — they go to /intake/schedule
  useEffect(() => {
    if (hasBusiness === true && data.revenue && !under) {
      nav('/intake/schedule', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const savings = useMemo(() => calculatePlanSavings({
    revenue: data.revenue, industry: data.industry,
    otherIndustry: data.otherIndustry, state: data.state,
  }), [data.revenue, data.industry, data.otherIndustry, data.state])

  useEffect(() => {
    update({ taxSavingsEstimate: savings, selectedPlan: selected === 'basic' ? 'basic' : 'pro' })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savings, selected])

  const handleContinue = () => {
    update({ selectedPlan: selected === 'basic' ? 'basic' : 'pro' })
    if (hasBusiness === false) {
      nav('/intake/business-name')
    } else {
      nav('/intake/checkout')
    }
  }

  const upsellDelta = savings.diwm.mid - savings.diy.mid

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> Matched to your business
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 mb-3 leading-tight">
            We work with thousands of {industryLabel.toLowerCase()} businesses in {stateName}.
          </h1>
          <p className="text-gray-500 font-body text-base md:text-lg max-w-2xl mx-auto">
            Pick the plan that's right for you. {hasBusiness === false && "We'll form your business as part of either plan — no extra cost."}
          </p>
        </motion.div>

        {/* Savings highlight */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#10B981] to-[#0e9d6c] rounded-2xl p-5 md:p-6 text-white shadow-lg mb-8 flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-white/15 flex items-center justify-center shrink-0">
            <TrendingUp size={22} />
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-wider font-bold text-white/80 mb-0.5">Your Estimated Tax Savings</p>
            <p className="text-xl md:text-2xl font-extrabold font-heading leading-tight">
              We can save you up to {fmt(savings.diwm.high)}/year in taxes.
            </p>
          </div>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <PlanCard level="basic" hasBusiness={hasBusiness} industryId={data.industry}
            savings={savings.diy} filingFee={filingFee} stateName={stateName}
            selected={selected === 'basic'} onSelect={() => setSelected('basic')} />
          <PlanCard level="pro" hasBusiness={hasBusiness} industryId={data.industry}
            savings={savings.diwm} filingFee={filingFee} stateName={stateName}
            selected={selected === 'pro'} onSelect={() => setSelected('pro')} />
        </div>

        {/* Warning if Basic selected */}
        <AnimatePresence>
          {selected === 'basic' && (
            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              className="bg-amber-50 border border-amber-200 rounded-2xl p-4 md:p-5 mb-6 flex items-start gap-3">
              <AlertTriangle size={20} className="text-amber-500 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-amber-900 mb-0.5">You're leaving up to {fmt(upsellDelta)} in tax savings on the table.</p>
                <p className="text-sm text-amber-800 font-body leading-relaxed">
                  The S-Corp election alone saves our average client over $4,000/year. Pro includes that — plus a tax expert you can chat with anytime.
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue */}
        <div className="text-center">
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={handleContinue}
            className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 px-10 md:px-16 rounded-full transition-all cursor-pointer text-lg inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(247,148,29,0.4)]">
            Continue with {selected === 'pro' ? 'Pro' : 'Basic'} <ChevronRight size={18} />
          </motion.button>
          <p className="text-xs text-gray-400 mt-3 font-body">30-day money-back guarantee · Cancel anytime</p>
        </div>
      </div>
    </div>
  )
}
