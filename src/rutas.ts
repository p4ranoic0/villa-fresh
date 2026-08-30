import { activo } from './rutas-publicas'

export interface MetaRuta {
  /** Ruta de React Router. */
  path: string
  /** Archivo que escribe el prerender, relativo a dist/. */
  archivo: string
  title: string
  description: string
  imagenOg: string
}

// URL provisional mientras Villa Fresh no tenga un dominio propio.
export const SITIO_URL = 'https://p4ranoic0.github.io/villa-fresh'

export const RUTAS: MetaRuta[] = [
  {
    path: '/',
    archivo: 'index.html',
    title: 'Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30',
    description:
      'Bidón de 20 litros de agua purificada por ósmosis inversa, ozonizada y alcalinizada a pH 8.3. Planta propia, sin intermediarios. Entrega el mismo día en Lima Metropolitana. S/30 el bidón, 2 por S/50, recarga S/20.',
    imagenOg: activo('/og-villafresh.jpg'),
  },
]
