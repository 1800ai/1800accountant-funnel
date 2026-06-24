import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, ChevronRight, Lock } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

// "Business name" step — single field per QA. Lives at /intake/business-name.
export default function BusinessName() {
  const navigate = useNavigate()
  const { data, update } = useFunnel()
  const [focused, setFocused] = useState(false)
  const [error, setError] = useState('')
  const value = data.companyName || ''
  const active = focused || value

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!value.trim()) {
      setError('Required')
      return
    }
    navigate('/intake/checkout')
  }

  return (
    <div className="min-h-screen bg-white py-10 md:py-12">
      <div className="max-w-lg mx-auto px-6">
        <button onClick={() => navigate('/intake/packages')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-2">
            What do you want to call your business?
          </h1>
          <p className="text-gray-500 font-body">We'll file your LLC under this name. You can always change it later.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className={`absolute left-4 transition-all duration-200 pointer-events-none
              ${active ? 'top-1.5 text-[10px] font-medium text-[#F7941D]' : 'top-4 text-sm text-gray-400'}
            `}>Business Name</label>
            <input type="text" autoFocus value={value}
              onChange={(e) => { update({ companyName: e.target.value }); if (error) setError('') }}
              onFocus={() => setFocused(true)} onBlur={() => setFocused(false)}
              className={`w-full rounded-xl border-2 p-4 pt-5 text-sm outline-none transition-all font-body
                ${error ? 'border-red-400 ring-2 ring-red-400/20' : focused ? 'border-[#F7941D] ring-2 ring-[#F7941D]/20' : 'border-gray-200'}
              `} />
            {error && <p className="text-red-500 text-xs mt-1 ml-1">{error}</p>}
          </div>

          <div className="flex items-center gap-2 text-xs text-gray-400 font-body pt-2">
            <Lock size={14} /> Used only to file with your state.
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
