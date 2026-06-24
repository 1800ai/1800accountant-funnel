import { lazy, Suspense, useEffect } from 'react'
import { Routes, Route, useLocation, Navigate } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'

// All routes live under /intake/* per QA spec.
const QualifierFlow = lazy(() => import('./pages/QualifierFlow'))            // /intake/business
const QualifierRevenue = lazy(() => import('./pages/QualifierRevenue'))      // /intake/revenue
const QualifierDetails = lazy(() => import('./pages/QualifierDetails'))      // /intake/industry (industry + state combined)
const AnalyzingScreen = lazy(() => import('./pages/AnalyzingScreen'))        // /intake/analyzing
const Packages = lazy(() => import('./pages/YourPlan'))                      // /intake/packages
const BusinessName = lazy(() => import('./pages/CompanyInfo'))               // /intake/business-name
const Checkout = lazy(() => import('./pages/Checkout'))                      // /intake/checkout
const Welcome = lazy(() => import('./pages/Confirmation'))                   // /intake/welcome
const Members = lazy(() => import('./pages/Members'))                        // /intake/members
const Schedule = lazy(() => import('./pages/ScheduleConsultation'))          // /intake/schedule
const LeadForm = lazy(() => import('./pages/LeadForm'))                      // /intake/lead
const Confirmation = lazy(() => import('./pages/ConsultationConfirmation'))  // /intake/confirmation

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
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-8 h-8 border-3 border-[#F7941D] border-t-transparent rounded-full animate-spin" />
    </div>
  )
}

export default function App() {
  const location = useLocation()

  return (
    <>
      <ScrollToTop />
      <Suspense fallback={<Loader />}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            {/* Root and old entry → /intake/business */}
            <Route path="/" element={<Navigate to="/intake/business" replace />} />
            <Route path="/get-started" element={<Navigate to="/intake/business" replace />} />

            {/* Qualifier */}
            <Route path="/intake/business" element={<PageWrap><QualifierFlow /></PageWrap>} />
            <Route path="/intake/revenue" element={<PageWrap><QualifierRevenue /></PageWrap>} />
            <Route path="/intake/industry" element={<PageWrap><QualifierDetails /></PageWrap>} />

            {/* Analyzing */}
            <Route path="/intake/analyzing" element={<PageWrap><AnalyzingScreen /></PageWrap>} />

            {/* Flow A — Purchase / Entity Formation */}
            <Route path="/intake/packages" element={<PageWrap><Packages /></PageWrap>} />
            <Route path="/intake/business-name" element={<PageWrap><BusinessName /></PageWrap>} />
            <Route path="/intake/checkout" element={<PageWrap><Checkout /></PageWrap>} />
            <Route path="/intake/welcome" element={<PageWrap><Welcome /></PageWrap>} />
            <Route path="/intake/members" element={<PageWrap><Members /></PageWrap>} />

            {/* Flow A + B — Schedule */}
            <Route path="/intake/schedule" element={<PageWrap><Schedule /></PageWrap>} />

            {/* Flow B — Consultation lead form (skipped for EF) */}
            <Route path="/intake/lead" element={<PageWrap><LeadForm /></PageWrap>} />

            {/* Final confirmation (both flows) */}
            <Route path="/intake/confirmation" element={<PageWrap><Confirmation /></PageWrap>} />

            {/* Legacy redirects */}
            <Route path="/get-started/revenue" element={<Navigate to="/intake/revenue" replace />} />
            <Route path="/get-started/details" element={<Navigate to="/intake/industry" replace />} />
            <Route path="/get-started/industry" element={<Navigate to="/intake/industry" replace />} />
            <Route path="/get-started/state" element={<Navigate to="/intake/industry" replace />} />
            <Route path="/analyzing" element={<Navigate to="/intake/analyzing" replace />} />
            <Route path="/your-plan" element={<Navigate to="/intake/packages" replace />} />
            <Route path="/entity-type" element={<Navigate to="/intake/business-name" replace />} />
            <Route path="/company-info" element={<Navigate to="/intake/business-name" replace />} />
            <Route path="/members" element={<Navigate to="/intake/members" replace />} />
            <Route path="/checkout" element={<Navigate to="/intake/checkout" replace />} />
            <Route path="/schedule" element={<Navigate to="/intake/schedule" replace />} />
            <Route path="/lead-form" element={<Navigate to="/intake/lead" replace />} />
            <Route path="/welcome" element={<Navigate to="/intake/welcome" replace />} />
            <Route path="/consultation-booked" element={<Navigate to="/intake/confirmation" replace />} />
            <Route path="/tax-savings" element={<Navigate to="/intake/checkout" replace />} />

            {/* Catch-all */}
            <Route path="*" element={<Navigate to="/intake/business" replace />} />
          </Routes>
        </AnimatePresence>
      </Suspense>
    </>
  )
}
