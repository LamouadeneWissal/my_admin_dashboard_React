import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
// We don't need to import index.css anymore since we're using the CDN
import App from './App.jsx'
import TailwindTest from './components/TailwindTest'
import { ThemeProvider } from './context/ThemeContext'

// Use TailwindTest component for testing Tailwind CSS
const componentToRender = window.location.pathname === '/tailwind-test' 
  ? <TailwindTest /> 
  : <App />;

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ThemeProvider>
      {componentToRender}
    </ThemeProvider>
  </StrictMode>,
)
