import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ChevronDown, ChevronUp, Check, X, Sparkles, CalendarClock } from 'lucide-react'
import { useState } from 'react'
import { useFunnel } from '../context/FunnelContext'
import { getRecommendedPlan, getRevenueLabel } from '../utils/recommendations'
import { INDUSTRIES } from '../utils/industries'
import PricingCard from '../components/PricingCard'
import TrustBadges from '../components/TrustBadges'

const PLANS_A = [
  {
    id: 'basic', name: 'Do-It-Yourself', price: 19, annualPrice: '228', badge: 'Best Value',
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings'],
    ctaText: 'Get Started — $19/mo', route: '/checkout',
  },
  {
    id: 'pro', name: 'Do-It-With-Me', price: 29, annualPrice: '348', badge: 'GREAT FOR GROWING BUSINESSES',
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'CPA Review of Taxes', 'Payroll Setup', 'Tax Hotline'],
    ctaText: 'Get Started — $29/mo', route: '/checkout',
  },
  {
    id: 'premium', name: 'Full-Service', price: 249, annualPrice: '2,988', premium: true, popular: true, badge: 'MOST POPULAR',
    subtitle: 'Your dedicated accounting team — maximum savings guaranteed',
    features: ['Done-for-you Business Taxes', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Done-for-you Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'Payroll Setup', 'Dedicated Accountant', 'Year-round Tax Advice', 'Proactive Tax Planning', 'Quarterly Reviews'],
    ctaText: 'Schedule a Free Consultation', route: '/schedule',
  },
]

const PLANS_B = [
  {
    id: 'basic', name: 'Do-It-Yourself + Free Entity Formation', price: 19, annualPrice: '228',
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings'],
    bonusFeatures: ['FREE Business Entity Formation', 'FREE EIN Filing'],
    ctaText: 'Get Started — $19/mo', route: '/checkout', legalZoom: true,
  },
  {
    id: 'pro', name: 'Do-It-With-Me + Free Entity Formation', price: 29, annualPrice: '348', badge: 'GREAT FOR GROWING BUSINESSES',
    features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'CPA Review of Taxes', 'Payroll Setup', 'Tax Hotline'],
    bonusFeatures: ['FREE Business Entity Formation', 'FREE EIN Filing'],
    ctaText: 'Get Started — $29/mo', route: '/checkout', legalZoom: true,
  },
]

const COMPARE_FEATURES = [
  { name: 'Free AI Business Tax Return', basic: true, pro: true, premium: true },
  { name: 'AI Bookkeeping', basic: true, pro: true, premium: true },
  { name: 'Business Tax Extension', basic: true, pro: true, premium: true },
  { name: 'Unlimited 1099 Filings', basic: true, pro: true, premium: true },
  { name: 'Personal Tax Preparation', basic: false, pro: true, premium: true },
  { name: 'Quarterly Tax Compliance', basic: false, pro: true, premium: true },
  { name: 'CPA Review of Taxes', basic: false, pro: true, premium: false },
  { name: 'Tax Hotline', basic: false, pro: true, premium: false },
  { name: 'Payroll Setup', basic: false, pro: true, premium: true },
  { name: 'Dedicated Accountant', basic: false, pro: false, premium: true },
  { name: 'Year-round Tax Advice', basic: false, pro: false, premium: true },
  { name: 'Proactive Tax Planning', basic: false, pro: false, premium: true },
  { name: 'Quarterly Reviews', basic: false, pro: false, premium: true },
]

function ComparisonTable() {
  const [open, setOpen] = useState(false)
  return (
    <div className="max-w-4xl mx-auto mt-12">
      <button onClick={() => setOpen(!open)}
        className="flex items-center gap-2 mx-auto text-sm font-medium text-gray-500 hover:text-gray-700 transition-colors cursor-pointer">
        {open ? 'Hide' : 'Show'} Feature Comparison
        {open ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
      </button>
      {open && (
        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
          className="mt-6 bg-white rounded-2xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left p-4 font-semibold text-gray-900">Feature</th>
                <th className="p-4 text-center font-semibold text-gray-900">Do-It-Yourself<br /><span className="text-gray-400 font-normal">$19</span></th>
                <th className="p-4 text-center font-semibold text-[#F7941D]">Do-It-With-Me<br /><span className="text-gray-400 font-normal">$29</span></th>
                <th className="p-4 text-center font-semibold text-[#1a1a2e]">Full-Service<br /><span className="text-gray-400 font-normal">$249</span></th>
              </tr>
            </thead>
            <tbody>
              {COMPARE_FEATURES.map((f, i) => (
                <tr key={f.name} className={i % 2 === 0 ? 'bg-gray-50' : ''}>
                  <td className="p-4 text-gray-700">{f.name}</td>
                  <td className="p-4 text-center">{f.basic ? <Check size={16} className="text-[#10B981] mx-auto" /> : <X size={16} className="text-gray-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{f.pro ? <Check size={16} className="text-[#10B981] mx-auto" /> : <X size={16} className="text-gray-300 mx-auto" />}</td>
                  <td className="p-4 text-center">{f.premium ? <Check size={16} className="text-[#10B981] mx-auto" /> : <X size={16} className="text-gray-300 mx-auto" />}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </motion.div>
      )}
    </div>
  )
}

function MiniTestimonial({ quote, name, biz, savings }) {
  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
      <p className="text-[#10B981] font-bold text-lg font-heading mb-2">{savings}</p>
      <p className="text-sm text-gray-600 italic mb-3 font-body">"{quote}"</p>
      <p className="text-xs font-semibold text-gray-900">{name}</p>
      <p className="text-xs text-gray-400">{biz}</p>
    </div>
  )
}

export default function YourPlan() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const rec = getRecommendedPlan(data.revenue)
  const revLabel = getRevenueLabel(data.revenue)
  const industryLabel = INDUSTRIES.find((i) => i.id === data.industry)?.label || data.industry || 'your'
  const hasExisting = data.hasExistingBusiness

  const handleSelect = (plan, route) => {
    update({ selectedPlan: plan })
    nav(route)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-center mb-14">
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3">
            Your Personalized Plan
          </h1>
          <p className="text-gray-500 text-lg font-body max-w-2xl mx-auto">
            Based on your <span className="text-gray-700 font-medium">{industryLabel}</span> business
            {data.state && <> in <span className="text-gray-700 font-medium">{data.state}</span></>}
            {revLabel && <> generating <span className="text-gray-700 font-medium">{revLabel}/year</span></>}, here's what we recommend.
          </p>
        </motion.div>

        {/* PATH A: Existing Business */}
        {hasExisting && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
            {PLANS_A.map((plan, i) => (
              <PricingCard key={plan.id} {...plan}
                recommended={rec === plan.id}
                delay={i * 0.1}
                onSelect={() => handleSelect(plan.id, plan.route)} />
            ))}
            {/* Not Sure Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              whileHover={{ y: -4 }}
              className="relative bg-[#F9FAFB] rounded-2xl p-6 flex flex-col border border-gray-200 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#F7941D]/10 flex items-center justify-center mb-3">
                <CalendarClock size={22} className="text-[#F7941D]" />
              </div>
              <h3 className="text-base font-bold font-heading text-gray-900 mb-1.5">Not sure?</h3>
              <p className="text-sm text-gray-500 font-body mb-4">
                A tax expert can help you choose the best plan for your business.
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { update({ selectedPlan: 'consultation' }); nav('/schedule') }}
                className="w-full bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-semibold py-3 rounded-full transition-all cursor-pointer text-sm mt-auto">
                Schedule Free Call
              </motion.button>
              <p className="text-[11px] text-gray-400 text-center mt-2">No obligation</p>
            </motion.div>
          </div>
        )}

        {/* PATH B: No Business */}
        {!hasExisting && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {PLANS_B.map((plan, i) => (
              <PricingCard key={plan.id} {...plan}
                recommended={rec === plan.id}
                delay={i * 0.1}
                onSelect={() => handleSelect(plan.id, plan.route)} />
            ))}
            {/* Not Sure Card */}
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              whileHover={{ y: -4 }}
              className="bg-[#F9FAFB] rounded-2xl p-6 flex flex-col border border-gray-200 shadow-lg">
              <div className="w-12 h-12 rounded-xl bg-[#F7941D]/10 flex items-center justify-center mb-3">
                <CalendarClock size={22} className="text-[#F7941D]" />
              </div>
              <h3 className="text-base font-bold font-heading text-gray-900 mb-1.5">Not sure?</h3>
              <p className="text-sm text-gray-500 font-body mb-4">
                A tax expert can help you choose the best plan for your business.
              </p>
              <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                onClick={() => { update({ selectedPlan: 'consultation' }); nav('/schedule') }}
                className="w-full bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-semibold py-3 rounded-full transition-all cursor-pointer text-sm mt-auto">
                Schedule Free Call
              </motion.button>
              <p className="text-[11px] text-gray-400 text-center mt-2">No obligation</p>
            </motion.div>
          </div>
        )}

        {/* Comparison Table (Path A only) */}
        {hasExisting && <ComparisonTable />}

        {/* Social Proof */}
        <div className="mt-20">
          <p className="text-center text-gray-500 font-medium font-heading mb-8">Join 50,000+ small business owners</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto mb-12">
            <MiniTestimonial savings="Saved $8,200" quote="My first year savings paid for the service 5x over." name="Sarah M." biz="E-commerce, TX" />
            <MiniTestimonial savings="Saved $12,400" quote="They found deductions I didn't even know existed." name="James R." biz="Consulting, CA" />
            <MiniTestimonial savings="Saved $5,800" quote="Worth every penny. My books are finally clean." name="Lisa K." biz="Restaurant, FL" />
          </div>
          <TrustBadges />
        </div>
      </div>
    </div>
  )
}
