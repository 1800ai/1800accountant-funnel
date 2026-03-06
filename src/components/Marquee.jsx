const items = [
  { name: 'Entrepreneur', style: {} },
  { name: 'Forbes', style: { fontStyle: 'italic' } },
  { name: 'The New York Times', style: { fontFamily: 'Georgia, serif' } },
  { name: 'The Wall Street Journal', style: { fontFamily: 'Georgia, serif', fontStyle: 'italic' } },
]

export default function Marquee() {
  const set = [...items, ...items, ...items, ...items]
  return (
    <section className="bg-[#111] py-5 overflow-hidden">
      <div className="flex items-center gap-6 px-6">
        <span className="hidden sm:block text-[11px] font-semibold text-gray-500 uppercase tracking-[0.2em] shrink-0">Featured in</span>
        <div className="w-px h-5 bg-gray-700 shrink-0 hidden sm:block" />
        <div className="overflow-hidden flex-1 min-w-0">
          <div className="marquee-track">
            {set.map((item, i) => (
              <span key={i} style={item.style}
                className="shrink-0 text-gray-500 text-xl font-semibold tracking-wide whitespace-nowrap mx-10 lg:mx-16 select-none">
                {item.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
