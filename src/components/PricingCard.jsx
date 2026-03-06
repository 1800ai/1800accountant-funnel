import { motion } from 'framer-motion'
import { Check, Sparkles } from 'lucide-react'

export default function PricingCard({
  name, price, period = '/mo', annualPrice, badge, recommended, popular, premium, features, bonusFeatures,
  ctaText, onSelect, delay = 0, legalZoom, subtitle,
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, delay }}
      whileHover={{ y: -4 }}
      className={`relative rounded-2xl flex flex-col transition-all duration-300
        ${premium ? 'bg-[#1a1a2e] border-2 border-[#F7941D] shadow-[0_0_40px_rgba(250,130,0,0.2)] scale-[1.03] z-10' : ''}
        ${popular && !premium ? 'bg-white border-2 border-[#F7941D] shadow-[0_0_30px_rgba(250,130,0,0.15)] scale-[1.02] z-10' : ''}
        ${!popular && !premium ? 'bg-white border border-gray-200 shadow-lg hover:shadow-xl' : ''}
        ${recommended && !popular && !premium ? 'ring-2 ring-[#10B981]/40' : ''}
      `}
    >
      {badge && (
        <div className={`absolute -top-3.5 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full text-xs font-bold text-white whitespace-nowrap
          ${badge === 'MOST POPULAR' ? 'bg-gradient-to-r from-[#F7941D] to-[#e07e0a]' : 'bg-[#10B981]'}
        `}>
          {badge === 'MOST POPULAR' && <Sparkles size={11} className="inline mr-1 -mt-0.5" />}
          {badge}
        </div>
      )}

      <div className="p-6 lg:p-8 flex flex-col flex-1">
        <div className="min-h-[3.5rem]">
          <h3 className={`text-lg font-bold font-heading mb-1 ${premium ? 'text-white' : 'text-gray-900'}`}>
            {name}
            {recommended && (
              <span className="ml-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-[#10B981] text-white align-middle">
                <Sparkles size={10} /> Recommended
              </span>
            )}
          </h3>
          {subtitle && <p className={`text-xs ${premium ? 'text-gray-400' : 'text-gray-400'}`}>{subtitle}</p>}
        </div>
        {price !== undefined && (
          <div className="mb-5">
            <div className="flex items-baseline gap-1">
              <span className={`text-4xl font-extrabold font-heading ${premium ? 'text-white' : 'text-gray-900'}`}>${price}</span>
              <span className={`font-medium ${premium ? 'text-gray-400' : 'text-gray-400'}`}>{period}</span>
            </div>
            {annualPrice && (
              <p className={`text-xs mt-1 ${premium ? 'text-gray-500' : 'text-gray-400'}`}>${annualPrice} billed annually</p>
            )}
          </div>
        )}
        {premium && (
          <div className="space-y-2.5 mb-5">
            <div className="bg-[#F7941D]/15 border border-[#F7941D]/30 rounded-xl px-4 py-2.5">
              <p className="text-sm font-bold text-[#F7941D] flex items-center gap-2">
                <Sparkles size={14} /> Maximum Tax Savings Guaranteed
              </p>
            </div>
            <div className="bg-[#10B981]/15 border border-[#10B981]/30 rounded-xl px-4 py-2.5">
              <p className="text-sm font-semibold text-[#10B981] flex items-center gap-2">
                <Sparkles size={14} /> Avg. clients save $12,000/year
              </p>
            </div>
          </div>
        )}
        <div className="space-y-3 flex-1">
          {features.map((f, i) => (
            <div key={i} className="flex items-start gap-3">
              <Check size={16} className={`shrink-0 mt-0.5 ${premium ? 'text-[#F7941D]' : 'text-[#10B981]'}`} />
              <span className={`text-sm ${premium ? 'text-gray-300' : 'text-gray-600'}`}>{f}</span>
            </div>
          ))}
          {bonusFeatures?.map((f, i) => (
            <div key={`b-${i}`} className="flex items-start gap-3">
              <Sparkles size={16} className="text-[#F7941D] shrink-0 mt-0.5" />
              <span className="text-sm font-semibold text-[#F7941D]">{f}</span>
            </div>
          ))}
        </div>
        {legalZoom && (
          <div className="mt-4 pt-3 border-t border-gray-100 flex items-center gap-2">
            <img src="/legalzoom-logo.png" alt="LegalZoom" className="h-4 opacity-50" />
            <span className="text-[11px] text-gray-400">Entity formation powered by LegalZoom</span>
          </div>
        )}
        <motion.button whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.97 }}
          onClick={onSelect}
          className={`mt-6 w-full py-3.5 rounded-full font-semibold text-sm transition-all cursor-pointer
            ${premium ? 'bg-[#F7941D] hover:bg-[#e07e0a] text-white shadow-[0_4px_20px_rgba(247,148,29,0.4)]' : ''}
            ${popular && !premium ? 'bg-[#F7941D] hover:bg-[#e07e0a] text-white' : ''}
            ${!popular && !premium ? 'bg-[#1a1a2e] hover:bg-[#2d2d44] text-white' : ''}
          `}>
          {ctaText}
        </motion.button>
      </div>
    </motion.div>
  )
}
