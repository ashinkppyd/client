import { createRoot } from 'react-dom/client'
import { GoogleOAuthProvider } from '@react-oauth/google'
import './index.css'
import App from './App.jsx'

createRoot(document.getElementById('root')).render(
  <GoogleOAuthProvider clientId="419885098439-u8ng3g03m8p9slsp2i7pl3km708qh2pc.apps.googleusercontent.com">
    <App />
  </GoogleOAuthProvider>
)