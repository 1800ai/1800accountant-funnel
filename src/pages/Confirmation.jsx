import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Users, Calendar, Phone } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'

// /intake/welcome — post-checkout greeting. EF customers continue to /members.
// Has-business customers skip members and continue straight to /schedule.
function Confetti() {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight
    const colors = ['#F7941D', '#10B981', '#307CFF', '#FFD700', '#FF6B6B']
    const pieces = Array.from({ length: 80 }, () => ({
      x: Math.random() * canvas.width, y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3, d: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5, tiltInc: Math.random() * 0.07 + 0.05, rot: Math.random() * Math.PI * 2,
    }))
    let frame = 0
    const maxFrames = 180
    const draw = () => {
      if (frame > maxFrames) { ctx.clearRect(0, 0, canvas.width, canvas.height); return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alpha = frame > maxFrames - 40 ? (maxFrames - frame) / 40 : 1
      ctx.globalAlpha = alpha
      pieces.forEach((p) => {
        ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r, p.r, p.r * 2); ctx.restore()
        p.y += p.d; p.x += Math.sin(p.tilt) * 0.8; p.tilt += p.tiltInc; p.rot += 0.03
      })
      frame++; requestAnimationFrame(draw)
    }
    draw()
  }, [])
  return <canvas ref={canvasRef} className="confetti-canvas" />
}

export default function Welcome() {
  const { data } = useFunnel()
  const nav = useNavigate()
  const firstName = (data.fullName || '').trim().split(/\s+/)[0]
  const noEntity = data.hasExistingBusiness === false
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'

  const handleContinue = () => {
    if (noEntity) nav('/intake/members')
    else nav('/intake/schedule')
  }

  // EF flow next-steps: members → schedule → confirmation
  // Has-business flow next-steps: schedule → confirmation
  const steps = noEntity
    ? [
        { icon: Users,    label: 'Confirm your business members', detail: `Names + ownership % for the LLC we're forming in ${stateName}.` },
        { icon: Calendar, label: 'Schedule your onboarding call', detail: 'Meet your dedicated tax expert and get set up for your first year.' },
      ]
    : [
        { icon: Calendar, label: 'Schedule your onboarding call', detail: 'Meet your dedicated tax expert and walk through your first quarter.' },
      ]

  return (
    <div className="min-h-screen bg-white py-10 md:py-16 px-4 relative">
      <Confetti />
      <div className="max-w-2xl mx-auto text-center relative z-10">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-[#10B981] rounded-full flex items-center justify-center mb-8">
          <Check size={36} className="text-white" strokeWidth={3} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3">
          Welcome to 1-800Accountant{firstName ? `, ${firstName}` : ''}!
        </motion.h1>

        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}
          className="text-gray-500 text-lg font-body max-w-lg mx-auto mb-10">
          {noEntity
            ? `Your plan is active and we're getting ready to file your business. Two quick things before you're done:`
            : `Your plan is active. One last step:`}
        </motion.p>

        {/* Next steps */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="text-left max-w-md mx-auto space-y-4 mb-10">
          {steps.map((s, i) => (
            <motion.div key={s.label}
              initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.7 + i * 0.1 }}
              className="flex gap-4 items-start bg-[#F9FAFB] rounded-2xl p-5 border border-gray-100">
              <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center shrink-0">
                <s.icon size={18} className="text-[#F7941D]" />
              </div>
              <div>
                <p className="font-semibold font-heading text-gray-900 mb-0.5">Step {i + 1}: {s.label}</p>
                <p className="text-sm text-gray-500 font-body leading-relaxed">{s.detail}</p>
              </div>
            </motion.div>
          ))}
        </motion.div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.0 }}
          whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={handleContinue}
          className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 px-10 rounded-full transition-all cursor-pointer text-lg inline-flex items-center gap-2 shadow-[0_4px_20px_rgba(247,148,29,0.4)]">
          {noEntity ? 'Confirm member info' : 'Schedule onboarding'} <ArrowRight size={18} />
        </motion.button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-500">
          <Phone size={16} className="text-[#F7941D]" />
          <span className="text-sm font-body">Questions? <a href="tel:18002228462" className="text-[#F7941D] font-medium hover:underline">1-800-ACCOUNTANT</a></span>
        </motion.div>
      </div>
    </div>
  )
}
