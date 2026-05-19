import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, Video, Receipt, MapPin, Briefcase, Building2, ShieldCheck } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import { getRevenueLabel, isUnderFiftyK } from '../utils/recommendations'
import CalendarPicker from '../components/CalendarPicker'

const PLAN_NAMES = {
  basic: 'Do-It-Yourself', pro: 'Do-It-With-Me',
  core: 'Core Accounting', complete: 'Business Complete',
}

export default function ScheduleConsultation() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const revLabel = getRevenueLabel(data.revenue)
  const under = isUnderFiftyK(data.revenue)
  const hasBusiness = data.hasExistingBusiness
  const planName = PLAN_NAMES[data.selectedPlan]

  const handleConfirm = () => nav('/lead-form')

  // Build personalized agenda based on what they've told us
  const agenda = [
    {
      icon: Receipt,
      title: `Tax savings specific to ${industryLabel.toLowerCase()}`,
      detail: `Deductions and credits other ${industryLabel.toLowerCase()} owners commonly miss.`,
    },
    {
      icon: MapPin,
      title: `${stateName} tax code & local credits`,
      detail: `Your specialist knows ${stateName}'s rules inside and out — including programs you may qualify for.`,
    },
    ...(revLabel ? [{
      icon: Briefcase,
      title: `Strategies for ${revLabel} businesses`,
      detail: under
        ? 'Building a foundation that scales — entity choice, quarterly estimates, and the right tools for your stage.'
        : 'Tax planning that compounds — S-Corp election, retirement contributions, and proactive quarterly strategy.',
    }] : []),
    ...(hasBusiness === false ? [{
      icon: Building2,
      title: 'Entity formation — done right the first time',
      detail: 'LLC vs S-Corp vs C-Corp for your situation, plus the state-specific filing path.',
    }] : []),
    ...(planName ? [{
      icon: ShieldCheck,
      title: `Whether ${planName} is the right fit`,
      detail: `We'll walk through what's actually included and confirm it matches what you need. No upsell games.`,
    }] : []),
  ]

  // Headline copy adapts to the path they took
  const headline = hasBusiness && !under
    ? `Meet a senior tax specialist who knows ${industryLabel.toLowerCase()} in ${stateName}.`
    : hasBusiness === false
      ? `Get a founder-stage tax specialist matched to your ${industryLabel.toLowerCase()} business.`
      : `Get a custom tax strategy session for your ${industryLabel.toLowerCase()} business in ${stateName}.`

  const subhead = hasBusiness && !under
    ? `30-minute Google Meet, built for ${revLabel || 'established'} businesses. Your specialist already has your context — no need to repeat yourself.`
    : `30-minute Google Meet. Real strategy, no sales pitch. Your specialist will have reviewed everything you've shared before the call.`

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        {/* Personalized hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> Personalized for your business
          </div>
          <h1 className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3 max-w-3xl mx-auto leading-tight">
            {headline}
          </h1>
          <p className="text-gray-500 font-body text-lg max-w-2xl mx-auto">{subhead}</p>
        </motion.div>

        {/* Match summary chips */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="flex flex-wrap justify-center gap-2 mb-10">
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <Briefcase size={12} className="text-[#F7941D]" /> {industryLabel}
          </span>
          <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
            <MapPin size={12} className="text-[#F7941D]" /> {stateName}
          </span>
          {revLabel && (
            <span className="inline-flex items-center gap-1.5 bg-white border border-gray-200 text-gray-700 text-xs font-medium px-3 py-1.5 rounded-full">
              <Receipt size={12} className="text-[#F7941D]" /> {revLabel}
            </span>
          )}
          {planName && (
            <span className="inline-flex items-center gap-1.5 bg-[#F7941D]/10 border border-[#F7941D]/30 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full">
              <Sparkles size={12} /> Discussing: {planName}
            </span>
          )}
        </motion.div>

        {/* Two-column: agenda card + calendar card */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* Agenda — what we'll cover */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                <Sparkles size={20} className="text-[#F7941D]" />
              </div>
              <h2 className="font-bold font-heading text-gray-900">Here's what we'll cover</h2>
            </div>
            <p className="text-sm text-gray-500 font-body mb-5">
              Every minute focused on your business — not generic advice.
            </p>
            <div className="space-y-4">
              {agenda.map((item, i) => (
                <motion.div key={item.title}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.06 }}
                  className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-lg bg-[#F7941D]/10 flex items-center justify-center shrink-0">
                    <item.icon size={16} className="text-[#F7941D]" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold font-heading text-gray-900 mb-0.5">{item.title}</p>
                    <p className="text-xs text-gray-500 font-body leading-relaxed">{item.detail}</p>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-6 pt-5 border-t border-gray-100 space-y-2.5">
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Calendar size={15} className="text-[#F7941D]" /> 30 minutes
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <Video size={15} className="text-[#F7941D]" /> Google Meet (link sent after booking)
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <ShieldCheck size={15} className="text-[#F7941D]" /> No sales pressure — strategy only
              </div>
            </div>
          </motion.div>

          {/* Calendar */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.35 }}
            className="lg:col-span-3 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h2 className="font-bold font-heading text-gray-900 mb-1">Pick a time</h2>
            <p className="text-sm text-gray-500 font-body mb-5">All times Eastern. Reschedule or cancel anytime.</p>

            <CalendarPicker
              selectedDate={data.selectedDate}
              selectedTime={data.selectedTime}
              onDate={(d) => update({ selectedDate: d })}
              onTime={(t) => update({ selectedTime: t })}
            />

            {data.selectedDate && data.selectedTime && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                      <Calendar size={18} className="text-[#F7941D]" />
                    </div>
                    <div>
                      <p className="font-semibold font-heading text-gray-900 text-sm">{data.selectedDate}</p>
                      <p className="text-sm text-[#F7941D] font-medium">{data.selectedTime} EST</p>
                    </div>
                  </div>
                </div>
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleConfirm}
                  className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg">
                  Continue
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  )
}
