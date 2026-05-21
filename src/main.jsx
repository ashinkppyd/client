import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'  
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="439470469308-jogdufc2e60kcbp02vdctdfdbbd9iu49.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)
