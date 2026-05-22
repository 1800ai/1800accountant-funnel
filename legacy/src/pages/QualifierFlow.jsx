import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Building2, Rocket, Check } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import ProgressBar from '../components/ProgressBar'

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

export default function QualifierFlow() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const select = (val) => {
    update({ hasExistingBusiness: val })
    setTimeout(() => nav('/get-started/revenue'), 400)
  }

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <ProgressBar step={1} />

        <motion.div initial={{ opacity: 0, x: 40 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}
          className="mt-10">
          <h2 className="text-2xl lg:text-3xl font-bold font-heading text-center text-gray-900 mb-8">
            First, do you already have a registered business?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <BusinessCard icon={Building2} title="Yes, I have a business"
              subtitle="I'm looking for tax & accounting support"
              selected={data.hasExistingBusiness === true}
              onClick={() => select(true)} />
            <BusinessCard icon={Rocket} title="Not yet — I'm just getting started"
              subtitle="I want to form my business and get set up right"
              selected={data.hasExistingBusiness === false}
              onClick={() => select(false)} />
          </div>
        </motion.div>
      </div>
    </div>
  )
}
