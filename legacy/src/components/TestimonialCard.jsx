import { Star } from 'lucide-react'

export default function TestimonialCard() {
  return (
    <div className="max-w-3xl mx-auto bg-white rounded-2xl p-10 lg:p-14 shadow-lg text-center">
      <div className="flex justify-center gap-1 mb-6">
        {[...Array(5)].map((_, i) => <Star key={i} size={22} className="fill-[#F7941D] text-[#F7941D]" />)}
      </div>
      <blockquote className="text-xl lg:text-2xl italic text-gray-700 leading-relaxed mb-8 font-body">
        "I have been with 1-800Accountant for 10+ years. They have saved me thousands in taxes, handled all my compliance, and I never worry about bookkeeping anymore. Worth every penny."
      </blockquote>
      <p className="font-bold font-heading text-gray-900">Carrie Stone</p>
      <p className="text-sm text-[#F7941D] font-medium mt-1">Massage Logic LLC</p>
    </div>
  )
}
