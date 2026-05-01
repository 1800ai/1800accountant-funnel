import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { US_STATES } from '../utils/states'
import { INDUSTRIES } from '../utils/industries'
import { isUnderFiftyK } from '../utils/recommendations'

const stepsUnder = (state, industry) => [
  { text: 'Analyzing your tax profile...', dur: 3000 },
  { text: `Searching ${state} tax regulations...`, dur: 4000 },
  { text: `Identifying deductions for ${industry}...`, dur: 4000 },
  { text: 'Building your personalized plan...', dur: 4000 },
]

const stepsOver = (state, industry) => [
  { text: 'Analyzing your tax profile...', dur: 3000 },
  { text: `Researching ${state} tax strategy options...`, dur: 4000 },
  { text: `Mapping deduction opportunities for ${industry}...`, dur: 4000 },
  { text: 'Matching you with a senior tax specialist...', dur: 4000 },
]

export default function AnalyzingScreen() {
  const { data } = useFunnel()
  const nav = useNavigate()
  const [active, setActive] = useState(0)

  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const industryName = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || data.industry || 'your industry')

  const under = isUnderFiftyK(data.revenue)
  const sequence = under ? stepsUnder(stateName, industryName) : stepsOver(stateName, industryName)
  const destination = under ? '/your-plan' : '/schedule'

  useEffect(() => {
    let elapsed = 0
    const timers = sequence.map((s, i) => {
      elapsed += s.dur
      if (i < sequence.length - 1) {
        return setTimeout(() => setActive(i + 1), elapsed)
      }
      return setTimeout(() => nav(destination), elapsed)
    })
    return () => timers.forEach(clearTimeout)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const progress = ((active + 1) / sequence.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#1f1f35] to-[#111827] relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#10B981]/5 rounded-full blur-[200px] animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F7941D]/5 rounded-full blur-[180px] animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 w-full">
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-14 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F7941D] to-[#10B981] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
          />
        </div>

        <div className="space-y-5">
          {sequence.map((s, i) => {
            const done = i < active
            const isActive = i === active
            return (
              <motion.div key={i}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: i <= active ? 1 : 0.3, x: 0 }}
                transition={{ delay: i * 0.15 }}
                className="flex items-center gap-4">
                <div className="w-8 h-8 flex items-center justify-center">
                  {done ? (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                      className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
                      <Check size={16} className="text-white" />
                    </motion.div>
                  ) : isActive ? (
                    <div className="w-6 h-6 rounded-full border-2 border-[#F7941D] border-t-transparent animate-spin" />
                  ) : (
                    <div className="w-6 h-6 rounded-full border-2 border-white/20" />
                  )}
                </div>
                <p className={`text-sm font-body ${done || isActive ? 'text-white' : 'text-white/40'}`}>{s.text}</p>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
