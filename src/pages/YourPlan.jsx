import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Sparkles, TrendingUp, AlertTriangle, MessageCircle, ArrowRight, Star } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { isUnderFiftyK } from '../utils/recommendations'
import { calculatePlanSavings } from '../utils/taxSavings'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import { getStateFilingFee } from '../utils/stateFees'

const fmt = (n) => `$${n.toLocaleString()}`

// Feature lists vary by path. Has-business users skip the LLC/EIN items.
function getFeatures(hasBusiness) {
  if (hasBusiness === false) {
    return {
      basic: [
        { label: 'LLC Formation' },
        { label: 'Federal EIN' },
        { label: 'AI Bookkeeping' },
        { label: 'Business Tax Return (filed for you)' },
        { label: 'Free Tax Extension' },
        { label: 'Unlimited 1099 Filings' },
      ],
      pro: [
        { label: 'Everything in Basic' },
        { label: 'S-Corp Tax Election', highlight: true, note: 'Saves the average client $4,000+/yr' },
        { label: 'On-Demand Tax Expert', highlight: true, note: 'Chat or schedule a video meeting whenever you need' },
        { label: 'Expert review of every tax filing' },
        { label: 'Payroll Setup' },
      ],
    }
  }
  return {
    basic: [
      { label: 'AI Bookkeeping' },
      { label: 'Business Tax Return (filed for you)' },
      { label: 'Free Tax Extension' },
      { label: 'Unlimited 1099 Filings' },
    ],
    pro: [
      { label: 'Everything in Basic' },
      { label: 'S-Corp Tax Election', highlight: true, note: 'Saves the average client $4,000+/yr' },
      { label: 'On-Demand Tax Expert', highlight: true, note: 'Chat or schedule a video meeting whenever you need' },
      { label: 'Expert review of every tax filing' },
      { label: 'Payroll Setup' },
    ],
  }
}

function PriceBreakdown({ stateName, stateFee, annualPrice, showStateFee }) {
  return (
    <div className="rounded-2xl bg-gray-50 border border-gray-200 p-4 space-y-3">
      {showStateFee && (
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Due Today</p>
            <p className="text-xs text-gray-500 mt-0.5">{stateName} state filing fee</p>
          </div>
          <span className="font-bold text-gray-900 font-heading whitespace-nowrap">{fmt(stateFee)}</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-gray-400">
            {showStateFee ? 'In 14 Days' : 'Annual Plan'}
          </p>
          <p className="text-xs text-gray-500 mt-0.5">
            {showStateFee ? 'After we file your business' : 'Billed annually, cancel anytime'}
          </p>
        </div>
        <span className="font-bold text-gray-900 font-heading whitespace-nowrap">{fmt(annualPrice)}</span>
      </div>
    </div>
  )
}

function PlanCard({ tier, name, blurb, annualPrice, stateName, stateFee, showStateFee, features, selected, recommended, onSelect, savings }) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileTap={{ scale: 0.995 }}
      initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, delay: recommended ? 0.05 : 0 }}
      className={`relative w-full text-left rounded-3xl bg-white flex flex-col transition-all overflow-hidden border-2
        ${selected
          ? 'border-[#F7941D] shadow-[0_8px_40px_rgba(247,148,29,0.18)]'
          : 'border-gray-200 hover:border-gray-300 shadow-sm hover:shadow-md'}
      `}>
      {recommended && (
        <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl text-[11px] font-bold text-white bg-gradient-to-r from-[#F7941D] to-[#e07e0a] flex items-center gap-1">
          <Sparkles size={11} /> Recommended
        </div>
      )}

      <div className="p-6 flex flex-col flex-1">
        {/* Selected indicator */}
        <div className="flex items-center justify-between mb-1">
          <h3 className="text-lg font-bold font-heading text-gray-900">{name}</h3>
          <div className={`w-5 h-5 rounded-full border-2 transition-all shrink-0 ml-3
            ${selected ? 'border-[#F7941D] bg-[#F7941D]' : 'border-gray-300'}
          `}>
            {selected && <Check size={12} strokeWidth={3} className="text-white m-auto block mt-0.5" />}
          </div>
        </div>
        <p className="text-xs text-gray-500 font-body mb-4 leading-relaxed">{blurb}</p>

        <div className="flex items-baseline gap-1 mb-4">
          <span className="text-3xl font-extrabold font-heading text-gray-900">{fmt(annualPrice)}</span>
          <span className="text-sm text-gray-400 font-medium">/year</span>
        </div>

        <PriceBreakdown stateName={stateName} stateFee={stateFee} annualPrice={annualPrice} showStateFee={showStateFee} />

        {/* Savings */}
        {savings && (
          <div className={`mt-4 flex items-center gap-2 text-sm font-semibold
            ${tier === 'pro' ? 'text-[#10B981]' : 'text-gray-500'}`}>
            <TrendingUp size={14} />
            Est. saves {fmt(savings.low)}–{fmt(savings.high)} in taxes
          </div>
        )}

        {/* Feature list — clean, no long descriptions */}
        <ul className="mt-5 space-y-2.5">
          {features.map((f, i) => (
            <li key={i} className="flex items-start gap-2.5">
              <Check size={15} className={`shrink-0 mt-0.5 ${f.highlight ? 'text-[#F7941D]' : 'text-[#10B981]'}`} />
              <div className="flex-1 min-w-0">
                <p className={`text-sm font-body leading-snug ${f.highlight ? 'font-semibold text-gray-900' : 'text-gray-700'}`}>
                  {f.label}
                </p>
                {f.note && (
                  <p className="text-[11px] text-gray-500 mt-0.5 leading-snug">{f.note}</p>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.button>
  )
}

export default function YourPlan() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const hasBusiness = data.hasExistingBusiness
  const under = isUnderFiftyK(data.revenue)
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'Your')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'Your')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const stateFee = getStateFilingFee(data.state)
  const showStateFee = hasBusiness === false  // only for entity formation path

  // Pro preselected by default
  const [selectedPlan, setSelectedPlan] = useState(data.selectedPlan || 'pro')

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

  useEffect(() => { update({ taxSavingsEstimate: savings }) /* eslint-disable-next-line react-hooks/exhaustive-deps */ }, [savings])

  const features = getFeatures(hasBusiness)
  const upsellDelta = savings.diwm.mid - savings.diy.mid

  // Plan title takes the industry — "Basic Construction Plan" / "Pro Construction Plan"
  const titlePrefix = data.industry === 'other' || !data.industry ? '' : `${industryLabel} `

  // Use shortened industry name for titles (drop "& Subcategory")
  const shortIndustry = industryLabel.split('&')[0].split('/')[0].trim()

  const handleContinue = () => {
    const planId = selectedPlan === 'pro' ? 'pro' : 'basic'
    update({ selectedPlan: planId })
    if (hasBusiness) {
      nav('/checkout')
    } else {
      nav('/entity-type')
    }
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 md:py-14 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Top */}
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> Matched to your business
          </div>
          <h1 className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 mb-3 leading-tight">
            {hasBusiness === false
              ? `Let's get your ${shortIndustry.toLowerCase()} business set up right.`
              : `Your ${shortIndustry.toLowerCase()} plan in ${stateName}.`}
          </h1>
          <p className="text-gray-500 font-body text-sm md:text-base max-w-xl mx-auto">
            Pick a plan. We work with thousands of {industryLabel.toLowerCase()} businesses{data.state ? ` in ${stateName}` : ''}.
          </p>
        </motion.div>

        {/* Plan cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <PlanCard
            tier="basic"
            name={`Basic ${titlePrefix}Plan`.replace(/\s+/g, ' ')}
            blurb="Formation + bookkeeping + business taxes. Add S-Corp later."
            annualPrice={228}
            stateName={stateName}
            stateFee={stateFee}
            showStateFee={showStateFee}
            features={features.basic}
            selected={selectedPlan === 'basic'}
            savings={savings.diy}
            onSelect={() => setSelectedPlan('basic')}
          />
          <PlanCard
            tier="pro"
            name={`Pro ${titlePrefix}Plan`.replace(/\s+/g, ' ')}
            blurb="Get the S-Corp election + a tax expert on call to maximize your savings."
            annualPrice={348}
            stateName={stateName}
            stateFee={stateFee}
            showStateFee={showStateFee}
            features={features.pro}
            selected={selectedPlan === 'pro'}
            recommended
            savings={savings.diwm}
            onSelect={() => setSelectedPlan('pro')}
          />
        </div>

        {/* "Leaving money on the table" warning when Basic selected */}
        <AnimatePresence>
          {selectedPlan === 'basic' && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              className="overflow-hidden mb-6">
              <div className="bg-amber-50 border-2 border-amber-200 rounded-2xl p-4 md:p-5 flex items-start gap-3">
                <AlertTriangle size={20} className="text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold font-heading text-amber-900 mb-1 text-sm md:text-base">
                    You're leaving up to {fmt(upsellDelta)} on the table.
                  </p>
                  <p className="text-xs md:text-sm text-amber-800 leading-relaxed">
                    The S-Corp election alone saves the average client <strong>$4,000+/yr</strong> in self-employment tax. With the Pro plan, you also get on-demand access to a tax expert who can answer questions and meet with you whenever you need.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Continue button */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
          <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
            onClick={handleContinue}
            className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 md:py-5 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 text-base md:text-lg shadow-[0_4px_20px_rgba(247,148,29,0.35)]">
            Continue with {selectedPlan === 'pro' ? 'Pro' : 'Basic'} {titlePrefix}Plan <ArrowRight size={18} />
          </motion.button>
        </motion.div>

        <div className="mt-8 text-center">
          <div className="flex flex-wrap justify-center items-center gap-3 md:gap-6 text-[11px] md:text-xs text-gray-400 font-body">
            <div className="flex items-center gap-1.5">
              <div className="flex text-[#F7941D]">{[...Array(5)].map((_, i) => <Star key={i} size={11} fill="currentColor" />)}</div>
              <span>4.8/5 on Trustpilot</span>
            </div>
            <span className="hidden md:inline">·</span>
            <span>50,000+ small businesses</span>
            <span className="hidden md:inline">·</span>
            <span>30-day money back</span>
          </div>
        </div>
      </div>
    </div>
  )
}
