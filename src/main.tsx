import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App'
import './styles/site.css'

const app = (
  <BrowserRouter>
    <App />
  </BrowserRouter>
)

const raiz = document.getElementById('root')!
if (import.meta.env.PROD) hydrateRoot(raiz, app)
else createRoot(raiz).render(app)
