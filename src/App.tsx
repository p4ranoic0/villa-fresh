import { useEffect } from 'react'
import { Route, Routes, useLocation } from 'react-router'
import Home from './pages/Home'
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
        {/* Un servidor estático sirve la misma portada en las dos direcciones.
            Sin este alias, quien entre por /index.html carga el HTML correcto
            y luego React no encuentra ruta y lo vacía. */}
        <Route path="/index.html" element={<Home />} />
      </Routes>
    </>
  )
}
