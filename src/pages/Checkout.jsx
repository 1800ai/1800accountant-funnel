import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Check, CreditCard } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

const PLAN_INFO = {
  basic: { name: 'Do-It-Yourself', price: 19, annualPrice: '228', features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings'] },
  pro: { name: 'Do-It-With-Me', price: 29, annualPrice: '348', features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'CPA Review of Taxes', 'Payroll Setup', 'Tax Hotline'] },
  premium: { name: 'Full-Service', price: 249, annualPrice: '2,988', features: ['Done-for-you Business Taxes', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Done-for-you Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'Payroll Setup', 'Dedicated Accountant', 'Year-round Tax Advice', 'Proactive Tax Planning', 'Quarterly Reviews'] },
}

function formatCardNumber(val) {
  const nums = val.replace(/\D/g, '').slice(0, 16)
  return nums.replace(/(.{4})/g, '$1 ').trim()
}

function getCardType(num) {
  const n = num.replace(/\D/g, '')
  if (n.startsWith('4')) return 'Visa'
  if (/^5[1-5]/.test(n) || /^2[2-7]/.test(n)) return 'Mastercard'
  if (n.startsWith('3') && (n[1] === '4' || n[1] === '7')) return 'Amex'
  return null
}

export default function Checkout() {
  const { data } = useFunnel()
  const nav = useNavigate()
  const plan = PLAN_INFO[data.selectedPlan] || PLAN_INFO.pro
  const noEntity = data.hasExistingBusiness === false

  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState(data.fullName || '')
  const [zip, setZip] = useState('')
  const [promo, setPromo] = useState('')
  const [loading, setLoading] = useState(false)

  const cardType = getCardType(card)

  const handleExpiry = (val) => {
    let nums = val.replace(/\D/g, '').slice(0, 4)
    if (nums.length > 2) nums = nums.slice(0, 2) + '/' + nums.slice(2)
    setExpiry(nums)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => nav('/welcome'), 1800)
  }

  const handleExpress = () => {
    setLoading(true)
    setTimeout(() => nav('/welcome'), 1200)
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-5xl mx-auto px-6">
        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl lg:text-3xl font-extrabold font-heading text-gray-900 mb-10">
          Complete Your Purchase
        </motion.h1>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* LEFT: Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex-1">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              {/* Express Checkout */}
              <div className="space-y-3 mb-6">
                {/* Apple Pay */}
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleExpress} disabled={loading}
                  className="w-full bg-black text-white py-3.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors disabled:opacity-60">
                  <svg viewBox="0 0 165 40" className="h-5 w-auto" fill="white">
                    <path d="M35.68 10.54c-2.1 2.48-5.49 4.4-8.86 4.14-.42-3.28 1.19-6.77 3.06-8.92C32 3.26 35.6 1.54 38.56 1.4c.36 3.39-1 6.73-2.88 9.14z"/>
                    <path d="M38.52 12.05c-4.9-.28-9.08 2.78-11.42 2.78-2.36 0-5.98-2.64-9.86-2.56-5.08.08-9.76 2.96-12.38 7.5-5.28 9.14-1.36 22.68 3.78 30.12 2.52 3.66 5.52 7.74 9.46 7.6 3.78-.16 5.22-2.46 9.82-2.46s5.88 2.46 9.86 2.38c4.1-.08 6.68-3.72 9.2-7.4 2.86-4.22 4.04-8.3 4.12-8.52-.1-.04-7.9-3.04-7.98-12.02-.08-7.52 6.14-11.12 6.42-11.32-3.5-5.18-8.96-5.76-10.88-5.9-.99-.08-2.02-.18-3.08-.18-.6 0-1.2.04-1.78.12l.12-.14z"/>
                    <path d="M69.95 5.36h8.64c5.94 0 9.92 3.98 9.92 9.86 0 5.9-4.04 9.9-10.04 9.9h-5.56v10.24h-2.96V5.36zm2.96 17.14h4.64c4.14 0 6.5-2.22 6.5-6.28s-2.36-6.26-6.48-6.26h-4.66v12.54z"/>
                    <path d="M90.68 30.32c0-3.86 2.96-6.22 8.2-6.52l6.04-.34v-1.72c0-2.72-1.84-4.34-4.9-4.34-2.84 0-4.72 1.4-5.16 3.54h-2.78c.22-3.68 3.34-6.42 8.08-6.42 4.78 0 7.84 2.52 7.84 6.5v13.6h-2.74v-3.64h-.06c-1.24 2.5-3.94 3.98-6.72 3.98-4.16 0-7.8-2.44-7.8-6.64zm14.24-2.02v-1.78l-5.44.32c-3.06.2-4.78 1.52-4.78 3.62 0 2.14 1.78 3.54 4.5 3.54 3.54 0 5.72-2.4 5.72-5.7z"/>
                    <path d="M113.18 43.14v-2.44c.24.06.78.06 1.02.06 2.2 0 3.4-1.16 4.12-4.14l.44-1.62-7.74-20.38h3.1l6.18 18.7h.08l6.18-18.7h3.02l-8.04 21.42c-1.84 5.02-3.96 6.64-8.4 6.64-.24 0-.72-.04-.96-.08v-.46z"/>
                  </svg>
                </motion.button>
                {/* Google Pay */}
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleExpress} disabled={loading}
                  className="w-full bg-white py-3.5 rounded-xl flex items-center justify-center cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-60">
                  <svg viewBox="0 0 150 40" className="h-5 w-auto">
                    <path fill="#4285F4" d="M20.64 20.45v5.59h-2.6V7.87h6.9c1.66-.03 3.26.6 4.48 1.76 1.24 1.1 1.94 2.69 1.9 4.34.04 1.66-.66 3.26-1.9 4.38a6.24 6.24 0 0 1-4.48 1.74l-4.3.01v.35zm0-10.18v7.43h4.33c.99.03 1.95-.36 2.64-1.08a3.55 3.55 0 0 0 .01-5.2 3.57 3.57 0 0 0-2.65-1.14l-4.33-.01z"/>
                    <path fill="#34A853" d="M40.2 15.39c1.92 0 3.43.51 4.54 1.54 1.1 1.03 1.66 2.44 1.66 4.23v8.56h-2.48v-1.93h-.11c-1.07 1.58-2.5 2.37-4.27 2.37-1.52 0-2.79-.45-3.81-1.35a4.35 4.35 0 0 1-1.53-3.41c0-1.44.54-2.59 1.63-3.44 1.09-.86 2.54-1.29 4.37-1.29 1.56 0 2.84.29 3.85.86v-.6c0-.97-.39-1.86-1.08-2.48a3.58 3.58 0 0 0-2.54-1.02c-1.47 0-2.63.62-3.48 1.86l-2.28-1.44c1.26-1.83 3.13-2.75 5.53-2.75v.09zm-3.38 10.5c0 .73.33 1.38.87 1.8.57.47 1.27.72 2 .7 1.08 0 2.12-.43 2.88-1.2.84-.79 1.26-1.72 1.26-2.78-.82-.65-1.96-.97-3.42-.97-1.06 0-1.95.26-2.65.78-.7.52-1.05 1.15-.94 1.67z"/>
                    <path fill="#4285F4" d="M56.07 15.83l-8.64 19.87h-2.57l3.21-6.96-5.68-12.91h2.71l4.14 10.01h.06l4.03-10.01h2.74z"/>
                    <path fill="#4285F4" d="M75.9 18.55h-7.01V7.87h7.01c3.68 0 6.42 2.57 6.42 5.34 0 2.77-2.74 5.34-6.42 5.34zm0-8.28h-4.41v5.88h4.41c2.14 0 3.76-1.4 3.76-2.94 0-1.54-1.62-2.94-3.76-2.94z"/>
                    <path fill="#34A853" d="M93.65 25.72c0 3.03-2.2 5-5.53 5-2.3 0-4.17-.95-5.31-2.72l2.3-1.36c.7 1.18 1.72 1.78 3.01 1.78 1.75 0 2.93-1.04 2.93-2.68v-.82h-.08c-.7.87-1.92 1.3-3.34 1.3-3.17 0-6.07-2.72-6.07-6.21s2.9-6.27 6.07-6.27c1.42 0 2.64.43 3.34 1.28h.08v-.86h2.6v11.56zm-2.42-5.68c0-1.92-1.5-3.36-3.4-3.36-1.92 0-3.53 1.44-3.53 3.36 0 1.9 1.61 3.3 3.53 3.3 1.9 0 3.4-1.4 3.4-3.3z"/>
                    <path fill="#EA4335" d="M104.5 20.24c0 3.58-2.79 6.22-6.22 6.22s-6.22-2.66-6.22-6.22c0-3.58 2.79-6.24 6.22-6.24s6.22 2.66 6.22 6.24zm-2.72 0c0-2.22-1.62-3.76-3.5-3.76s-3.5 1.52-3.5 3.76c0 2.2 1.62 3.76 3.5 3.76s3.5-1.54 3.5-3.76z"/>
                    <path fill="#FBBC04" d="M117.5 20.24c0 3.58-2.79 6.22-6.22 6.22s-6.22-2.66-6.22-6.22c0-3.58 2.79-6.24 6.22-6.24s6.22 2.66 6.22 6.24zm-2.72 0c0-2.22-1.62-3.76-3.5-3.76s-3.5 1.52-3.5 3.76c0 2.2 1.62 3.76 3.5 3.76s3.5-1.54 3.5-3.76z"/>
                    <path fill="#4285F4" d="M130.01 14.42v16.54c0 4.5-2.66 6.34-5.8 6.34-2.96 0-4.74-1.98-5.41-3.6l2.37-.98c.41 1 1.42 2.18 3.04 2.18 1.99 0 3.22-1.22 3.22-3.54v-.87h-.09c-.59.73-1.73 1.37-3.18 1.37-3.02 0-5.78-2.63-5.78-6.01 0-3.4 2.76-6.1 5.78-6.1 1.44 0 2.59.64 3.18 1.35h.09v-.92l2.58.24zm-2.39 5.86c0-2.13-1.42-3.68-3.23-3.68-1.83 0-3.37 1.55-3.37 3.68 0 2.11 1.54 3.62 3.37 3.62 1.81 0 3.23-1.53 3.23-3.62z"/>
                    <path fill="#EA4335" d="M135.1 7.87v17.85h-2.6V7.87h2.6z"/>
                    <path fill="#34A853" d="M145.54 23.64l2.02 1.34c-.65.97-2.22 2.64-4.94 2.64-3.37 0-5.89-2.6-5.89-6.22 0-3.7 2.54-6.22 5.6-6.22 3.08 0 4.59 2.46 5.08 3.78l.27.68-7.93 3.28c.61 1.18 1.52 1.86 2.78 1.86 1.28 0 2.17-.62 3.01-1.58v-.56zm-6.23-2.24l5.3-2.2c-.29-.74-1.17-1.26-2.2-1.26-1.32 0-3.17 1.18-3.1 3.46z"/>
                  </svg>
                </motion.button>
                {/* Venmo */}
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleExpress} disabled={loading}
                  className="w-full bg-[#008CFF] py-3.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#0074D4] transition-colors disabled:opacity-60">
                  <svg viewBox="0 0 280 56" className="h-5 w-auto" fill="white">
                    <path d="M42.68 0c2.35 4.12 3.42 8.37 3.42 13.76 0 17.14-14.64 39.4-26.52 55.04H5.24L0 4.12 13.08 2.84l3.42 36.7C21.3 31.9 28.84 17.56 28.84 9.46c0-5.16-1.42-8.66-3.2-11.32L42.68 0z"/>
                    <path d="M65.54 21.62c3.42 0 10.12-1.5 10.12-6.18 0-2.34-1.64-3.48-3.56-3.48-3.56 0-6.28 3.84-6.56 9.66zm-.36 8.44c0 6.74 3.7 9.44 8.58 9.44 4.98 0 9.38-1.28 13.48-3.34l-1.86 10.82c-3.42 1.86-8.72 3.2-14.42 3.2C59.12 50.18 52 43.86 52 32.06 52 18.94 60.2 8.8 73.94 8.8c8.22 0 13.06 4.62 13.06 11.18 0 10.04-12.56 14.42-21.82 14.42v-4.34z"/>
                    <path d="M108.58 19.42c0-2.56-.14-5.86-.42-8.44l12.2-1.86.56 5.16h.28c2.84-3.7 6.7-5.86 11.18-5.86 7.24 0 10.66 5.16 10.66 13.12v28.84h-13.76v-26.2c0-3.56-.92-5.86-3.7-5.86-2.06 0-3.42 1.36-4.12 3.2-.22.56-.28 1.5-.28 2.34v26.52H108.6l-.02-30.96z"/>
                    <path d="M167.5 19.42c0-2.56-.14-5.86-.42-8.44l12.14-1.86.56 5.02h.28c2.84-3.56 6.84-5.72 11.54-5.72 4.48 0 8.22 2.14 9.86 5.86h.14c1.64-2.34 3.56-3.84 5.72-4.84 1.86-.86 3.84-1.36 6.28-1.36 7.1 0 11.04 5.3 11.04 14.12v28.18h-13.76v-25.92c0-4.12-1.08-6.14-3.56-6.14-1.86 0-3.2 1.14-3.84 3.06-.28.78-.42 1.86-.42 2.7v26.3h-13.76v-26.28c0-3.7-1-5.78-3.42-5.78-2.06 0-3.28 1.5-3.84 3.06-.36.86-.42 1.86-.42 2.7v26.3H167.5V19.42z"/>
                    <path d="M247.62 28.78c0-5.16-1.86-9.72-6.14-9.72-4.34 0-6.56 4.7-6.56 10.08 0 5.86 2.34 9.8 6.28 9.8 3.98 0 6.42-4.34 6.42-10.16zm-26.34 2.06c0-13.4 9.28-22.42 22.28-22.42 11.6 0 17.78 7.38 17.78 18.3 0 12.9-8.86 22.7-22.28 22.7-12.06 0-17.78-7.94-17.78-18.58z"/>
                  </svg>
                </motion.button>
              </div>

              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium">or pay with card</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Card Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Card number</label>
                  <div className="relative">
                    <input type="text" value={card} onChange={(e) => setCard(formatCardNumber(e.target.value))}
                      placeholder="1234 1234 1234 1234"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all font-mono" />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {cardType && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{cardType}</span>}
                      {!cardType && <CreditCard size={18} className="text-gray-300" />}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expiration</label>
                    <input type="text" value={expiry} onChange={(e) => handleExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all font-mono" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">CVC</label>
                    <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all font-mono" />
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cardholder name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Full name on card"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all" />
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Billing ZIP</label>
                  <input type="text" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="12345"
                    className="w-full bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all font-mono" />
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Subscribe — ${plan.annualPrice}/year</>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock size={12} /> Secured by 256-bit SSL encryption
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Order Summary */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100 lg:sticky lg:top-28">
              <h3 className="font-bold font-heading text-gray-900 mb-1">{plan.name}</h3>
              <p className="text-sm text-gray-400 mb-5">${plan.annualPrice} billed annually</p>

              {noEntity && (
                <div className="bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl px-4 py-3 mb-5">
                  <p className="text-sm font-medium text-[#10B981] flex items-center gap-2">
                    <span>✨</span> Includes Free Entity Formation
                  </p>
                </div>
              )}

              <div className="space-y-3 mb-6">
                {plan.features.map((f) => (
                  <div key={f} className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                    <span className="text-sm text-gray-600">{f}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-gray-100 pt-4 space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Monthly rate</span>
                  <span className="text-gray-700">${plan.price}/mo</span>
                </div>
                <div className="flex justify-between text-base font-bold">
                  <span className="text-gray-900">Total (billed annually)</span>
                  <span className="text-gray-900">${plan.annualPrice}/year</span>
                </div>
              </div>

              {/* Promo code */}
              <div className="mt-5">
                <label className="text-sm font-medium text-gray-700 mb-1.5 block">Promo code</label>
                <div className="flex gap-2">
                  <input type="text" value={promo} onChange={(e) => setPromo(e.target.value)}
                    placeholder="Enter promo code"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-4 py-3 text-sm outline-none focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20 transition-all" />
                  <button className="px-5 py-3 bg-[#1a1a2e] hover:bg-[#2d2d44] rounded-lg text-sm font-semibold text-white transition-colors cursor-pointer">
                    Apply
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
