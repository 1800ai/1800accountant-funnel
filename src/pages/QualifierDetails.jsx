import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ArrowLeft, ChevronRight, Search,
  Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed,
  Home, Palette, Truck, Briefcase, MoreHorizontal,
} from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES, POPULAR_STATES } from '../utils/states'
import ProgressBar from '../components/ProgressBar'

const ICON_MAP = { Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed, Home, Palette, Truck, Briefcase, MoreHorizontal }

function StateSelect({ value, onChange }) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')
  const ref = useRef(null)

  useEffect(() => {
    const handler = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false) }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const filtered = US_STATES.filter((s) =>
    s.name.toLowerCase().includes(search.toLowerCase()) || s.abbr.toLowerCase().includes(search.toLowerCase())
  )
  const popular = US_STATES.filter((s) => POPULAR_STATES.includes(s.abbr))
  const selected = US_STATES.find((s) => s.abbr === value)

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(!open)}
        className={`w-full text-left rounded-xl border-2 p-4 transition-all cursor-pointer flex items-center justify-between
          ${open ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : value ? 'border-[#F7941D] bg-[#F7941D]/5' : 'border-gray-200 hover:border-gray-300'}
        `}>
        <span className={value ? 'text-gray-900 font-medium' : 'text-gray-400'}>
          {selected ? `${selected.name} (${selected.abbr})` : 'Select your state...'}
        </span>
        <ChevronRight size={16} className={`text-gray-400 transition-transform ${open ? 'rotate-90' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            className="absolute z-50 mt-2 w-full bg-white rounded-xl border border-gray-200 shadow-xl max-h-72 overflow-hidden">
            <div className="p-3 border-b border-gray-100">
              <div className="flex items-center gap-2 bg-gray-50 rounded-lg px-3 py-2">
                <Search size={16} className="text-gray-400" />
                <input type="text" placeholder="Search states..." value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent text-sm outline-none w-full" autoFocus />
              </div>
            </div>
            <div className="overflow-y-auto max-h-52">
              {!search && (
                <div className="px-3 pt-2 pb-1">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Popular</p>
                  {popular.map((s) => (
                    <button key={s.abbr}
                      onClick={() => { onChange(s.abbr); setOpen(false); setSearch('') }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-sm hover:bg-[#F7941D]/10 hover:text-[#F7941D] transition-colors cursor-pointer
                        ${value === s.abbr ? 'bg-[#F7941D]/10 text-[#F7941D] font-medium' : 'text-gray-700'}
                      `}>
                      {s.name} ({s.abbr})
                    </button>
                  ))}
                  <div className="border-t border-gray-100 my-1" />
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">All States</p>
                </div>
              )}
              {filtered.map((s) => (
                <button key={s.abbr}
                  onClick={() => { onChange(s.abbr); setOpen(false); setSearch('') }}
                  className={`w-full text-left px-6 py-2 text-sm hover:bg-[#F7941D]/10 hover:text-[#F7941D] transition-colors cursor-pointer
                    ${value === s.abbr ? 'bg-[#F7941D]/10 text-[#F7941D] font-medium' : 'text-gray-700'}
                  `}>
                  {s.name} ({s.abbr})
                </button>
              ))}
              {filtered.length === 0 && <p className="p-4 text-sm text-gray-400 text-center">No states found</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function QualifierDetails() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const isOther = data.industry === 'other'
  const industryDone = !!data.industry && (!isOther || !!data.otherIndustry?.trim())
  const stateDone = !!data.state
  const canContinue = industryDone && stateDone

  const handleContinue = () => {
    if (!canContinue) return
    nav('/intake/analyzing')
  }

  return (
    <div className="min-h-screen bg-white py-10 md:py-12">
      <div className="max-w-2xl mx-auto px-6">
        <ProgressBar step={3} />

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          className="mt-10 space-y-10">
          <button onClick={() => nav('/intake/revenue')}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors text-sm cursor-pointer">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900">
            A couple more details
          </h2>

          {/* Industry */}
          <div>
            <p className="font-semibold font-heading text-gray-900 mb-3">What industry are you in?</p>
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
                  className="mt-3">
                  <input type="text" autoFocus placeholder="Enter your industry..."
                    value={data.otherIndustry || ''}
                    onChange={(e) => update({ otherIndustry: e.target.value })}
                    className="w-full rounded-xl border-2 border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 p-4 text-sm outline-none transition-all" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* State */}
          <AnimatePresence>
            {industryDone && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.35 }}>
                <p className="font-semibold font-heading text-gray-900 mb-3">Where is your business based?</p>
                <StateSelect value={data.state} onChange={(val) => update({ state: val })} />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue */}
          <AnimatePresence>
            {canContinue && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
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
