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

    // Contact (collected at different points based on path)
    companyName: '',
    fullName: '',
    email: '',
    phone: '',

    // Plan + scheduling
    selectedPlan: null,
    selectedDate: null,
    selectedTime: null,

    // Entity formation (under-50k + no business path)
    entityType: null,
    businessAddress: '',
    businessPurpose: '',
    members: [],

    // Tax savings reveal (under-50k + has business path)
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
