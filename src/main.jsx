import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { GardenDataProvider } from './context/GardenDataContext.jsx'
import { AuthProvider } from './context/AuthContext.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <GardenDataProvider>
        <App />
      </GardenDataProvider>
    </AuthProvider>
  </StrictMode>,
)
