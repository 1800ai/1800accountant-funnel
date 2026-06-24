import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Lock, Check, CreditCard, TrendingUp, ArrowLeft, ChevronDown, ChevronUp, Sparkles } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'
import { INDUSTRIES } from '../utils/industries'
import { STATE_FILING_FEES } from '../utils/stateFees'
import { US_STATES } from '../utils/states'

const PLAN_INFO = {
  basic: {
    label: 'Basic',
    price: 19,
    annual: 228,
  },
  pro: {
    label: 'Pro',
    price: 29,
    annual: 348,
  },
}

const SHARED_FEATURES_EF = [
  'LLC Formation (we file with your state)',
  'Federal EIN',
]
const SHARED_FEATURES = [
  'AI Bookkeeping with industry Chart of Accounts',
  'AI Business Tax Return (federal + state, e-filed)',
  'Free Business Tax Extension',
  'Unlimited 1099 E-Filing',
  'Automated Monthly Financial Reports',
]
const PRO_ONLY_FEATURES = [
  'S-Corp Tax Election (saves $4,000+/yr on average)',
  'On-Demand Tax Advisor (unlimited chat + video meetings)',
  'Expert review of every tax filing',
  'Payroll Setup & Guidance',
]

function planName(level, industryId) {
  const ind = INDUSTRIES.find((i) => i.id === industryId)
  if (!ind || ind.id === 'other') return level === 'basic' ? 'Basic Plan' : 'Pro Plan'
  const short = ind.label.split(/[&\/]/)[0].trim()
  return level === 'basic' ? `Basic ${short} Plan` : `Pro ${short} Plan`
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
function formatPhone(val) {
  const nums = val.replace(/\D/g, '').slice(0, 10)
  if (nums.length <= 3) return nums
  if (nums.length <= 6) return `(${nums.slice(0, 3)}) ${nums.slice(3)}`
  return `(${nums.slice(0, 3)}) ${nums.slice(3, 6)}-${nums.slice(6)}`
}
const fmt = (n) => `$${n.toLocaleString()}`

export default function Checkout() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const selectedPlan = data.selectedPlan === 'basic' ? 'basic' : 'pro'
  const plan = PLAN_INFO[selectedPlan]
  const noEntity = data.hasExistingBusiness === false
  const filingFee = STATE_FILING_FEES[data.state] ?? 100
  const stateName = US_STATES.find((s) => s.abbr === data.state)?.name || data.state || 'your state'

  // Combine features for full order summary listing (no "everything in DIY" abbreviation)
  const featureList = selectedPlan === 'pro'
    ? [...(noEntity ? SHARED_FEATURES_EF : []), ...SHARED_FEATURES, ...PRO_ONLY_FEATURES]
    : [...(noEntity ? SHARED_FEATURES_EF : []), ...SHARED_FEATURES]

  const savings = data.taxSavingsEstimate
  const planSavings = savings ? (selectedPlan === 'basic' ? savings.diy : savings.diwm) : null

  const [contact, setContact] = useState({
    fullName: data.fullName || '',
    email: data.email || '',
    phone: data.phone || '',
  })
  const [billing, setBilling] = useState({
    line1: data.billingAddress?.line1 || '',
    city: data.billingAddress?.city || '',
    state: data.billingAddress?.state || data.state || '',
    zip: data.billingAddress?.zip || '',
  })
  const [card, setCard] = useState('')
  const [expiry, setExpiry] = useState('')
  const [cvc, setCvc] = useState('')
  const [name, setName] = useState(data.fullName || '')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [summaryOpen, setSummaryOpen] = useState(true)

  const cardType = getCardType(card)
  const dueToday = noEntity ? filingFee : plan.annual
  const dueLater = noEntity ? plan.annual : 0

  const updateContact = (field, value) => {
    if (field === 'phone') value = formatPhone(value)
    setContact((c) => ({ ...c, [field]: value }))
    setErrors((e) => ({ ...e, [field]: undefined }))
  }
  const updateBilling = (field, value) => {
    setBilling((b) => ({ ...b, [field]: value }))
    setErrors((e) => ({ ...e, [`b_${field}`]: undefined }))
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
    if (!billing.line1.trim()) errs.b_line1 = 'Required'
    if (!billing.city.trim()) errs.b_city = 'Required'
    if (!billing.state.trim()) errs.b_state = 'Required'
    if (!billing.zip.trim() || billing.zip.length < 5) errs.b_zip = 'Zip'
    if (card.replace(/\s/g, '').length < 16) errs.card = 'Enter a valid card'
    if (expiry.length < 5) errs.expiry = 'MM/YY'
    if (cvc.length < 3) errs.cvc = 'CVC'
    if (!name.trim()) errs.name = 'Required'
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    if (Object.keys(errs).length > 0) return
    setLoading(true)
    update({
      fullName: contact.fullName,
      email: contact.email,
      phone: contact.phone,
      billingAddress: billing,
      purchased: true,
    })
    setTimeout(() => nav('/intake/welcome'), 1800)
  }

  const handleExpress = () => {
    setLoading(true)
    update({ purchased: true })
    setTimeout(() => nav('/intake/welcome'), 1200)
  }

  const inputCls = (err) =>
    `w-full bg-gray-50 border rounded-lg px-4 py-3 text-sm outline-none transition-all
     ${err ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}`

  return (
    <div className="min-h-screen bg-[#F9FAFB] py-10 md:py-16 px-4">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => nav(-1)}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.h1 initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          className="text-2xl md:text-3xl font-extrabold font-heading text-gray-900 mb-2">
          {planSavings ? `You're one step from ${fmt(planSavings.high)} in tax savings.` : 'Complete your purchase.'}
        </motion.h1>
        <p className="text-gray-500 font-body mb-10">
          {noEntity ? "We'll file your business and start capturing your savings." : "We'll get to work immediately."}
        </p>

        <div className="flex flex-col-reverse lg:flex-row gap-8">
          {/* LEFT: Contact + Billing + Payment */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="flex-1">
            <div className="bg-white rounded-2xl p-6 lg:p-8 shadow-sm border border-gray-100">
              <h3 className="text-sm font-semibold font-heading text-gray-900 uppercase tracking-wider mb-4">Your Details</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Full name</label>
                  <input type="text" value={contact.fullName} onChange={(e) => updateContact('fullName', e.target.value)} placeholder="Jane Doe" className={inputCls(errors.fullName)} />
                  {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Email</label>
                    <input type="email" value={contact.email} onChange={(e) => updateContact('email', e.target.value)} placeholder="jane@example.com" className={inputCls(errors.email)} />
                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Phone</label>
                    <input type="tel" value={contact.phone} onChange={(e) => updateContact('phone', e.target.value)} placeholder="(555) 123-4567" className={`${inputCls(errors.phone)} font-mono`} />
                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold font-heading text-gray-900 uppercase tracking-wider mb-4">Billing Address</h3>
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Address</label>
                  <input type="text" value={billing.line1} onChange={(e) => updateBilling('line1', e.target.value)} placeholder="123 Main St" className={inputCls(errors.b_line1)} />
                  {errors.b_line1 && <p className="text-red-500 text-xs mt-1">{errors.b_line1}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">City</label>
                    <input type="text" value={billing.city} onChange={(e) => updateBilling('city', e.target.value)} className={inputCls(errors.b_city)} />
                    {errors.b_city && <p className="text-red-500 text-xs mt-1">{errors.b_city}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">State</label>
                    <select value={billing.state} onChange={(e) => updateBilling('state', e.target.value)} className={`${inputCls(errors.b_state)} appearance-none`}>
                      <option value="">—</option>
                      {US_STATES.map((s) => <option key={s.abbr} value={s.abbr}>{s.abbr}</option>)}
                    </select>
                    {errors.b_state && <p className="text-red-500 text-xs mt-1">{errors.b_state}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Zip</label>
                    <input type="text" value={billing.zip} onChange={(e) => updateBilling('zip', e.target.value.replace(/\D/g, '').slice(0, 5))} className={`${inputCls(errors.b_zip)} font-mono`} />
                    {errors.b_zip && <p className="text-red-500 text-xs mt-1">{errors.b_zip}</p>}
                  </div>
                </div>
              </div>

              <h3 className="text-sm font-semibold font-heading text-gray-900 uppercase tracking-wider mb-4">Payment</h3>

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

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium text-gray-700 mb-1.5 block">Card number</label>
                  <div className="relative">
                    <input type="text" value={card} onChange={(e) => setCard(formatCardNumber(e.target.value))} placeholder="1234 1234 1234 1234" className={`${inputCls(errors.card)} font-mono`} />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1">
                      {cardType && <span className="text-xs font-medium text-gray-500 bg-gray-100 px-2 py-0.5 rounded">{cardType}</span>}
                      {!cardType && <CreditCard size={18} className="text-gray-300" />}
                    </div>
                  </div>
                  {errors.card && <p className="text-red-500 text-xs mt-1">{errors.card}</p>}
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Expiration</label>
                    <input type="text" value={expiry} onChange={(e) => handleExpiry(e.target.value)} placeholder="MM/YY" className={`${inputCls(errors.expiry)} font-mono`} />
                    {errors.expiry && <p className="text-red-500 text-xs mt-1">{errors.expiry}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">CVC</label>
                    <input type="text" value={cvc} onChange={(e) => setCvc(e.target.value.replace(/\D/g, '').slice(0, 4))} placeholder="123" className={`${inputCls(errors.cvc)} font-mono`} />
                    {errors.cvc && <p className="text-red-500 text-xs mt-1">{errors.cvc}</p>}
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1.5 block">Cardholder</label>
                    <input type="text" value={name} onChange={(e) => setName(e.target.value)} placeholder="Name" className={inputCls(errors.name)} />
                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                  </div>
                </div>

                <motion.button type="submit" whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }}
                  disabled={loading}
                  className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg mt-2 disabled:opacity-60 flex items-center justify-center gap-2">
                  {loading ? (
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>Pay {fmt(dueToday)} today</>
                  )}
                </motion.button>
              </form>

              <div className="flex items-center justify-center gap-2 mt-4 text-xs text-gray-400">
                <Lock size={12} /> Secured by 256-bit SSL encryption
              </div>
            </div>
          </motion.div>

          {/* RIGHT: Order Summary (collapsible) */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
            className="lg:w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 lg:sticky lg:top-8">

              {/* Tax savings highlight */}
              {planSavings && (
                <div className="bg-gradient-to-br from-[#10B981] to-[#0e9d6c] rounded-t-2xl p-5 text-white">
                  <div className="flex items-center gap-2 mb-1">
                    <TrendingUp size={14} />
                    <span className="text-[11px] uppercase tracking-wider font-bold">Estimated annual savings</span>
                  </div>
                  <p className="text-3xl font-extrabold font-heading mb-0.5">
                    {fmt(planSavings.low)}<span className="text-white/70 font-medium mx-1">–</span>{fmt(planSavings.high)}
                  </p>
                  <p className="text-xs text-white/90 font-body">In federal + state deductions and quarterly planning.</p>
                </div>
              )}

              <div className="p-6 lg:p-8">
                <button onClick={() => setSummaryOpen(!summaryOpen)}
                  className="w-full flex items-center justify-between text-left cursor-pointer mb-4">
                  <div>
                    <h3 className="font-bold font-heading text-gray-900">{planName(selectedPlan, data.industry)}</h3>
                    <p className="text-sm text-gray-400">${plan.annual}/yr · {summaryOpen ? 'tap to hide details' : 'tap to see what\'s included'}</p>
                  </div>
                  {summaryOpen ? <ChevronUp size={18} className="text-gray-400" /> : <ChevronDown size={18} className="text-gray-400" />}
                </button>

                <AnimatePresence initial={false}>
                  {summaryOpen && (
                    <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }}
                      className="overflow-hidden">
                      <ul className="space-y-2.5 mb-5">
                        {featureList.map((f) => (
                          <li key={f} className="flex items-start gap-2.5">
                            <Check size={14} className="text-[#10B981] shrink-0 mt-0.5" />
                            <span className="text-sm text-gray-600">{f}</span>
                          </li>
                        ))}
                      </ul>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Pricing breakdown */}
                <div className="border-t border-gray-100 pt-4 space-y-3">
                  {noEntity && (
                    <>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-700 font-medium">Due today</p>
                          <p className="text-xs text-gray-400">{stateName} state filing fee</p>
                        </div>
                        <span className="text-gray-900 font-medium">${dueToday}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <div>
                          <p className="text-gray-700 font-medium">In 14 days</p>
                          <p className="text-xs text-gray-400">After we file your business</p>
                        </div>
                        <span className="text-gray-900 font-medium">${dueLater}</span>
                      </div>
                    </>
                  )}
                  {!noEntity && (
                    <div className="flex justify-between text-base font-bold">
                      <span className="text-gray-900">Total today</span>
                      <span className="text-gray-900">${plan.annual}/year</span>
                    </div>
                  )}
                </div>

                {noEntity && (
                  <div className="mt-4 bg-[#10B981]/10 border border-[#10B981]/20 rounded-xl px-3 py-2 text-xs text-[#10B981] font-medium flex items-center gap-2">
                    <Sparkles size={12} /> LLC formation included free
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
