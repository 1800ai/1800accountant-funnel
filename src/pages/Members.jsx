import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ChevronRight, Plus, Trash2, User } from 'lucide-react'
import { useFunnel } from '../context/FunnelContext'

const blankMember = () => ({ name: '', ownership: '', address: '' })

export default function Members() {
  const { data, update } = useFunnel()
  const nav = useNavigate()
  const [members, setMembers] = useState(
    data.members && data.members.length > 0 ? data.members : [blankMember()]
  )
  const [errors, setErrors] = useState([])

  const updateMember = (idx, field, value) => {
    setMembers((prev) => prev.map((m, i) => (i === idx ? { ...m, [field]: value } : m)))
    setErrors((prev) => prev.map((e, i) => (i === idx ? { ...e, [field]: '' } : e)))
  }

  const addMember = () => setMembers((prev) => [...prev, blankMember()])
  const removeMember = (idx) => setMembers((prev) => prev.filter((_, i) => i !== idx))

  const totalOwnership = members.reduce((s, m) => s + (Number(m.ownership) || 0), 0)

  const validate = () => {
    const errs = members.map((m) => {
      const e = {}
      if (!m.name.trim()) e.name = 'Required'
      if (!m.ownership.toString().trim()) e.ownership = 'Required'
      else {
        const n = Number(m.ownership)
        if (Number.isNaN(n) || n <= 0 || n > 100) e.ownership = '1–100'
      }
      if (!m.address.trim()) e.address = 'Required'
      return e
    })
    if (totalOwnership !== 100) {
      errs[0] = { ...errs[0], _total: `Ownership must total 100% (currently ${totalOwnership || 0}%)` }
    }
    return errs
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    const errs = validate()
    setErrors(errs)
    const hasError = errs.some((row) => Object.keys(row).length > 0)
    if (hasError) return
    update({ members })
    nav('/checkout')
  }

  const inputClass = (err) =>
    `w-full rounded-xl border-2 p-3 text-sm outline-none transition-all font-body
    ${err ? 'border-red-400 ring-2 ring-red-400/20' : 'border-gray-200 focus:border-[#F7941D] focus:ring-2 focus:ring-[#F7941D]/20'}`

  return (
    <div className="min-h-screen bg-white pt-24 pb-32">
      <div className="max-w-2xl mx-auto px-6">
        <button onClick={() => nav('/company-info')}
          className="flex items-center gap-1 text-gray-400 hover:text-gray-700 transition-colors mb-6 text-sm cursor-pointer">
          <ArrowLeft size={16} /> Back
        </button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-2xl lg:text-3xl font-bold font-heading text-gray-900 mb-2">Who owns the business?</h1>
          <p className="text-gray-500 font-body">List each owner and their ownership percentage. Must total 100%.</p>
        </motion.div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <AnimatePresence initial={false}>
            {members.map((m, idx) => (
              <motion.div key={idx}
                initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                className="bg-[#F9FAFB] rounded-2xl p-5 border border-gray-200">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-semibold font-heading text-gray-900">
                    <User size={16} className="text-[#F7941D]" />
                    Owner {idx + 1}
                  </div>
                  {members.length > 1 && (
                    <button type="button" onClick={() => removeMember(idx)}
                      className="text-gray-400 hover:text-red-500 transition-colors cursor-pointer" aria-label="Remove owner">
                      <Trash2 size={16} />
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="md:col-span-2">
                    <input type="text" placeholder="Full Name" value={m.name}
                      onChange={(e) => updateMember(idx, 'name', e.target.value)}
                      className={inputClass(errors[idx]?.name)} />
                  </div>
                  <div className="relative">
                    <input type="number" min="1" max="100" placeholder="%" value={m.ownership}
                      onChange={(e) => updateMember(idx, 'ownership', e.target.value)}
                      className={inputClass(errors[idx]?.ownership) + ' pr-8'} />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">%</span>
                  </div>
                </div>
                <input type="text" placeholder="Owner address" value={m.address}
                  onChange={(e) => updateMember(idx, 'address', e.target.value)}
                  className={inputClass(errors[idx]?.address) + ' mt-3'} />
                {errors[idx]?._total && (
                  <p className="text-red-500 text-xs mt-2">{errors[idx]._total}</p>
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          <button type="button" onClick={addMember}
            className="flex items-center gap-2 text-sm text-[#F7941D] hover:text-[#e07e0a] font-medium cursor-pointer">
            <Plus size={16} /> Add another owner
          </button>

          <div className="flex items-center justify-between text-sm pt-2">
            <span className="text-gray-500 font-body">Total ownership</span>
            <span className={totalOwnership === 100 ? 'text-[#10B981] font-semibold' : 'text-gray-700'}>
              {totalOwnership || 0}%
            </span>
          </div>

          <motion.button type="submit" whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
            className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer flex items-center justify-center gap-2 mt-4">
            Continue to Checkout <ChevronRight size={18} />
          </motion.button>
        </form>
      </div>
    </div>
  )
}
