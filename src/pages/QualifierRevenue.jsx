import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { REVENUE_OPTIONS } from '../utils/industries'
import ProgressBar from '../components/ProgressBar'

export default function QualifierRevenue() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const select = (val) => {
    update({ revenue: val })
    setTimeout(() => nav('/get-started/industry'), 400)
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <ProgressBar step={2} />

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          className="mt-10">
          <button onClick={() => nav('/get-started')}
            className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
            <ArrowLeft size={16} /> Back
          </button>

          <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900 mb-2">
            What's your annual revenue?
          </h2>
          <p className="text-gray-500 text-center font-body mb-8">This helps us match you with the right plan.</p>

          <div className="grid grid-cols-2 gap-3">
            {REVENUE_OPTIONS.map((r) => {
              const sel = data.revenue === r.value
              return (
                <motion.button key={r.value} whileTap={{ scale: 0.97 }}
                  onClick={() => select(r.value)}
                  className={`relative rounded-xl border-2 p-5 text-center text-sm font-medium cursor-pointer transition-all
                    ${sel ? 'border-[#F7941D] bg-[#F7941D]/5 text-[#F7941D]' : 'border-gray-200 hover:border-[#F7941D] text-gray-700'}
                  `}>
                  {sel && (
                    <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', stiffness: 300 }}
                      className="absolute top-2 right-2 w-5 h-5 bg-[#F7941D] rounded-full flex items-center justify-center">
                      <Check size={11} className="text-white" />
                    </motion.div>
                  )}
                  {r.label}
                </motion.button>
              )
            })}
          </div>
        </motion.div>
      </div>
    </div>
  )
}
