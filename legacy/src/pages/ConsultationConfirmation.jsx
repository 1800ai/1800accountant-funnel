import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Check, Calendar, Video, Receipt, MapPin, Briefcase, Building2, Phone, Sparkles } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { US_STATES } from '../utils/states'
import { getRevenueLabel, isUnderFiftyK } from '../utils/recommendations'

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

function AgendaItem({ icon: Icon, title, detail, delay }) {
  return (
    <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay }}
      className="flex gap-4">
      <div className="shrink-0 w-10 h-10 rounded-full bg-[#F7941D]/10 flex items-center justify-center">
        <Icon size={18} className="text-[#F7941D]" />
      </div>
      <div className="flex-1 pt-0.5">
        <p className="text-gray-900 font-semibold font-heading text-sm mb-1">{title}</p>
        <p className="text-gray-500 font-body text-sm leading-relaxed">{detail}</p>
      </div>
    </motion.div>
  )
}

export default function ConsultationConfirmation() {
  const { data } = useFunnel()
  const firstName = (data.fullName || '').trim().split(/\s+/)[0]
  const industryLabel = data.industry === 'other'
    ? (data.otherIndustry || 'your industry')
    : (INDUSTRIES.find((i) => i.id === data.industry)?.label || 'your industry')
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'
  const revLabel = getRevenueLabel(data.revenue)
  const under = isUnderFiftyK(data.revenue)

  const ENTITY_LABELS = { llc: 'LLC', 's-corp': 'S-Corporation', 'c-corp': 'C-Corporation', 'sole-prop': 'Sole Proprietorship' }
  const entityLabel = data.hasExistingBusiness === false ? ENTITY_LABELS[data.entityType] : null

  return (
    <div className="min-h-screen bg-white pt-28 pb-20">
      <Confetti />
      <div className="max-w-2xl mx-auto px-6 text-center relative z-10">
        {/* Animated Checkmark */}
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 260, damping: 20, delay: 0.2 }}
          className="w-20 h-20 mx-auto bg-[#10B981] rounded-full flex items-center justify-center mb-8">
          <Check size={36} className="text-white" strokeWidth={3} />
        </motion.div>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
          className="text-3xl lg:text-4xl font-extrabold font-heading text-gray-900 mb-3">
          You're booked{firstName ? `, ${firstName}` : ''}.
        </motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.45 }}
          className="text-gray-500 text-lg font-body max-w-md mx-auto">
            A 30-minute Google Meet with a tax specialist — tailored to {industryLabel.toLowerCase()} businesses in {stateName}{revLabel ? ` generating ${revLabel}` : ''}.
        </motion.p>

        {/* Booking summary */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
          className="mt-8 bg-[#F9FAFB] rounded-2xl p-6 lg:p-8 text-left max-w-md mx-auto border border-gray-100">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar size={18} className="text-[#F7941D]" />
              <div>
                <p className="font-semibold font-heading text-gray-900 text-sm">{data.selectedDate || 'Date TBD'}</p>
                <p className="text-sm text-[#F7941D] font-medium">{data.selectedTime || 'Time TBD'} EST</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Video size={18} className="text-[#F7941D]" />
              <p className="text-sm text-gray-600">Via Google Meet — link sent to {data.email || 'your email'}</p>
            </div>
          </div>
        </motion.div>

        {/* Personalized agenda */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.7 }}
          className="mt-10 text-left max-w-md mx-auto">
          <p className="font-semibold font-heading text-gray-900 mb-6 flex items-center gap-2">
            <Sparkles size={16} className="text-[#F7941D]" />
            Your specialist already has your context. We'll cover:
          </p>
          <div className="space-y-6">
            <AgendaItem icon={Receipt}
              title={`Tax savings opportunities for ${industryLabel.toLowerCase()}`}
              detail={`Deductions and credits other ${industryLabel.toLowerCase()} owners commonly miss — including industry-specific write-offs you may qualify for.`}
              delay={0.8} />
            <AgendaItem icon={MapPin}
              title={`${stateName}-specific strategies`}
              detail={`Your specialist knows the ${stateName} tax code and any local credits or programs you may qualify for.`}
              delay={0.9} />
            <AgendaItem icon={Briefcase}
              title="The right plan for your business"
              detail={`We'll review what makes sense at ${revLabel || 'your revenue level'} — whether that's our ${under ? 'Do-It-With-Me' : 'Core Accounting or Business Complete'} package, or something custom. No upsell games.`}
              delay={1.0} />
            {data.hasExistingBusiness === false && (
              <AgendaItem icon={Building2}
                title="Entity structure recommendations"
                detail={entityLabel
                  ? `Whether ${entityLabel} is the right fit for your situation — or if a different structure would save you more.`
                  : `LLC vs S-Corp vs C-Corp — we'll walk through which structure fits your ${industryLabel.toLowerCase()} business best.`}
                delay={1.1} />
            )}
          </div>
        </motion.div>

        <motion.button initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}
          className="mt-10 bg-[#1a1a2e] hover:bg-[#2d2d44] text-white font-semibold py-3 px-6 rounded-full transition-all cursor-pointer text-sm inline-flex items-center gap-2">
          <Calendar size={16} /> Add to Calendar
        </motion.button>

        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }}
          className="mt-12 flex items-center justify-center gap-2 text-gray-500">
          <Phone size={16} className="text-[#F7941D]" />
          <span className="text-sm font-body">Questions? Call us at <a href="tel:18002228462" className="text-[#F7941D] font-medium hover:underline">1-800-ACCOUNTANT</a></span>
        </motion.div>
      </div>
    </div>
  )
}
