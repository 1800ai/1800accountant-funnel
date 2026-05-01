import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Lock, Calendar, Video, Check } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

function FloatingInput({ label, type = 'text', value, onChange, error, validate, autoComplete }) {
  const [focused, setFocused] = useState(false)
  const active = focused || value
  const valid = validate ? validate(value) : value.length > 0
  const showCheck = value && valid && !error

  return (
    <div className="relative">
      <label className={`absolute left-4 transition-all duration-200 pointer-events-none
        ${active ? 'top-1.5 text-[10px] font-medium text-[#F7941D]' : 'top-4 text-sm text-gray-400'}
      `}>{label}</label>
      <input type={type} value={value}
        autoComplete={autoComplete}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
        className={`w-full rounded-xl border-2 p-4 pt-5 text-sm outline-none transition-all font-body
          ${error ? 'border-red-400 ring-2 ring-red-400/20' : focused ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : 'border-gray-200'}
        `} />
      {showCheck && (
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 bg-[#10B981] rounded-full flex items-center justify-center">
          <Check size={12} className="text-white" />
        </motion.div>
      )}
      {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
    </div>
  )
}

const formatPhone = (val) => {
  const nums = val.replace(/\D/g, '').slice(0, 10)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `(${nums.slice(0, 3)}) ${nums.slice(3)}`
  return `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`
}
const validateEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)
const validatePhone = (p) => p.replace(/\D/g, '').length === 10

export default function LeadForm() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [errors, setErrors] = useState({})

  const handleSubmit = () => {
    const errs = {}
    if (!data.fullName?.trim()) errs.fullName = 'Required'
    if (!validateEmail(data.email || '')) errs.email = 'Enter a valid email'
    if (!validatePhone(data.phone || '')) errs.phone = 'Enter a 10-digit phone number'
    setErrors(errs)
    if (Object.keys(errs).length === 0) nav('/welcome')
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-lg mx-auto px-6">
        <button onClick={() => nav('/schedule')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-2">
            Where should we send your Google Meet link?
          </h1>
          <p className="text-gray-500 font-body">One last step — three quick fields and you're booked.</p>
        </motion.div>

        {data.selectedDate && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="bg-[#F9FAFB] rounded-2xl p-5 mb-6 border border-gray-200">
            <div className="flex items-center gap-3 text-sm text-gray-900">
              <Calendar size={16} className="text-[#F7941D]" />
              <span className="font-medium">{data.selectedDate} at <span className="text-[#F7941D]">{data.selectedTime} EST</span></span>
            </div>
            <div className="flex items-center gap-3 text-sm text-gray-500 mt-2">
              <Video size={16} className="text-[#F7941D]" />
              <span>30-minute Google Meet</span>
            </div>
          </motion.div>
        )}

        <div className="space-y-5">
          <FloatingInput label="Full Name" autoComplete="name"
            value={data.fullName || ''}
            onChange={(v) => { update({ fullName: v }); setErrors((e) => ({ ...e, fullName: undefined })) }}
            error={errors.fullName} />
          <FloatingInput label="Email Address" type="email" autoComplete="email"
            value={data.email || ''}
            onChange={(v) => { update({ email: v }); setErrors((e) => ({ ...e, email: undefined })) }}
            error={errors.email} validate={validateEmail} />
          <FloatingInput label="Phone Number" type="tel" autoComplete="tel"
            value={data.phone || ''}
            onChange={(v) => { update({ phone: formatPhone(v) }); setErrors((e) => ({ ...e, phone: undefined })) }}
            error={errors.phone} validate={validatePhone} />
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400 font-body mt-4">
          <Lock size={14} /> Encrypted and never sold.
        </div>

        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleSubmit}
          className="w-full mt-6 bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg">
          Confirm My Free Consultation
        </motion.button>
      </div>
    </div>
  )
}
