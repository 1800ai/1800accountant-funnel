import { useState, useEffect, useRef } from 'react'
import { motion, useInView } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { DollarSign, Users, Percent, ChevronRight } from 'lucide-react'

function AnimatedNum({ value, active }) {
  const [d, setD] = useState(0)
  const ref = useRef(null)
  useEffect(() => {
    if (!active) return
    const start = d; const end = value; const dur = 800; const t0 = performance.now()
    const tick = (now) => {
      const p = Math.min((now - t0) / dur, 1)
      setD(Math.round(start + (end - start) * (1 - Math.pow(1 - p, 3))))
      if (p < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(ref.current)
  }, [value, active])
  return <span>${d.toLocaleString()}</span>
}

function Slider({ icon: Icon, label, val, display, min, max, step, onChange }) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="text-white/80 font-medium flex items-center gap-2 text-sm">
          <Icon size={18} className="text-[#F7941D]" />{label}
        </label>
        <span className="text-[#F7941D] font-bold tabular-nums">{display}</span>
      </div>
      <input type="range" min={min} max={max} step={step} value={val} onChange={(e) => onChange(+e.target.value)} />
      <div className="flex justify-between text-xs text-white/30">
        <span>{min === 50000 ? '$50K' : min === 1 ? '1' : '15%'}</span>
        <span>{max === 2000000 ? '$2M+' : max === 100 ? '100+' : '40%'}</span>
      </div>
    </div>
  )
}

export default function TaxCalculator() {
  const [rev, setRev] = useState(200000)
  const [emp, setEmp] = useState(5)
  const [rate, setRate] = useState(25)
  const nav = useNavigate()
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-80px' })
  const savings = Math.round(rev * (rate / 100) * 0.18 + emp * 500)

  return (
    <section ref={ref} className="relative py-20 lg:py-28 bg-gradient-to-br from-[#1a1a2e] to-[#111827] noise-overlay overflow-hidden">
      <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] bg-[#F7941D]/10 rounded-full blur-[160px] animate-orb" />
      <div className="relative z-10 max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.5 }}
          className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-extrabold text-white font-heading mb-3">See How Much You Could Save</h2>
          <p className="text-gray-400 text-lg font-body">Adjust the sliders to estimate your annual tax savings.</p>
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15, duration: 0.5 }}
          className="bg-white/[0.06] border border-white/10 rounded-2xl p-8 lg:p-10 space-y-10">
          <Slider icon={DollarSign} label="Annual Revenue" val={rev} display={`$${rev.toLocaleString()}`} min={50000} max={2000000} step={10000} onChange={setRev} />
          <Slider icon={Users} label="Number of Employees" val={emp} display={String(emp)} min={1} max={100} step={1} onChange={setEmp} />
          <Slider icon={Percent} label="Current Tax Rate" val={rate} display={`${rate}%`} min={15} max={40} step={1} onChange={setRate} />
          <div className="pt-8 border-t border-white/10 text-center">
            <p className="text-gray-400 text-sm mb-2 font-body">Estimated Annual Savings</p>
            <div className="text-5xl font-extrabold text-[#10B981] font-heading"><AnimatedNum value={savings} active={inView} /></div>
            <p className="text-white/30 text-sm mt-2 font-body">per year with proactive tax planning</p>
          </div>
          <div className="text-center">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => nav('/get-started')}
              className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold text-lg px-8 py-4 rounded-full transition-all cursor-pointer inline-flex items-center gap-2">
              Get Your Custom Plan <ChevronRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
