import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Building2, Rocket, Check, ChevronRight, Search,
  Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed,
  Home, Palette, Truck, Briefcase, MoreHorizontal,
} from 'lucide-react'

const ICON_MAP = { Hammer, ShoppingCart, Monitor, Heart, UtensilsCrossed, Home, Palette, Truck, Briefcase, MoreHorizontal }
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES, REVENUE_OPTIONS } from '../utils/industries'
import { US_STATES, POPULAR_STATES } from '../utils/states'
import ProgressBar from '../components/ProgressBar'

const slide = {
  initial: { opacity: 0, x: 40 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.35 } },
  exit: { opacity: 0, x: -40, transition: { duration: 0.25 } },
}

function BusinessCard({ icon: Icon, title, subtitle, selected, onClick }) {
  return (
    <motion.button whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className={`relative min-h-[200px] flex flex-col items-center justify-center gap-4 p-8 rounded-2xl border-2 cursor-pointer transition-all duration-200 w-full
        ${selected ? 'border-[#F7941D] bg-[#F7941D]/5 shadow-lg' : 'border-gray-200 hover:border-[#F7941D] hover:shadow-lg'}
      `}>
      {selected && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
          className="absolute top-4 right-4 w-7 h-7 bg-[#F7941D] rounded-full flex items-center justify-center">
          <Check size={14} className="text-white" />
        </motion.div>
      )}
      <div className="w-16 h-16 rounded-2xl bg-[#F7941D]/10 flex items-center justify-center">
        <Icon size={28} className="text-[#F7941D]" />
      </div>
      <div className="text-center">
        <p className="font-bold font-heading text-gray-900">{title}</p>
        <p className="text-sm text-gray-500 mt-1 font-body">{subtitle}</p>
      </div>
    </motion.button>
  )
}

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

export default function QualifierFlow() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [step, setStep] = useState(1)
  const [subStep, setSubStep] = useState(0) // for step 2 sequential reveal

  // Step 2 sequential: 0=revenue, 1=industry, 2=state
  const revDone = !!data.revenue
  const indDone = !!data.industry && (data.industry !== 'other' || !!data.otherIndustry?.trim())
  const stateDone = !!data.state

  useEffect(() => {
    if (revDone && subStep < 1) setSubStep(1)
    if (data.industry && data.industry !== 'other' && subStep < 2) setSubStep(2)
    if (data.industry === 'other' && data.otherIndustry?.trim() && subStep < 2) setSubStep(2)
  }, [revDone, data.industry, data.otherIndustry])

  const handleStep1 = (val) => {
    update({ hasExistingBusiness: val })
    setTimeout(() => setStep(2), 500)
  }

  const handleContinue = () => {
    nav('/analyzing')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <ProgressBar step={step} />

        <AnimatePresence mode="wait">
          {/* Step 1: Business Status */}
          {step === 1 && (
            <motion.div key="step1" {...slide} className="mt-10">
              <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900 mb-8">
                First, do you already have a registered business?
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <BusinessCard icon={Building2} title="Yes, I have a business"
                  subtitle="I'm looking for tax & accounting support"
                  selected={data.hasExistingBusiness === true}
                  onClick={() => handleStep1(true)} />
                <BusinessCard icon={Rocket} title="Not yet — I'm just getting started"
                  subtitle="I want to form my business and get set up right"
                  selected={data.hasExistingBusiness === false}
                  onClick={() => handleStep1(false)} />
              </div>
            </motion.div>
          )}

          {/* Step 2: Business Details (revenue, industry, state) */}
          {step === 2 && (
            <motion.div key="step2" {...slide} className="mt-10 space-y-10">
              <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900 mb-2">
                Tell us about your business
              </h2>

              {/* Revenue */}
              <div>
                <p className="font-semibold font-heading text-gray-900 mb-3">What's your annual revenue?</p>
                <div className="grid grid-cols-2 gap-3">
                  {REVENUE_OPTIONS.map((r) => (
                    <motion.button key={r.value} whileTap={{ scale: 0.97 }}
                      onClick={() => update({ revenue: r.value })}
                      className={`rounded-xl border-2 p-4 text-center text-sm font-medium cursor-pointer transition-all
                        ${data.revenue === r.value ? 'border-[#F7941D] bg-[#F7941D]/5 text-[#F7941D]' : 'border-gray-200 hover:border-[#F7941D] text-gray-700'}
                      `}>{r.label}</motion.button>
                  ))}
                </div>
              </div>

              {/* Industry */}
              <AnimatePresence>
                {subStep >= 1 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.35 }}>
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
                      {data.industry === 'other' && (
                        <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                          className="mt-3">
                          <input type="text" placeholder="Enter your industry..." value={data.otherIndustry || ''}
                            onChange={(e) => update({ otherIndustry: e.target.value })}
                            className="w-full rounded-xl border-2 border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 p-4 text-sm outline-none transition-all" />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* State */}
              <AnimatePresence>
                {subStep >= 2 && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} transition={{ duration: 0.35 }}>
                    <p className="font-semibold font-heading text-gray-900 mb-3">Where is your business based?</p>
                    <StateSelect value={data.state} onChange={(val) => update({ state: val })} />
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Continue → analyzing → your-plan */}
              <AnimatePresence>
                {revDone && indDone && stateDone && (
                  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="pt-4">
                    <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
                      onClick={handleContinue}
                      className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2">
                      See My Personalized Plan <ChevronRight size={18} />
                    </motion.button>
                    <p className="text-xs text-gray-400 text-center mt-3 font-body">
                      No email or phone required to see your plan.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
