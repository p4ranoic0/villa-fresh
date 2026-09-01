import Home from './pages/Home'

/**
 * El sitio es una sola página.
 *
 * Aquí vivía React Router: dos rutas —«/» y «/index.html»— que devolvían
 * exactamente el mismo componente, un `<Routes>` para elegir entre ellas y un
 * `useLocation` para reponer el `<title>` al navegar. Nunca hubo dónde navegar.
 * Ese alias de «/index.html» sólo existía porque, sin él, React no encontraba
 * ruta en esa dirección y vaciaba la página: un problema que se creó el router
 * a sí mismo y que sin él no puede darse.
 *
 * El `<title>` lo escribe scripts/prerender.ts en el HTML publicado, que es
 * donde hace falta.
 */
export default function App() {
  return <Home />
}
