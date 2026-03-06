import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

const SLOTS = ['9:00 AM','10:00 AM','11:00 AM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']
const seed = (n) => { let x = Math.sin(n) * 10000; return x - Math.floor(x) }

export default function CalendarPicker({ selectedDate, selectedTime, onDate, onTime }) {
  const today = new Date()
  const [month, setMonth] = useState(today.getMonth())
  const [year, setYear] = useState(today.getFullYear())

  const days = useMemo(() => {
    const first = new Date(year, month, 1).getDay()
    const count = new Date(year, month + 1, 0).getDate()
    const r = []
    for (let i = 0; i < first; i++) r.push(null)
    for (let i = 1; i <= count; i++) r.push(i)
    return r
  }, [month, year])

  const monthLabel = new Date(year, month).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const available = (d) => {
    if (!d) return false
    const dt = new Date(year, month, d)
    const dow = dt.getDay()
    if (dow === 0 || dow === 6) return false
    if (dt < new Date(today.getFullYear(), today.getMonth(), today.getDate())) return false
    const max = new Date(today); max.setDate(max.getDate() + 14)
    return dt <= max
  }

  const slots = (d) => d ? SLOTS.filter((_, i) => seed(d + month * 31 + year + i) > 0.25) : []
  const selDay = selectedDate ? new Date(selectedDate).getDate() : null

  const pick = (d) => {
    if (!available(d)) return
    onDate(new Date(year, month, d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' }))
    onTime(null)
  }

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <button onClick={() => month === 0 ? (setMonth(11), setYear(y => y-1)) : setMonth(m => m-1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"><ChevronLeft size={20} /></button>
          <h3 className="font-semibold font-heading">{monthLabel}</h3>
          <button onClick={() => month === 11 ? (setMonth(0), setYear(y => y+1)) : setMonth(m => m+1)} className="p-2 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer"><ChevronRight size={20} /></button>
        </div>
        <div className="grid grid-cols-7 gap-1 mb-2">
          {['Su','Mo','Tu','We','Th','Fr','Sa'].map((d) => <div key={d} className="text-center text-xs font-medium text-gray-400 py-2">{d}</div>)}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {days.map((d, i) => {
            const ok = available(d)
            const sel = d === selDay && selectedDate
            return (
              <button key={i} disabled={!ok} onClick={() => d && pick(d)}
                className={`aspect-square rounded-lg text-sm font-medium transition-all cursor-pointer
                  ${!d ? 'invisible' : ''} ${ok ? 'hover:bg-[#F7941D]/10 hover:text-[#F7941D]' : 'text-gray-300 cursor-not-allowed'}
                  ${sel ? 'bg-[#F7941D] text-white hover:bg-[#e07e0a] hover:text-white' : ''}
                `}>{d}</button>
            )
          })}
        </div>
      </div>
      <div>
        <h3 className="font-semibold font-heading mb-4">{selectedDate ? 'Available Times (EST)' : 'Select a date'}</h3>
        <AnimatePresence mode="wait">
          {selectedDate && (
            <motion.div key={selectedDate} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2">
              {slots(selDay).map((s) => (
                <motion.button key={s} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                  onClick={() => onTime(s)}
                  className={`w-full py-3 px-4 rounded-xl border text-sm font-medium transition-all cursor-pointer
                    ${selectedTime === s ? 'border-[#F7941D] bg-[#F7941D] text-white' : 'border-gray-200 hover:border-[#F7941D] hover:text-[#F7941D]'}
                  `}>{s}</motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
