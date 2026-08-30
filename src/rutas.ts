export interface MetaRuta {
  /** Ruta de React Router. */
  path: string
  /** Archivo que escribe el prerender, relativo a dist/. */
  archivo: string
  title: string
  description: string
  imagenOg: string
}

// [ DOMINIO PENDIENTE — cambiar cuando exista el dominio real ]
export const SITIO_URL = 'https://villafresh.pe'

export const RUTAS: MetaRuta[] = [
  {
    path: '/',
    archivo: 'index.html',
    title: 'Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30',
    description:
      'Bidón de 20 litros de agua purificada por ósmosis inversa, ozonizada y alcalinizada a pH 8.3. Planta propia, sin intermediarios. Entrega el mismo día en Lima Metropolitana. S/30 el bidón, 2 por S/50, recarga S/20.',
    imagenOg: '/og-villafresh.jpg',
  },
]
