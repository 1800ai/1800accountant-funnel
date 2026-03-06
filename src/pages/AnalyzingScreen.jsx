import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { US_STATES } from '../utils/states'
import { INDUSTRIES } from '../utils/industries'

const steps = (state, industry) => [
  { text: 'Analyzing your tax profile...', dur: 3000 },
  { text: `Searching ${state} tax regulations...`, dur: 4000 },
  { text: `Identifying deductions for ${industry}...`, dur: 4000 },
  { text: 'Building your personalized plan...', dur: 4000 },
]

function PulseCheck({ done }) {
  return (
    <div className="w-8 h-8 flex items-center justify-center">
      {done ? (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20 }}
          className="w-8 h-8 bg-[#10B981] rounded-full flex items-center justify-center">
          <Check size={16} className="text-white" />
        </motion.div>
      ) : (
        <div className="w-6 h-6 rounded-full border-2 border-[#F7941D] border-t-transparent animate-spin" />
      )}
    </div>
  )
}

export default function AnalyzingScreen() {
  const { data } = useFunnel()
  const nav = useNavigate()
  const [active, setActive] = useState(0)

  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const industryName = INDUSTRIES.find((i) => i.id === data.industry)?.label || data.industry || 'your industry'
  const sequence = steps(stateName, industryName)

  useEffect(() => {
    let elapsed = 0
    const timers = sequence.map((s, i) => {
      elapsed += s.dur
      if (i < sequence.length - 1) {
        return setTimeout(() => setActive(i + 1), elapsed)
      }
      return setTimeout(() => nav('/your-plan'), elapsed)
    })
    return () => timers.forEach(clearTimeout)
  }, [])

  const progress = ((active + 1) / sequence.length) * 100

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a1a2e] via-[#1f1f35] to-[#111827] relative overflow-hidden">
      {/* Animated background gradient */}
      <div className="absolute inset-0">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-[#10B981]/5 rounded-full blur-[200px] animate-orb" />
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-[#F7941D]/5 rounded-full blur-[180px] animate-orb" style={{ animationDelay: '4s' }} />
      </div>

      <div className="relative z-10 max-w-md mx-auto px-6 w-full">
        {/* Progress bar */}
        <div className="w-full h-1.5 bg-white/10 rounded-full mb-14 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-[#F7941D] to-[#10B981] rounded-full"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
        </div>

        {/* Steps */}
        <div className="space-y-8">
          {sequence.map((s, i) => {
            const done = active > i
            const current = active === i
            return (
              <motion.div key={i}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: i <= active ? 1 : 0.3, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="flex items-center gap-4">
                <PulseCheck done={done} />
                <span className={`text-lg font-medium font-body transition-colors duration-500
                  ${current ? 'text-white' : done ? 'text-gray-500' : 'text-gray-700'}
                `}>{s.text}</span>
              </motion.div>
            )
          })}
        </div>

        <motion.p
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}
          className="text-center text-gray-500 text-sm mt-16 font-body">
          This typically takes a few seconds...
        </motion.p>
      </div>
    </div>
  )
}
