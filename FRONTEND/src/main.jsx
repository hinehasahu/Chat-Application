import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// import './index.css'
import './output.css'
import App from './App.jsx'
import { AuthProvider } from './context/AuthContext.jsx'
import { SocketProvider } from './context/SocketContext.jsx'

createRoot(document.getElementById('root')).render(
  <SocketProvider>
  <AuthProvider>
    <App />
  </AuthProvider>
  </SocketProvider>
)
