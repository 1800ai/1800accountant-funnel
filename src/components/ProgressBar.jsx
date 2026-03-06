import { motion } from 'framer-motion'
import { Check } from 'lucide-react'

const labels = ['Business', 'Details', 'Contact']

export default function ProgressBar({ step }) {
  return (
    <div className="flex items-center justify-center gap-3 py-6">
      {labels.map((l, i) => {
        const num = i + 1
        const done = step > num
        const active = step === num
        return (
          <div key={l} className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <motion.div
                animate={{ scale: active ? 1.1 : 1 }}
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-colors
                  ${done ? 'bg-[#10B981] text-white' : active ? 'bg-[#F7941D] text-white' : 'bg-gray-200 text-gray-400'}
                `}>
                {done ? <Check size={14} /> : num}
              </motion.div>
              <span className={`text-sm font-medium hidden sm:inline ${active ? 'text-gray-900' : 'text-gray-400'}`}>{l}</span>
            </div>
            {i < labels.length - 1 && <div className={`w-8 lg:w-16 h-0.5 ${done ? 'bg-[#10B981]' : 'bg-gray-200'}`} />}
          </div>
        )
      })}
    </div>
  )
}
