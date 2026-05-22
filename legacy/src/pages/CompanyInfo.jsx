import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Lock } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

function FloatingInput({ label, type = 'text', value, onChange, error, multiline }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value
  const Tag = multiline ? 'textarea' : 'input'

  return (
    <div className="relative">
      <label className={`absolute left-4 transition-all duration-200 pointer-events-none
        ${active ? 'top-1.5 text-[10px] font-medium text-[#F7941D]' : 'top-4 text-sm text-gray-400'}
      `}>{label}</label>
      <Tag
        {...(multiline ? { rows: 3 } : { type })}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full rounded-xl border-2 p-4 pt-5 text-sm outline-none transition-all font-body resize-none
          ${error ? 'border-red-400 ring-2 ring-red-400/20' : focused ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : 'border-gray-200'}
        `}
      />
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  )
}

export default function CompanyInfo() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [errors, setErrors] = useState({})

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = {}
    if (!data.companyName?.trim()) errs.companyName = 'Required'
    if (!data.businessAddress?.trim()) errs.businessAddress = 'Required'
    if (!data.businessPurpose?.trim()) errs.businessPurpose = 'Tell us briefly what your business does'
    setErrors(errs)
    if (Object.keys(errs).length === 0) nav('/members')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={() => nav('/entity-type')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-2">Tell us about your business.</h1>
          <p className="text-gray-500 font-body">We'll use this to file your formation paperwork.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <FloatingInput label="Business Name (e.g. Acme Holdings LLC)"
            value={data.companyName || ''}
            onChange={(v) => { update({ companyName: v }); setErrors((e) => ({ ...e, companyName: undefined })) }}
            error={errors.companyName} />

          <FloatingInput label="Business Address (Street, City, State, Zip)"
            value={data.businessAddress || ''}
            onChange={(v) => { update({ businessAddress: v }); setErrors((e) => ({ ...e, businessAddress: undefined })) }}
            error={errors.businessAddress} />

          <FloatingInput label="What does your business do?" multiline
            value={data.businessPurpose || ''}
            onChange={(v) => { update({ businessPurpose: v }); setErrors((e) => ({ ...e, businessPurpose: undefined })) }}
            error={errors.businessPurpose} />

          <div className="flex items-center gap-2 text-xs text-gray-400 font-body pt-2">
            <Lock size={14} /> Encrypted and never sold. Used only to file with your state.
          </div>

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2">
            Continue <ChevronRight size={18} />
          </motion.button>
        </form>
      </div>
    </div>
  )
}
