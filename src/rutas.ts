export interface MetaRuta {
  /** Ruta de React Router. */
  path: string
  /** Archivo que escribe el prerender, relativo a dist/. */
  archivo: string
  title: string
  description: string
}

export const RUTAS: MetaRuta[] = [
  {
    path: '/',
    archivo: 'index.html',
    title: 'Villa Fresh — Agua purificada a domicilio en Lima | Bidón 20 L S/30',
    description:
      'Bidón de 20 litros de agua purificada por ósmosis inversa, ozonizada y alcalinizada a pH 8.3. Planta propia, sin intermediarios. Entrega el mismo día en Lima Metropolitana. S/30 el bidón, 2 por S/50.',
  },
  {
    path: '/catalogo.html',
    archivo: 'catalogo.html',
    title: 'Catálogo — Villa Fresh | Bidones, recarga y accesorios en Lima',
    description:
      'Catálogo de Villa Fresh: bidón de 20 L a S/30, 2 por S/50, recarga, envase vacío, botellas y dispensador. Arma tu pedido y lo cierras por WhatsApp.',
  },
]
