import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const QualifierFlow = lazy(() => import('./pages/QualifierFlow'))
const AnalyzingScreen = lazy(() => import('./pages/AnalyzingScreen'))
const YourPlan = lazy(() => import('./pages/YourPlan'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ScheduleConsultation = lazy(() => import('./pages/ScheduleConsultation'))
const Confirmation = lazy(() => import('./pages/Confirmation'))

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo(0, 0) }, [pathname])
  return null
}

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.4, ease: 'easeOut' } },
  exit: { opacity: 0, y: -20, transition: { duration: 0.3 } },
}

function PageWrap({ children }) {
  return (
    <motion.div variants={pageVariants} initial="initial" animate="animate" exit="exit">
      {children}
    </motion.div>
  )
}

function Loader() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-8 h-8 border-3 border-[#F7941D] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Navbar />
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<PageWrap><LandingPage /></PageWrap>} />
            <Route path="/get-started" element={<PageWrap><QualifierFlow /></PageWrap>} />
            <Route path="/analyzing" element={<PageWrap><AnalyzingScreen /></PageWrap>} />
            <Route path="/your-plan" element={<PageWrap><YourPlan /></PageWrap>} />
            <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />
            <Route path="/schedule" element={<PageWrap><ScheduleConsultation /></PageWrap>} />
            <Route path="/welcome" element={<PageWrap><Confirmation /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </>
  )
}
