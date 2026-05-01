import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useFunnel } from '../context/FunnelContext'
import CalendarPicker from '../components/CalendarPicker'
import { Calendar, Video } from 'lucide-react'

export default function ScheduleConsultation() {
  const { data, update } = useFunnel()
  const nav = useNavigate()

  const handleConfirm = () => {
    nav('/lead-form')
  }

  return (
    <div className="min-h-screen bg-[#F9FAFB] pt-28 pb-20">
      <div className="max-w-3xl mx-auto px-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-10">
          <h1 className="text-2xl lg:text-3xl font-extrabold font-heading text-gray-900 mb-3">
            Schedule Your Free Tax Strategy Call
          </h1>
          <p className="text-gray-500 font-body text-lg">
            Pick a time that works. You'll meet with a tax specialist via Google Meet.
          </p>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          className="bg-white rounded-2xl p-6 lg:p-10 shadow-sm border border-gray-100">
          <CalendarPicker
            selectedDate={data.selectedDate}
            selectedTime={data.selectedTime}
            onDate={(d) => update({ selectedDate: d })}
            onTime={(t) => update({ selectedTime: t })}
          />
        </motion.div>

        {/* Confirmation Card */}
        {data.selectedDate && data.selectedTime && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="mt-8 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#F7941D]/10 flex items-center justify-center">
                  <Calendar size={20} className="text-[#F7941D]" />
                </div>
                <div>
                  <p className="font-semibold font-heading text-gray-900 text-sm">{data.selectedDate}</p>
                  <p className="text-sm text-[#F7941D] font-medium">{data.selectedTime} EST</p>
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <Video size={16} /> Via Google Meet
              </div>
            </div>
            <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
              onClick={handleConfirm}
              className="w-full bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold py-4 rounded-full transition-all cursor-pointer text-lg">
              Confirm Booking
            </motion.button>
            {data.email && (
              <p className="text-xs text-gray-400 text-center mt-3 font-body">
                Confirmation will be sent to {data.email}
              </p>
            )}
          </motion.div>
        )}
      </div>
    </div>
  )
}
