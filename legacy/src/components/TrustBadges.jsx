import { Shield, Award, RefreshCw, BadgeCheck } from 'lucide-react'

const badges = [
  { icon: Shield, label: 'SOC 2 Certified' },
  { icon: Award, label: 'A- BBB Rating' },
  { icon: RefreshCw, label: 'Cancel Anytime' },
  { icon: BadgeCheck, label: '30-Day Money-Back' },
]

export default function TrustBadges() {
  return (
    <div className="flex flex-wrap justify-center gap-6 lg:gap-10">
      {badges.map((b) => (
        <div key={b.label} className="flex items-center gap-2 text-gray-400 text-sm">
          <b.icon size={16} className="text-[#10B981]" />
          <span>{b.label}</span>
        </div>
      ))}
    </div>
  )
}
