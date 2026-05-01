import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'

const LandingPage = lazy(() => import('./pages/LandingPage'))
const QualifierFlow = lazy(() => import('./pages/QualifierFlow'))            // Step 1: Has Business
const QualifierRevenue = lazy(() => import('./pages/QualifierRevenue'))      // Step 2: Revenue
const QualifierIndustry = lazy(() => import('./pages/QualifierIndustry'))    // Step 3: Industry
const QualifierState = lazy(() => import('./pages/QualifierState'))          // Step 4: State
const AnalyzingScreen = lazy(() => import('./pages/AnalyzingScreen'))
const YourPlan = lazy(() => import('./pages/YourPlan'))
const Checkout = lazy(() => import('./pages/Checkout'))
const ScheduleConsultation = lazy(() => import('./pages/ScheduleConsultation'))
const LeadForm = lazy(() => import('./pages/LeadForm'))
const Confirmation = lazy(() => import('./pages/Confirmation'))
const ConsultationConfirmation = lazy(() => import('./pages/ConsultationConfirmation'))
const TaxSavings = lazy(() => import('./pages/TaxSavings'))
const EntityType = lazy(() => import('./pages/EntityType'))
const CompanyInfo = lazy(() => import('./pages/CompanyInfo'))
const Members = lazy(() => import('./pages/Members'))

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

            {/* Qualifier — each step has its own URL */}
            <Route path="/get-started" element={<PageWrap><QualifierFlow /></PageWrap>} />
            <Route path="/get-started/revenue" element={<PageWrap><QualifierRevenue /></PageWrap>} />
            <Route path="/get-started/industry" element={<PageWrap><QualifierIndustry /></PageWrap>} />
            <Route path="/get-started/state" element={<PageWrap><QualifierState /></PageWrap>} />

            <Route path="/analyzing" element={<PageWrap><AnalyzingScreen /></PageWrap>} />
            <Route path="/your-plan" element={<PageWrap><YourPlan /></PageWrap>} />

            {/* Under-$50k + has-business path */}
            <Route path="/tax-savings" element={<PageWrap><TaxSavings /></PageWrap>} />

            {/* Under-$50k + no-business (entity formation) path */}
            <Route path="/entity-type" element={<PageWrap><EntityType /></PageWrap>} />
            <Route path="/company-info" element={<PageWrap><CompanyInfo /></PageWrap>} />
            <Route path="/members" element={<PageWrap><Members /></PageWrap>} />

            {/* Shared subscription checkout */}
            <Route path="/checkout" element={<PageWrap><Checkout /></PageWrap>} />

            {/* Consultation path (over-$50k direct + "Not sure" CTA) */}
            <Route path="/schedule" element={<PageWrap><ScheduleConsultation /></PageWrap>} />
            <Route path="/lead-form" element={<PageWrap><LeadForm /></PageWrap>} />
            <Route path="/consultation-booked" element={<PageWrap><ConsultationConfirmation /></PageWrap>} />

            {/* Subscription confirmation */}
            <Route path="/welcome" element={<PageWrap><Confirmation /></PageWrap>} />
          </Routes>
        </AnimatePresence>
      </Suspense>
      <Footer />
    </>
  )
}
