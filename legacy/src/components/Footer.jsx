import { useLocation } from 'react-router-dom'

const cols = {
  Services: ['Tax Preparation', 'Bookkeeping', 'Payroll', 'Tax Advisory', 'Entity Formation'],
  Company: ['About', 'Careers', 'Partners', 'Reviews'],
  Resources: ['Blog', 'Tax Calculator', 'FAQ', 'Small Business Guide'],
  Legal: ['Privacy', 'Terms', 'Do Not Sell', 'Data Security'],
}

export default function Footer() {
  const { pathname } = useLocation()
  if (['/analyzing', '/checkout', '/get-started'].includes(pathname)) return null

  return (
    <footer className="bg-gradient-to-br from-[#1a1a2e] to-[#111827] text-gray-400">
      <div className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10 lg:gap-14">
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <img src="/1800A_Full-Logo.png" alt="1-800Accountant" className="h-9 mb-5" />
            <p className="text-sm leading-relaxed max-w-xs">America's leading virtual accounting firm for small businesses.</p>
            <p className="text-sm mt-4">Mon–Fri: 8AM – 8PM EST</p>
          </div>
          {Object.entries(cols).map(([title, links]) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm mb-4 font-heading">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => <li key={l}><a href="#" className="text-sm hover:text-white transition-colors">{l}</a></li>)}
              </ul>
            </div>
          ))}
        </div>
        <div className="border-t border-white/10 mt-14 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">&copy; 2026 1-800Accountant. All rights reserved.</p>
          <div className="flex gap-6">
            {['Facebook', 'LinkedIn', 'Twitter'].map((s) => (
              <a key={s} href="#" className="text-sm hover:text-white transition-colors">{s}</a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
