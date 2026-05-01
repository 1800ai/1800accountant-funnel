import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Check, Calendar, Mail, MessageCircle, Phone } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'

const PLAN_NAMES = { basic: 'Do-It-Yourself', pro: 'Do-It-With-Me' }
const ENTITY_LABELS = { llc: 'LLC', 's-corp': 'S-Corporation', 'c-corp': 'C-Corporation', 'sole-prop': 'Sole Proprietorship' }

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
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      r: Math.random() * 6 + 3,
      d: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      tilt: Math.random() * 10 - 5,
      tiltInc: Math.random() * 0.07 + 0.05,
      rot: Math.random() * Math.PI * 2,
    }))
    let frame = 0
    const maxFrames = 180
    const draw = () => {
      if (frame > maxFrames) { ctx.clearRect(0, 0, canvas.width, canvas.height); return }
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      const alpha = frame > maxFrames - 40 ? (maxFrames - frame) / 40 : 1
      ctx.globalAlpha = alpha
      pieces.forEach((p) => {
        ctx.save()
        ctx.translate(p.x, p.y)
        ctx.rotate(p.rot)
        ctx.fillStyle = p.color
        ctx.fillRect(-p.r / 2, -p.r, p.r, p.r * 2)
        ctx.restore()
        p.y += p.d
        p.x += Math.sin(p.tilt) * 0.8
        p.tilt += p.tiltInc
        p.rot += 0.03
      })
      frame++
      requestAnimationFrame(draw)
    }
    draw()
  }, [])
  return <canvas ref={canvasRef} className="confetti-canvas" />
}

function TimelineStep({ icon: Icon, text, cta, onClick, delay }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-[#F7941D]/10 flex items-center justify-center">
        <Icon size={18} className="text-[#F7941D]" />
      </div>
      <div className="flex-1 pt-1">
        <p className="text-gray-700 font-body text-sm leading-relaxed">{text}</p>
        {cta && (
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={onClick}
            className="mt-2 bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer inline-flex items-center gap-1.5">
            {cta}
          </motion.button>
        )}
      </div>
    </motion.div>
  )
}

export default function Confirmation() {
  const { data } = useFunnel()
  const nav = useNavigate()

  const planName = PLAN_NAMES[data.selectedPlan] || 'your'
  const firstName = (data.fullName || '').trim().split(/\s+/)[0]
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || data.industry || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const entityLabel = data.hasExistingBusiness === false ? ENTITY_LABELS[data.entityType] : null

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <Confetti />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
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
          className="text-gray-500 text-lg font-body">
          Your {planName} plan is now active{entityLabel ? ` and we're filing your ${entityLabel} in ${stateName} now.` : '.'}
        </motion.p>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
          className="mt-10 text-left max-w-md mx-auto">
          <p className="font-semibold font-heading text-gray-900 mb-6">Next Steps</p>
          <div className="space-y-6">
            <TimelineStep icon={Calendar}
              text="Schedule your free onboarding appointment"
              cta="Schedule Now" onClick={() => nav('/schedule')} delay={0.7} />
            <TimelineStep icon={Mail}
              text={`Check ${data.email || 'your email'} for your welcome guide and login details`} delay={0.8} />
            <TimelineStep icon={MessageCircle}
              text={`Your ${industryLabel.toLowerCase()} support team is standing by — reach out anytime`} delay={0.9} />
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-500">
          <Phone size={16} className="text-[#F7941D]" />
          <span className="text-sm font-body">Questions? Call us at <a href="tel:18002228462" className="text-[#F7941D] font-medium hover:underline">1-800-ACCOUNTANT</a></span>
        </motion.div>
      </div>
    </div>
  )
}
