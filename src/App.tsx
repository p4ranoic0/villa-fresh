import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
import Catalogo from './pages/Catalogo'
import { RUTAS } from './rutas'

/** Mantiene el <title> al navegar en cliente; en el HTML publicado lo pone el prerender. */
function Titulo() {
  const { pathname } = useLocation()
  useEffect(() => {
    const ruta = RUTAS.find((r) => r.path === pathname)
    if (ruta) document.title = ruta.title
  }, [pathname])
  return null
}

export default function App() {
  return (
    <>
      <Titulo />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalogo" element={<Catalogo />} />
      </Routes>
    </>
  )
}
