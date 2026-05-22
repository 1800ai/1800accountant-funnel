import { useEffect, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Sparkles, TrendingUp, Star, ArrowRight, MessageCircle } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { isUnderFiftyK } from '../utils/recommendations'
import { calculatePlanSavings } from '../utils/taxSavings'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'

const PLAN_LIB = {
  basic: {
    id: 'basic', name: 'Do-It-Yourself', price: 19, annualPrice: '228',
    blurb: 'A complete tax & bookkeeping system that runs itself.',
    features: [
      'Industry-tailored Chart of Accounts',
      'AI Bookkeeping with auto-categorization & receipt capture',
      'Automated Monthly Financial Reports (P&L, Balance Sheet, Cash Flow)',
      'AI-Powered Business Tax Return — federal + state, e-filed for you',
      'Business Tax Extension (filed for you)',
      'Unlimited 1099 Generation & E-Filing',
      'Mileage Tracking',
      'Email + Chat Support',
    ],
  },
  pro: {
    id: 'pro', name: 'Do-It-With-Me', price: 29, annualPrice: '348',
    blurb: 'Everything in Do-It-Yourself, plus a CPA on call to maximize your savings.',
    features: [
      'Everything in Do-It-Yourself',
      'On-Demand Tax Expert — chat or call a CPA whenever you need',
      'Personal Tax Return (federal + state)',
      'Quarterly Estimated Tax Compliance',
      'CPA Review of every Tax Filing before submission',
      'Quarterly Strategy Check-ins',
      'Payroll Setup & Best-Practice Guidance',
      'Tax Hotline (priority phone access)',
    ],
    headlineFeature: 'On-Demand Tax Expert',
  },
}

const fmt = (n) => `$${n.toLocaleString()}`

function SavingsBanner({ savings, hasBusiness }) {
  if (!savings) return null
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-br from-[#10B981] to-[#0e9d6c] rounded-3xl p-6 md:p-8 text-white shadow-xl mb-8">
      <div className="flex items-center gap-2 mb-2">
        <Sparkles size={16} />
        <span className="text-xs uppercase tracking-wider font-bold">Your Estimated Tax Savings</span>
      </div>
      <p className="text-3xl md:text-4xl font-extrabold font-heading mb-2 leading-tight">
        We can save you up to {fmt(savings.diwm.high)}/year in taxes.
      </p>
      <p className="text-white/90 font-body text-sm md:text-base max-w-xl">
        {hasBusiness === false
          ? 'After we form your business, here\'s what we can capture for you.'
          : 'Based on your industry, state, and revenue stage — the deductions and strategies most owners like you miss.'}
      </p>
    </motion.div>
  )
}

function PlanCard({ plan, savings, recommended, onSelect, comparisonLabel }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay: recommended ? 0.1 : 0 }}
      whileHover={{ y: -4 }}
      className={`relative rounded-3xl bg-white flex flex-col transition-all
        ${recommended
          ? 'border-2 border-[#F7941D] shadow-[0_0_40px_rgba(247,148,29,0.25)] scale-[1.02]'
          : 'border border-gray-200 shadow-lg hover:shadow-xl'}
      `}>
      {recommended && (
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap bg-gradient-to-r from-[#F7941D] to-[#e07e0a] flex items-center gap-1">
          <Sparkles size={11} /> Recommended for your savings
        </div>
      )}

      <div className="p-6 md:p-8 flex flex-col flex-1">
        <h3 className="text-xl font-bold font-heading text-gray-900 mb-1">{plan.name}</h3>
        <p className="text-sm text-gray-500 font-body mb-5">{plan.blurb}</p>

        <div className="mb-5">
          <div className="flex items-baseline gap-1">
            <span className="text-4xl font-extrabold font-heading text-gray-900">${plan.price}</span>
            <span className="text-gray-400 font-medium">/mo</span>
          </div>
          <p className="text-xs text-gray-400 mt-0.5">${plan.annualPrice} billed annually</p>
        </div>

        {/* Savings card — the actual sell */}
        <div className={`rounded-2xl p-4 mb-5 ${recommended ? 'bg-[#10B981]/10 border border-[#10B981]/30' : 'bg-gray-50 border border-gray-200'}`}>
          <div className="flex items-center gap-2 mb-1">
            <TrendingUp size={14} className={recommended ? 'text-[#10B981]' : 'text-gray-500'} />
            <span className={`text-[11px] uppercase tracking-wider font-bold ${recommended ? 'text-[#10B981]' : 'text-gray-500'}`}>
              Est. Annual Tax Savings
            </span>
          </div>
          <p className={`text-2xl font-extrabold font-heading ${recommended ? 'text-[#10B981]' : 'text-gray-900'}`}>
            {fmt(savings.low)}<span className="text-gray-400 font-medium mx-1">–</span>{fmt(savings.high)}
          </p>
          {comparisonLabel && (
            <p className={`text-xs mt-1 font-medium ${recommended ? 'text-[#10B981]' : 'text-gray-500'}`}>
              {comparisonLabel}
            </p>
          )}
        </div>

        {plan.headlineFeature && (
          <div className="bg-[#F7941D]/10 border border-[#F7941D]/30 rounded-xl px-4 py-2.5 mb-4">
            <p className="text-sm font-bold text-[#F7941D] flex items-center gap-2">
              <MessageCircle size={14} /> {plan.headlineFeature}
            </p>
          </div>
        )}

        <ul className="space-y-3 mb-6 flex-1">
          {plan.features.map((f, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check size={16} className="text-[#10B981] shrink-0 mt-0.5" />
              <span className="text-sm text-gray-700 font-body">{f}</span>
            </li>
          ))}
        </ul>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onSelect}
          className={`w-full py-4 rounded-full font-semibold text-sm transition-all cursor-pointer flex items-center justify-center gap-2
            ${recommended
              ? 'bg-[#F7941D] hover:bg-[#e07e0a] text-white shadow-[0_4px_20px_rgba(247,148,29,0.4)]'
              : 'bg-[#1a1a2e] hover:bg-[#2d2d44] text-white'}
          `}>
          Lock in {fmt(savings.mid)} in savings <ArrowRight size={16} />
        </motion.button>
      </div>
    </motion.div>
  )
}

export default function YourPlan() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const hasBusiness = data.hasExistingBusiness
  const under = isUnderFiftyK(data.revenue)
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'

  // Defensive: has-business + over-$50K shouldn't be here
  useEffect(() => {
    if (hasBusiness === true && data.revenue && !under) {
      nav('/schedule', { replace: true })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const savings = useMemo(() => calculatePlanSavings({
    revenue: data.revenue, industry: data.industry,
    otherIndustry: data.otherIndustry, state: data.state,
  }), [data.revenue, data.industry, data.otherIndustry, data.state])

  // Save the recommended-plan estimate to context so /checkout can show it
  useEffect(() => {
    update({ taxSavingsEstimate: savings })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [savings])

  const handleSelect = (planId) => {
    update({ selectedPlan: planId })
    if (hasBusiness) {
      // Under-$50K + has business → straight to checkout
      nav('/checkout')
    } else {
      // No business → entity formation flow
      nav('/entity-type')
    }
  }

  const upsellDelta = savings.diwm.mid - savings.diy.mid

  const plans = [PLAN_LIB.basic, PLAN_LIB.pro].map((p) => hasBusiness === false ? {
    ...p,
    name: `${p.name} + Free Entity Formation`,
    features: ['FREE Business Entity Formation', 'FREE EIN Filing', ...p.features],
  } : p)

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        {/* Top: who we matched them with */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> Matched to your business
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold font-heading text-gray-900 mb-3 leading-tight">
            We work with thousands of {industryLabel.toLowerCase()} businesses in {stateName}.
          </h1>
          <p className="text-gray-500 font-body text-base md:text-lg max-w-2xl mx-auto">
            Here's what we estimate we can save you, and the plan that gets you there. {hasBusiness === false && 'We\'ll form your business for free as part of either plan.'}
          </p>
        </motion.div>

        {/* Big savings number */}
        <SavingsBanner savings={savings} hasBusiness={hasBusiness} />

        {/* Two-plan comparison */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <PlanCard plan={plans[0]} savings={savings.diy}
            recommended={false}
            onSelect={() => handleSelect('basic')} />
          <PlanCard plan={plans[1]} savings={savings.diwm}
            recommended={true}
            comparisonLabel={`That's ${fmt(upsellDelta)} more than DIY — your CPA pays for themselves many times over.`}
            onSelect={() => handleSelect('pro')} />
        </div>

        {/* Trust strip */}
        <div className="text-center mt-12">
          <div className="flex flex-wrap justify-center items-center gap-6 text-xs text-gray-400 font-body">
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#F7941D]">{[...Array(5)].map((_, i) => <Star key={i} size={12} fill="currentColor" />)}</div>
              <span>4.8/5 on Trustpilot</span>
            </div>
            <span>·</span>
            <span>50,000+ small businesses</span>
            <span>·</span>
            <span>30-day money-back guarantee</span>
          </div>
        </div>
      </div>
    </div>
  )
}
