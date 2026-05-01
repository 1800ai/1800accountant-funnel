import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { CalendarClock } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { getRecommendedPlan, getRevenueLabel, isUnderFiftyK } from '../utils/recommendations'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import PricingCard from '../components/PricingCard'
import TrustBadges from '../components/TrustBadges'

// Under-$50K plans (DIY + DIWM). Free Entity Formation badge if no business.
const UNDER_PLANS = [
  {
    id: 'basic', name: 'Do-It-Yourself', price: 19, annualPrice: '228',
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings'],
    ctaText: 'Get Started — $19/mo',
  },
  {
    id: 'pro', name: 'Do-It-With-Me', price: 29, annualPrice: '348', badge: 'MOST POPULAR', popular: true,
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'CPA Review of Taxes', 'Payroll Setup', 'Tax Hotline'],
    ctaText: 'Get Started — $29/mo',
  },
]

// Over-$50K plans (Core Accounting + Business Complete)
const OVER_PLANS = [
  {
    id: 'core', name: 'Core Accounting', price: 249, annualPrice: '2,988', badge: 'BEST VALUE',
    subtitle: 'Done-for-you taxes & advisory for established businesses',
    features: [
      'Done-for-you Business Tax Preparation',
      'Done-for-you Personal Tax Preparation',
      'Year-Round Tax Advisory',
      'Dedicated Accountant',
      'Quarterly Estimated Tax Compliance',
      'Audit Defense',
      'AI Bookkeeping',
      'Unlimited 1099 Filings',
    ],
    ctaText: 'Schedule Free Consultation',
  },
  {
    id: 'complete', name: 'Business Complete', price: 399, annualPrice: '4,788', badge: 'MOST POPULAR', popular: true, premium: true,
    subtitle: 'Core Accounting + Bookkeeping + Payroll — your complete back-office',
    features: [
      'Everything in Core Accounting',
      'Full-Service Bookkeeping (monthly close)',
      'Payroll Setup & Management',
      'Monthly Financial Reports',
      'Proactive Tax Strategy & Planning',
      'Quarterly Reviews with your CPA',
      'Priority Support',
    ],
    ctaText: 'Schedule Free Consultation',
  },
]

export default function YourPlan() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const under = isUnderFiftyK(data.revenue)
  const rec = getRecommendedPlan(data.revenue)
  const revLabel = getRevenueLabel(data.revenue)
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const hasBusiness = data.hasExistingBusiness

  const plans = under
    ? UNDER_PLANS.map((p) => (hasBusiness === false ? {
        ...p,
        name: `${p.name} + Free Entity Formation`,
        bonusFeatures: ['FREE Business Entity Formation', 'FREE EIN Filing'],
        legalZoom: true,
      } : p))
    : OVER_PLANS

  const handleSelect = (planId) => {
    update({ selectedPlan: planId })

    if (under) {
      // Under-$50k branching by business status
      if (hasBusiness) {
        nav('/tax-savings')
      } else {
        nav('/entity-type')
      }
    } else {
      // Over-$50k → schedule consultation → lead form → confirmation
      nav('/schedule')
    }
  }

  const handleNotSure = () => {
    update({ selectedPlan: 'consultation' })
    nav('/schedule')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14">
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3">
            Your Personalized Plan
          </h1>
          <p className="text-gray-500 text-lg font-body max-w-2xl mx-auto">
            Based on your <span className="text-gray-700 font-medium">{industryLabel}</span> business
            {data.state && <> in <span className="text-gray-700 font-medium">{stateName}</span></>}
            {revLabel && <> generating <span className="text-gray-700 font-medium">{revLabel}/year</span></>}, here's what we recommend.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <PricingCard key={plan.id} {...plan}
              recommended={rec === plan.id}
              delay={i * 0.1}
              onSelect={() => handleSelect(plan.id)} />
          ))}

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            whileHover={{ y: -4 }}
            className="relative bg-white rounded-2xl p-6 flex flex-col border border-gray-200 shadow-lg">
            <div className="w-12 h-12 rounded-xl bg-[#F7941D]/10 flex items-center justify-center mb-3">
              <CalendarClock size={22} className="text-[#F7941D]" />
            </div>
            <h3 className="text-base font-bold font-heading text-gray-900 mb-1.5">Not sure?</h3>
            <p className="text-sm text-gray-500 font-body mb-4">
              Talk to a tax expert. They'll help you figure out exactly what fits.
            </p>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleNotSure}
              className="w-full bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-semibold py-3 rounded-full transition-all cursor-pointer text-sm mt-auto">
              Schedule Free Call
            </motion.button>
            <p className="text-[11px] text-gray-400 text-center mt-2">No obligation</p>
          </motion.div>
        </div>

        <div className="mt-20">
          <p className="text-center text-gray-500 font-medium font-heading mb-8">Join 50,000+ small business owners</p>
          <TrustBadges />
        </div>
      </div>
    </div>
  )
}
