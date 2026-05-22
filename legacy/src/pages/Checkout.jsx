import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Lock, Check, CreditCard, Sparkles } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

const PLAN_INFO = {
  basic: { name: 'Do-It-Yourself', price: 19, annualPrice: '228', features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings'] },
  pro:   { name: 'Do-It-With-Me',  price: 29, annualPrice: '348', features: ['Free AI Business Tax Return', 'AI Bookkeeping', 'Complimentary Business Tax Extension', 'Unlimited 1099 Issuing and Filings', 'Personal Tax Preparation', 'Quarterly Estimated Tax Compliance', 'CPA Review of Taxes', 'Payroll Setup', 'Tax Hotline'] },
}

const ENTITY_LABELS = { llc: 'LLC', 's-corp': 'S-Corporation', 'c-corp': 'C-Corporation', 'sole-prop': 'Sole Proprietorship' }

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
function formatPhone(val) {
  const nums = val.replace(/\D/g, '').slice(0, 10)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `(${nums.slice(0, 3)}) ${nums.slice(3)}`
  return `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`
}

export default function Checkout() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const plan = PLAN_INFO[data.selectedPlan] || PLAN_INFO.pro
  const noEntity = data.hasExistingBusiness === false

  const [contact, setContact] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
  })
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState(data.fullName || '')
  const [zip, setZip] = useState('')
  const [promo, setPromo] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const cardType = getCardType(card)

  const updateContact = (field, value) => {
    if (field === 'phone') value = formatPhone(value)
    setContact((c) => ({ ...c, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }

  const handleExpiry = (val) => {
    let nums = val.replace(/\D/g, '').slice(0, 4)
    if (nums.length > 2) nums = nums.slice(0, 2) + '/' + nums.slice(2)
    setExpiry(nums)
  }

  const validate = () => {
    const errs = {}
    if (!contact.fullName.trim()) errs.fullName = 'Required'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(contact.email)) errs.email = 'Valid email required'
    if (contact.phone.replace(/\D/g, '').length < 10) errs.phone = '10-digit phone'
    if (card.replace(/\s/g, '').length < 16) errs.card = 'Enter a valid card'
    if (expiry.length < 5) errs.expiry = 'MM/YY'
    if (cvc.length < 3) errs.cvc = 'CVC'
    if (!name.trim()) errs.name = 'Required'
    if (zip.length < 5) errs.zip = 'Zip'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    update({ fullName: contact.fullName, email: contact.email, phone: contact.phone })
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
          {/* LEFT: Contact + Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex-1">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">

              {/* Contact info */}
              <h3 className="text-sm font-semibold font-heading text-gray-900 uppercase tracking-wider mb-4">Your Details</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full name</label>
                  <input type="text" value={contact.fullName}
                    onChange={(e) => updateContact('fullName', e.target.value)}
                    placeholder="Jane Doe"
                    className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all
                      ${errors.fullName ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                    `} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                    <input type="email" value={contact.email}
                      onChange={(e) => updateContact('email', e.target.value)}
                      placeholder="jane@example.com"
                      className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all
                        ${errors.email ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                      `} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                    <input type="tel" value={contact.phone}
                      onChange={(e) => updateContact('phone', e.target.value)}
                      placeholder="(555) 123-4567"
                      className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all font-mono
                        ${errors.phone ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                      `} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold font-heading text-gray-900 uppercase tracking-wider mb-4">Payment</h3>

              {/* Express Checkout */}
              <div className="space-y-3 mb-6">
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleExpress} disabled={loading}
                  className="w-full bg-black text-white py-3.5 rounded-xl flex items-center justify-center cursor-pointer hover:bg-[#1a1a1a] transition-colors disabled:opacity-60 text-sm font-semibold">
                  Pay
                </motion.button>
                <motion.button whileTap={{ scale: 0.98 }} onClick={handleExpress} disabled={loading}
                  className="w-full bg-white py-3.5 rounded-xl flex items-center justify-center cursor-pointer border border-gray-200 hover:border-gray-300 transition-colors disabled:opacity-60 text-sm font-semibold text-gray-700">
                  G Pay
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
                      className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all font-mono
                        ${errors.card ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                      `} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {cardType && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{cardType}</span>}
                      {!cardType && <CreditCard size={18} className="text-gray-300" />}
                    </div>
                  </div>
                  {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expiration</label>
                    <input type="text" value={expiry} onChange={(e) => handleExpiry(e.target.value)}
                      placeholder="MM/YY"
                      className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all font-mono
                        ${errors.expiry ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                      `} />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">CVC</label>
                    <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))}
                      placeholder="123"
                      className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all font-mono
                        ${errors.cvc ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                      `} />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                  </div>
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cardholder name</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)}
                    placeholder="Full name on card"
                    className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all
                      ${errors.name ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                    `} />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Billing ZIP</label>
                  <input type="text" value={zip} onChange={(e) => setZip(e.target.value.replace(/\D/g, '').slice(0, 5))}
                    placeholder="12345"
                    className={`w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all font-mono
                      ${errors.zip ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}
                    `} />
                  {errors.zip && <p className="text-red-500 text-xs mt-1">{errors.zip}</p>}
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>{noEntity ? `Form My Business — $${plan.annualPrice}/year` : `Subscribe — $${plan.annualPrice}/year`}</>
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
                    <Sparkles size={14} /> Includes Free Entity Formation
                  </p>
                  {data.entityType && (
                    <p className="text-xs text-[#10B981]/80 mt-1 ml-6">
                      {ENTITY_LABELS[data.entityType]}{data.companyName ? ` · ${data.companyName}` : ''}
                    </p>
                  )}
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
