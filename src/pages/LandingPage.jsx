import { useNavigate } from 'react-router-dom'
import { motion, useInView } from 'framer-motion'
import { useRef, useState, useEffect } from 'react'
import {
  ChevronRight, Shield, Award, Users as UsersIcon, ShieldCheck, Cpu,
  FileText, BarChart3, BookOpen, DollarSign, ArrowRight,
  ClipboardList, Zap, UserCheck, Star, CheckCircle2, RefreshCw, BadgeCheck,
} from 'lucide-react'
import Marquee from '../components/Marquee'
import TaxCalculator from '../components/TaxCalculator'

const fadeUp = { hidden: { opacity: 0, y: 24 }, visible: { opacity: 1, y: 0, transition: { duration: 0.5 } } }
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1 } } }

/* ── Reusable section heading ── */
function SectionHead({ eyebrow, title, sub, light }) {
  return (
    <motion.div variants={stagger} initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-60px' }}
      className="text-center mb-14 max-w-2xl mx-auto">
      {eyebrow && <motion.p variants={fadeUp} className="text-[#F7941D] text-xs font-bold tracking-[0.2em] uppercase mb-4">{eyebrow}</motion.p>}
      <motion.h2 variants={fadeUp} className={`text-3xl lg:text-4xl font-extrabold font-heading mb-4 leading-tight ${light ? 'text-white' : 'text-gray-900'}`}>{title}</motion.h2>
      {sub && <motion.p variants={fadeUp} className={`text-lg font-body leading-relaxed ${light ? 'text-gray-400' : 'text-gray-500'}`}>{sub}</motion.p>}
    </motion.div>
  )
}

/* ── Value prop card (BTP style) ── */
function ValueCard({ icon: Icon, title, desc, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#F7941D] hover:shadow-xl transition-all duration-300 flex flex-col">
      <div className="w-14 h-14 rounded-2xl bg-[#FFF4E6] flex items-center justify-center mb-5">
        <Icon size={24} className="text-[#F7941D]" />
      </div>
      <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-body">{desc}</p>
    </motion.div>
  )
}

/* ── How‐it‐works step card ── */
function StepCard({ num, icon: Icon, title, desc, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="relative bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#F7941D] hover:shadow-xl transition-all duration-300 flex flex-col items-center text-center">
      <div className="w-13 h-13 rounded-xl bg-[#F7941D] flex items-center justify-center mb-5 text-white font-extrabold text-lg font-heading">
        {num}
      </div>
      <div className="w-12 h-12 rounded-xl bg-[#FFF4E6] flex items-center justify-center mb-4">
        <Icon size={22} className="text-[#F7941D]" />
      </div>
      <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-body">{desc}</p>
    </motion.div>
  )
}

/* ── Service card ── */
function ServiceCard({ icon: Icon, title, desc, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className="bg-white rounded-2xl p-8 border border-gray-200 hover:border-[#F7941D] hover:shadow-xl transition-all duration-300">
      <div className="w-16 h-16 rounded-2xl bg-[#FFF4E6] flex items-center justify-center mb-5">
        <Icon size={28} className="text-[#F7941D]" />
      </div>
      <h3 className="text-lg font-bold font-heading text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-500 leading-relaxed font-body mb-4">{desc}</p>
      <span className="text-[#F7941D] text-sm font-semibold inline-flex items-center gap-1 cursor-pointer hover:gap-2 transition-all">
        Learn More <ArrowRight size={14} />
      </span>
    </motion.div>
  )
}

/* ── Team member card ── */
function TeamCard({ icon: Icon, title, desc, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="bg-white rounded-2xl p-6 border border-gray-200 flex gap-5 items-start hover:shadow-lg transition-all duration-300">
      <div className="w-12 h-12 rounded-xl bg-[#FFF4E6] flex items-center justify-center shrink-0">
        <Icon size={22} className="text-[#F7941D]" />
      </div>
      <div>
        <h3 className="font-bold font-heading text-gray-900 mb-1">{title}</h3>
        <p className="text-sm text-gray-500 leading-relaxed font-body">{desc}</p>
      </div>
    </motion.div>
  )
}

/* ── Testimonial card ── */
function TestimonialItem({ quote, name, company, delay }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.45, delay }}
      className="bg-white rounded-2xl p-8 border border-gray-200 flex flex-col">
      <div className="flex gap-1 mb-4">
        {[...Array(5)].map((_, i) => <Star key={i} size={16} className="fill-[#F7941D] text-[#F7941D]" />)}
      </div>
      <blockquote className="text-sm text-gray-600 leading-relaxed font-body italic flex-1 mb-5">"{quote}"</blockquote>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-[#FFF4E6] flex items-center justify-center">
          <span className="text-[#F7941D] font-bold text-sm">{name.charAt(0)}</span>
        </div>
        <div>
          <p className="font-semibold text-sm text-gray-900">{name}</p>
          <p className="text-xs text-[#F7941D]">{company}</p>
        </div>
      </div>
    </motion.div>
  )
}

/* ── Guarantee badge ── */
function GuaranteeBadge({ icon: Icon, title, desc }) {
  return (
    <div className="flex flex-col items-center text-center gap-3">
      <div className="w-14 h-14 rounded-2xl bg-[#10B981]/10 flex items-center justify-center">
        <Icon size={24} className="text-[#10B981]" />
      </div>
      <h4 className="font-semibold text-gray-900 text-sm font-heading">{title}</h4>
      <p className="text-xs text-gray-500 font-body">{desc}</p>
    </div>
  )
}


export default function LandingPage() {
  const nav = useNavigate()
  const [showMobileCta, setShowMobileCta] = useState(false)

  useEffect(() => {
    const fn = () => setShowMobileCta(window.scrollY > 400)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <>
      {/* ══════════════ HERO — BTP‐style centered with gradient bg ══════════════ */}
      <section className="relative overflow-hidden">
        {/* Gradient background — white → orange-light → white */}
        <div className="absolute inset-0 bg-gradient-to-b from-white via-[#FFF4E6] to-white" />
        {/* Decorative orbs */}
        <div className="absolute top-32 right-1/4 w-[500px] h-[500px] bg-[#F7941D]/8 rounded-full blur-[180px]" />
        <div className="absolute bottom-20 left-1/4 w-[400px] h-[400px] bg-[#F7941D]/6 rounded-full blur-[160px]" />

        <div className="relative z-10 max-w-4xl mx-auto px-6 pt-36 pb-24 lg:pt-44 lg:pb-32 text-center">
          {/* Badge */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
            className="inline-flex items-center gap-2 bg-white border border-[#F7941D]/30 rounded-full px-5 py-2 mb-8 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#10B981] animate-pulse" />
            <span className="text-xs font-semibold text-gray-700">Trusted by 50,000+ Small Businesses</span>
          </motion.div>

          <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25, duration: 0.6 }}
            className="text-4xl sm:text-5xl lg:text-[3.75rem] font-extrabold font-heading leading-[1.1] text-gray-900 mb-6">
            Stop Overpaying on Taxes.{' '}
            <span className="text-[#F7941D]">Start Growing Your Business.</span>
          </motion.h1>

          <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}
            className="text-lg lg:text-xl text-gray-500 max-w-2xl mx-auto mb-10 font-body leading-relaxed">
            Get a personalized accounting plan in 2 minutes. AI-powered bookkeeping, expert tax prep, and proactive advisory.
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.55 }}
            className="flex flex-col sm:flex-row gap-4 justify-center">
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => nav('/get-started')}
              className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold text-lg px-10 py-4 rounded-full shadow-[0_4px_14px_rgba(247,148,29,0.35)] hover:shadow-[0_6px_20px_rgba(247,148,29,0.45)] transition-all cursor-pointer inline-flex items-center justify-center gap-2">
              Get Your Custom Plan <ChevronRight size={20} />
            </motion.button>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' })}
              className="border-2 border-[#F7941D] text-[#F7941D] hover:bg-[#F7941D] hover:text-white font-semibold text-lg px-10 py-4 rounded-full transition-all cursor-pointer">
              See How It Works
            </motion.button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.7 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-sm text-gray-400">
            <span className="flex items-center gap-1.5"><Shield size={14} className="text-[#10B981]" /> SOC 2 Certified</span>
            <span className="text-gray-300">|</span>
            <span className="flex items-center gap-1.5"><Award size={14} className="text-[#10B981]" /> A- BBB Rating</span>
            <span className="text-gray-300">|</span>
            <span>50K+ Businesses Served</span>
          </motion.div>
        </div>
      </section>

      {/* ══════════════ SOCIAL PROOF MARQUEE ══════════════ */}
      <Marquee />

      {/* ══════════════ HOW IT WORKS ══════════════ */}
      <section id="how-it-works" className="bg-[#F9FAFB] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Simple Process"
            title="How It Works"
            sub="Get matched with the right accounting plan in 3 easy steps — no phone calls, no paperwork."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard num={1} icon={ClipboardList} title="Tell Us About Your Business"
              desc="Answer a few quick questions about your business, revenue, and goals. Takes about 2 minutes." delay={0} />
            <StepCard num={2} icon={Zap} title="Get Your Personalized Plan"
              desc="Our system analyzes your tax profile and recommends the perfect plan — tailored to your industry and state." delay={0.1} />
            <StepCard num={3} icon={UserCheck} title="Start Saving Immediately"
              desc="Pick up your plan or schedule a free call with a specialist. Either way, you start saving from day one." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ══════════════ VALUE PROPS ══════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Why Us"
            title="Why 50,000+ Businesses Choose Us"
            sub="We combine cutting-edge technology with real human expertise."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <ValueCard icon={ShieldCheck} title="Proactive Tax Advisory"
              desc="We don't just file — we find savings year-round and plan ahead so you never overpay." delay={0} />
            <ValueCard icon={Cpu} title="AI-Powered Bookkeeping"
              desc="Automated transaction categorization, real-time P&L, and financial insights — without the spreadsheets." delay={0.1} />
            <ValueCard icon={UsersIcon} title="Dedicated Expert Team"
              desc="A real CPA or EA who knows your business by name, available when you need them." delay={0.2} />
          </div>
        </div>
      </section>

      {/* ══════════════ YOUR TEAM ══════════════ */}
      <section className="bg-[#F9FAFB] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Your Team"
            title="A Team of Experts, Dedicated to Your Success"
            sub="Good accountants answer questions. Great ones prevent them."
          />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <TeamCard icon={FileText} title="Tax Preparer"
              desc="Handles your tax filings accurately and on time, maximizing deductions and ensuring compliance." delay={0} />
            <TeamCard icon={DollarSign} title="Payroll Manager"
              desc="Manages employee payments, tax withholdings, and payroll compliance so your team gets paid correctly, every time." delay={0.1} />
            <TeamCard icon={BookOpen} title="Bookkeeper"
              desc="Keeps your financial records organized and up-to-date so you always know where your business stands." delay={0.2} />
            <TeamCard icon={BarChart3} title="Tax Advisor"
              desc="Develops proactive tax strategies throughout the year to minimize your tax burden and support your business goals." delay={0.3} />
          </div>
        </div>
      </section>

      {/* ══════════════ SERVICES ══════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Services"
            title="Everything Your Business Needs"
            sub="From tax prep to payroll, we've got every aspect of your finances covered."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <ServiceCard icon={FileText} title="Tax Preparation"
              desc="We maximize your deductions, ensure compliance, and handle all filings so you never worry about tax season." delay={0} />
            <ServiceCard icon={BarChart3} title="Tax Advisory"
              desc="Get proactive tax strategies and financial insights that help you make smarter decisions and keep more of what you earn." delay={0.1} />
            <ServiceCard icon={BookOpen} title="Bookkeeping"
              desc="Your books stay accurate and up-to-date every month, giving you real-time clarity on your business finances." delay={0.2} />
            <ServiceCard icon={DollarSign} title="Payroll"
              desc="We handle employee payments, tax withholdings, and compliance so your team gets paid correctly and on time." delay={0.3} />
          </div>
        </div>
      </section>

      {/* ══════════════ TAX CALCULATOR ══════════════ */}
      <TaxCalculator />

      {/* ══════════════ TESTIMONIALS ══════════════ */}
      <section className="bg-white py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead
            eyebrow="Testimonials"
            title="See Why 50,000+ Small Businesses Trust Us"
            sub="Real stories from real business owners who've transformed their finances."
          />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <TestimonialItem
              quote="I have been with 1-800Accountant for 10+ years. Her professional and compassionate demeanor is unparalleled, and her follow-through is exceptional."
              name="Carrie Stone" company="Massage Logic LLC" delay={0} />
            <TestimonialItem
              quote="I highly recommend 1-800Accountant, especially for new business owners. They meet customers where they are and have a knack for understanding your knowledge level."
              name="Ramona Duarte" company="Kreative Kayoss" delay={0.1} />
            <TestimonialItem
              quote="I love it because their portal for entering, uploading docs, and asking questions is open 24/7! It is like having an accounting team by your side!"
              name="Michael Meola" company="MJM Consulting Services" delay={0.2} />
          </div>
        </div>
      </section>

      {/* ══════════════ GUARANTEES ══════════════ */}
      <section className="bg-[#F9FAFB] py-20 lg:py-28">
        <div className="max-w-7xl mx-auto px-6">
          <SectionHead title="Our Guarantees" sub="Your trust is everything. Here's how we earn it." />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <GuaranteeBadge icon={Shield} title="SOC 2 Certified" desc="Enterprise-grade data security" />
            <GuaranteeBadge icon={Award} title="A- BBB Rating" desc="Verified business excellence" />
            <GuaranteeBadge icon={RefreshCw} title="Cancel Anytime" desc="No long-term contracts" />
            <GuaranteeBadge icon={BadgeCheck} title="30-Day Money-Back" desc="100% satisfaction guaranteed" />
          </div>
        </div>
      </section>

      {/* ══════════════ FINAL CTA — dark BTP style ══════════════ */}
      <section id="pricing-section" className="relative py-20 lg:py-28 bg-gradient-to-br from-[#1a1a2e] via-[#2a2a3a] to-[#2d2d44] overflow-hidden">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-[#F7941D]/10 rounded-full blur-[200px]" />
        <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <motion.h2 initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-heading mb-4 leading-tight">
            Ready to stop leaving money on the table?
          </motion.h2>
          <motion.p initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-gray-400 text-lg font-body mb-8 max-w-xl mx-auto">
            What's your time worth? Stop spending it on spreadsheets and tax codes — let us handle the numbers while you grow your business.
          </motion.p>
          <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            onClick={() => nav('/get-started')}
            className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold text-lg px-10 py-4 rounded-full shadow-[0_4px_14px_rgba(247,148,29,0.35)] transition-all cursor-pointer inline-flex items-center gap-2">
            Get Your Custom Plan <ChevronRight size={20} />
          </motion.button>
          <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-gray-500">
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#F7941D]" /> Free consultation</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#F7941D]" /> No credit card required</span>
            <span className="flex items-center gap-1.5"><CheckCircle2 size={14} className="text-[#F7941D]" /> Cancel anytime</span>
          </div>
        </div>
      </section>

      {/* ══════════════ STICKY MOBILE CTA ══════════════ */}
      {showMobileCta && (
        <div className="fixed bottom-0 inset-x-0 z-40 lg:hidden bg-white border-t border-gray-200 p-3 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]">
          <button onClick={() => nav('/get-started')}
            className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-3.5 rounded-full transition-all flex items-center justify-center gap-2 cursor-pointer">
            Get Your Custom Plan <ChevronRight size={18} />
          </button>
        </div>
      )}
    </>
  )
}
