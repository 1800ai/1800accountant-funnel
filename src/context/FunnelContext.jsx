import { createContext, useContext, useState } from 'react'

const FunnelContext = createContext()

export function FunnelProvider({ children }) {
  const [data, setData] = useState({
    hasExistingBusiness: null,
    revenue: null,
    industry: null,
    state: null,
    companyName: '',
    fullName: '',
    email: '',
    phone: '',
    selectedPlan: null,
    selectedDate: null,
    selectedTime: null,
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
