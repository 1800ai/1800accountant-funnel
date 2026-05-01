import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ChevronRight,
  Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed,
  Home, Palette, Truck, Briefcase, MoreHorizontal,
} from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import ProgressBar from '../components/ProgressBar'

const ICON_MAP = { Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed, Home, Palette, Truck, Briefcase, MoreHorizontal }

export default function QualifierIndustry() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const isOther = data.industry === 'other'
  const canContinue = !!data.industry && (!isOther || !!data.otherIndustry?.trim())

  const handleContinue = () => {
    if (!canContinue) return
    nav('/get-started/state')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <ProgressBar step={3} />

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          className="mt-10">
          <button onClick={() => nav('/get-started/revenue')}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900 mb-2">
            What industry are you in?
          </h2>
          <p className="text-gray-500 text-center font-body mb-8">We'll match you with an industry specialist.</p>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {INDUSTRIES.map((ind) => {
              const Icon = ICON_MAP[ind.icon] || Briefcase
              const sel = data.industry === ind.id
              return (
                <motion.button key={ind.id} whileTap={{ scale: 0.97 }}
                  onClick={() => {
                    update({ industry: ind.id })
                    if (ind.id !== 'other') update({ otherIndustry: '' })
                  }}
                  className={`p-4 rounded-xl border-2 text-center cursor-pointer transition-all flex flex-col items-center gap-2
                    ${sel ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-gray-200 hover:border-[#F7941D]'}
                  `}>
                  <Icon size={20} className={sel ? 'text-[#F7941D]' : 'text-gray-400'} />
                  <span className={`text-xs font-medium ${sel ? 'text-[#F7941D]' : 'text-gray-600'}`}>{ind.label}</span>
                </motion.button>
              )
            })}
          </div>

          <AnimatePresence>
            {isOther && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="mt-4">
                <input type="text" autoFocus placeholder="Enter your industry..."
                  value={data.otherIndustry || ''}
                  onChange={(e) => update({ otherIndustry: e.target.value })}
                  onKeyDown={(e) => { if (e.key === 'Enter' && canContinue) handleContinue() }}
                  className="w-full rounded-xl border-2 border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 p-4 text-sm outline-none transition-all" />
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence>
            {canContinue && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="pt-6">
                <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                  onClick={handleContinue}
                  className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2">
                  Continue <ChevronRight size={18} />
                </motion.button>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  )
}
