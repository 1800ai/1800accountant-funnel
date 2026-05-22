import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { FunnelProvider } from './context/FunnelContext'
import App from './App'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <BrowserRouter>
      <FunnelProvider>
        <App />
      </FunnelProvider>
    </BrowserRouter>
  </StrictMode>
)
