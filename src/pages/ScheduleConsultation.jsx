import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Sparkles, Calendar, Video, Receipt, MapPin, Briefcase, Building2, ShieldCheck, Zap } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import { getRevenueLabel, isUnderFiftyK } from '../utils/recommendations'
import CalendarPicker from '../components/CalendarPicker'

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
  const purchased = data.purchased  // EF flow if true

  const handleConfirm = () => {
    // EF (purchased) → straight to confirmation. Non-EF (consultation) → lead form.
    if (purchased) nav('/intake/confirmation')
    else nav('/intake/lead')
  }

  const handleMeetNow = () => {
    update({ meetNow: true, selectedDate: 'Today', selectedTime: 'Right now' })
    if (purchased) nav('/intake/confirmation')
    else nav('/intake/lead')
  }

  // Personalized headline based on path
  const headline = purchased
    ? `Schedule your onboarding call with your dedicated tax expert.`
    : hasBusiness && !under
      ? `Meet a senior tax specialist who knows ${industryLabel.toLowerCase()} in ${stateName}.`
      : hasBusiness === false
        ? `Get a founder-stage tax specialist matched to your ${industryLabel.toLowerCase()} business.`
        : `Get a custom tax strategy session for your ${industryLabel.toLowerCase()} business in ${stateName}.`

  const subhead = purchased
    ? '30-minute Google Meet. We\'ll walk through your books, your tax setup, and what to expect in your first quarter.'
    : '30-minute Google Meet. Real strategy, no sales pitch. Your specialist will have reviewed everything you\'ve shared.'

  const agenda = [
    { icon: Receipt,  title: `Tax savings specific to ${industryLabel.toLowerCase()}`, detail: `Deductions and credits other ${industryLabel.toLowerCase()} owners commonly miss.` },
    { icon: MapPin,   title: `${stateName} tax code & local credits`, detail: `Your specialist knows ${stateName}'s rules inside and out.` },
    ...(revLabel ? [{ icon: Briefcase, title: `Strategies for ${revLabel} businesses`, detail: under ? 'Building a foundation that scales.' : 'Tax planning that compounds.' }] : []),
    ...(hasBusiness === false ? [{ icon: Building2, title: 'Entity formation — done right', detail: 'LLC setup, EIN, and state filing.' }] : []),
  ]

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 md:py-16">
      <div className="max-w-5xl mx-auto px-6">
        {/* Personalized hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <div className="inline-flex items-center gap-2 bg-[#F7941D]/10 border border-[#F7941D]/20 text-[#F7941D] text-xs font-bold px-3 py-1.5 rounded-full mb-4 uppercase tracking-wider">
            <Sparkles size={14} /> {purchased ? 'Onboarding' : 'Personalized for your business'}
          </div>
          <h1 className="text-2xl md:text-4xl font-extrabold font-heading text-gray-900 mb-3 max-w-3xl mx-auto leading-tight">
            {headline}
          </h1>
          <p className="text-gray-500 font-body text-base md:text-lg max-w-2xl mx-auto">{subhead}</p>
        </motion.div>

        {/* MEET NOW callout */}
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.12 }}
          className="bg-gradient-to-br from-[#1a1a2e] to-[#2d2d44] rounded-3xl p-5 md:p-6 text-white mb-8 flex flex-col sm:flex-row items-start sm:items-center gap-4 shadow-lg">
          <div className="flex items-center gap-3 flex-1">
            <div className="w-12 h-12 rounded-2xl bg-[#F7941D]/20 flex items-center justify-center shrink-0">
              <Zap size={22} className="text-[#F7941D]" fill="#F7941D" />
            </div>
            <div>
              <p className="font-bold font-heading text-lg">Meet Now</p>
              <p className="text-sm text-white/70 font-body">An expert is available in under 5 minutes.</p>
            </div>
          </div>
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={handleMeetNow}
            className="w-full sm:w-auto bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-3 px-6 rounded-full transition-all cursor-pointer text-sm flex items-center justify-center gap-2 shrink-0">
            <Video size={16} /> Connect Now
          </motion.button>
        </motion.div>

        <div className="text-center mb-6">
          <p className="text-xs uppercase tracking-wider text-gray-400 font-bold">Or pick a time</p>
        </div>

        {/* Two-column: agenda + calendar */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:col-span-2 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                <Sparkles size={20} className="text-[#F7941D]" />
              </div>
              <h2 className="font-bold font-heading text-gray-900">Here's what we'll cover</h2>
            </div>
            <p className="text-sm text-gray-500 font-body mb-5">Every minute focused on your business.</p>
            <div className="space-y-4">
              {agenda.map((item, i) => (
                <motion.div key={item.title}
                  initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.06 }}
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
                <Video size={15} className="text-[#F7941D]" /> Google Meet
              </div>
              <div className="flex items-center gap-2.5 text-sm text-gray-600">
                <ShieldCheck size={15} className="text-[#F7941D]" /> No sales pressure
              </div>
            </div>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}
            className="lg:col-span-3 bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
            <h2 className="font-bold font-heading text-gray-900 mb-1">Pick a time</h2>
            <p className="text-sm text-gray-500 font-body mb-5">All times Eastern. Reschedule or cancel anytime.</p>

            <CalendarPicker
              selectedDate={data.selectedDate}
              selectedTime={data.selectedTime}
              onDate={(d) => update({ selectedDate: d, meetNow: false })}
              onTime={(t) => update({ selectedTime: t, meetNow: false })}
            />

            {data.selectedDate && data.selectedTime && !data.meetNow && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                className="mt-6 pt-5 border-t border-gray-100">
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                    <Calendar size={18} className="text-[#F7941D]" />
                  </div>
                  <div>
                    <p className="font-semibold font-heading text-gray-900 text-sm">{data.selectedDate}</p>
                    <p className="text-sm text-[#F7941D] font-medium">{data.selectedTime} EST</p>
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
