import { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const nav = useNavigate()
  const { pathname } = useLocation()
  const hide = pathname === '/analyzing'
  const isQualifier = pathname === '/get-started'
  const isDark = pathname === '/analyzing'

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 60)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  if (hide) return null

  const glass = scrolled ? 'nav-glass-light' : isDark ? 'nav-glass-dark' : 'nav-glass-light'
  const textColor = isDark && !scrolled ? 'text-white/70 hover:text-white' : 'text-gray-600 hover:text-gray-900'

  return (
    <motion.header
      initial={{ y: -80 }} animate={{ y: 0 }}
      transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${glass}`}
    >
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 lg:h-[72px]">
        <Link to="/" className="shrink-0">
          <img src="/1800A_Full-Logo.png" alt="1-800Accountant" className="h-8 lg:h-10" />
        </Link>

        {!isQualifier && (
          <nav className="hidden lg:flex items-center gap-8">
            {['Services', 'Pricing', 'Resources', 'Support'].map((l) => (
              <a key={l} href="#" className={`text-sm font-medium transition-colors ${textColor}`}>{l}</a>
            ))}
          </nav>
        )}

        <div className="hidden lg:flex items-center gap-4">
          {!isQualifier && (
            <button className={`text-sm font-medium transition-colors cursor-pointer ${textColor}`}>Sign In</button>
          )}
          <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => nav('/get-started')}
            className="bg-[#F7941D] hover:bg-[#e07e0a] text-white font-semibold text-sm px-5 py-2.5 rounded-full transition-all cursor-pointer">
            Get Started
          </motion.button>
        </div>

        <button onClick={() => setOpen(!open)} className={`lg:hidden p-2 cursor-pointer ${isDark && !scrolled ? 'text-white' : 'text-gray-700'}`}>
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
            <div className="px-6 py-4 space-y-3">
              {['Services', 'Pricing', 'Resources', 'Support'].map((l) => (
                <a key={l} href="#" className="block text-sm text-gray-600 hover:text-gray-900 py-2">{l}</a>
              ))}
              <hr className="border-gray-100" />
              <button className="block text-sm text-gray-600 py-2 w-full text-left cursor-pointer">Sign In</button>
              <button onClick={() => { nav('/get-started'); setOpen(false) }}
                className="w-full bg-[#F7941D] text-white font-semibold text-sm px-5 py-3 rounded-full cursor-pointer">
                Get Started
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  )
}
