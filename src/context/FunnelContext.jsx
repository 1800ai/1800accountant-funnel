import { createContext, useContext, useState } from 'react'

const FunnelContext = createContext()

export function FunnelProvider({ children }) {
  const [data, setData] = useState({
    // Qualifier
    hasExistingBusiness: null,
    revenue: null,
    industry: null,
    otherIndustry: '',
    state: null,

    // Contact
    companyName: '',
    fullName: '',
    email: '',
    phone: '',

    // Plan + scheduling
    selectedPlan: null,
    selectedDate: null,
    selectedTime: null,

    // Entity formation — always LLC now (entity-type step skipped per QA)
    entityType: 'llc',
    businessAddress: '',
    businessPurpose: '',
    members: [],

    // Billing
    billingAddress: { line1: '', city: '', state: '', zip: '' },

    // Flow flags
    purchased: false,        // set true after successful checkout (EF flow)
    meetNow: false,          // user wants instant Meet Now session

    // Tax savings reveal
    taxSavingsEstimate: null,
  })

  const update = (fields) => setData((p) => ({ ...p, ...fields }))

  return (
    <FunnelContext.Provider value={{ data, update }}>
      {children}
    </FunnelContext.Provider>
  )
}

export const useFunnel = () => {
  const ctx = useContext(FunnelContext)
  if (!ctx) throw new Error('useFunnel must be inside FunnelProvider')
  return ctx
}
