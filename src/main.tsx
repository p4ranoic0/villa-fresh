import { createRoot, hydrateRoot } from 'react-dom/client'
import App from './App'
import './styles/site.css'

const raiz = document.getElementById('root')!
if (import.meta.env.PROD) hydrateRoot(raiz, <App />)
else createRoot(raiz).render(<App />)
