import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ChevronRight, ArrowLeft } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

const ENTITY_TYPES = [
  {
    id: 'llc', name: 'LLC', tag: 'Most Popular',
    description: 'Personal liability protection with flexible taxation. Best for most small businesses.',
  },
  {
    id: 's-corp', name: 'S-Corporation', tag: 'Tax Savings',
    description: 'Pass-through taxation with potential payroll tax savings on owner distributions.',
  },
  {
    id: 'c-corp', name: 'C-Corporation', tag: 'For Investors',
    description: 'Best if you plan to raise venture capital or issue multiple classes of stock.',
  },
  {
    id: 'sole-prop', name: 'Sole Proprietorship', tag: 'Simplest',
    description: 'Easiest to set up but offers no liability protection from your personal assets.',
  },
]

export default function EntityType() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [selected, setSelected] = useState(data.entityType || null)

  const handleContinue = () => {
    if (!selected) return
    update({ entityType: selected })
    nav('/company-info')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={() => nav('/your-plan')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-2">Let's form your business.</h1>
          <p className="text-gray-500 font-body">Pick the entity type that fits your goals — we'll handle the rest.</p>
        </motion.div>

        <div className="space-y-3">
          {ENTITY_TYPES.map((e, i) => (
            <motion.button key={e.id}
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.06 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setSelected(e.id)}
              className={`w-full text-left p-5 rounded-2xl border-2 transition-all cursor-pointer
                ${selected === e.id ? 'border-[#F7941D] bg-[#F7941D]/5 shadow-lg' : 'border-gray-200 hover:border-[#F7941D] hover:shadow-md'}
              `}>
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-bold font-heading text-gray-900 text-lg">{e.name}</span>
                    <span className="text-[10px] uppercase tracking-wider text-[#F7941D] bg-[#F7941D]/10 border border-[#F7941D]/20 px-2 py-0.5 rounded-full font-bold">
                      {e.tag}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-body">{e.description}</p>
                </div>
                {selected === e.id && (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                    className="w-7 h-7 bg-[#F7941D] rounded-full flex items-center justify-center shrink-0 mt-1">
                    <Check size={14} className="text-white" />
                  </motion.div>
                )}
              </div>
            </motion.button>
          ))}
        </div>

        {selected && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleContinue}
              className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2">
              Continue <ChevronRight size={18} />
            </motion.button>
          </motion.div>
        )}

        <p className="text-xs text-gray-400 text-center mt-6 font-body">
          Not sure which one is right? Your dedicated accountant will help you finalize the choice during onboarding.
        </p>
      </div>
    </div>
  )
}
