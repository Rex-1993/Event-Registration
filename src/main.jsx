import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { ThemeProvider } from "./components/ThemeProvider"

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">
      {console.log("%c WEBSITE VERSION v1.3 LOADED ", "background: red; color: white; font-size: 20px;")}
      <App />
    </ThemeProvider>
  </StrictMode>,
)
