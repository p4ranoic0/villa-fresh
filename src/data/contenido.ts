/* ==========================================================================
   Textos de las secciones de la portada. Los productos y precios viven en
   productos.ts; aquí va todo lo demás que se lee en la página.
   ========================================================================== */

export interface Paso {
  n: string
  titulo: string
  texto: string
}

export const PASOS: Paso[] = [
  { n: '01', titulo: 'Filtrado y sedimentación', texto: 'Retención de partículas, cloro y sedimentos. El paso que nadie ve y del que depende todo lo demás.' },
  { n: '02', titulo: 'Ósmosis inversa', texto: 'Una membrana separa sales y minerales disueltos. El corazón del proceso y la razón del sabor.' },
  { n: '03', titulo: 'Alcalinización a pH 8.3', texto: 'El agua vuelve a un pH alcalino y estable de 8.3.' },
  { n: '04', titulo: 'Ozonización y sellado', texto: 'Desinfección final sin residuo químico y sello de seguridad. Si el sello está roto, no lo recibas.' },
]

export interface Plan {
  tipo: string
  titulo: string
  items: string[]
  cierre: string
}

export const PLANES: Plan[] = [
  { tipo: 'Hogar', titulo: 'Deja de cargar bidones desde la bodega.', items: ['Bidón de 20 L con sello de seguridad', 'Entrega el mismo día en tu domicilio', 'Recarga con envase propio a precio especial'], cierre: 'S/ 30 por bidón' },
  { tipo: 'Empresa', titulo: 'Que nunca falte agua en el dispensador.', items: ['Entregas programadas y reposición constante', 'Precio por volumen', 'Abastecimiento desde planta propia'], cierre: 'Precio por volumen' },
  { tipo: 'Obra', titulo: 'Hidratación para la cuadrilla, en el frente.', items: ['Tarifa especial por volumen alto', 'Entregas según el cronograma de obra', 'Entrega directa desde planta'], cierre: 'Tarifa por proyecto' },
]

export const DISTRITOS = [
  'Surquillo', 'Miraflores', 'San Isidro', 'Barranco', 'Surco', 'San Borja',
  'La Molina', 'Lince', 'Jesús María', 'Magdalena', 'Pueblo Libre', 'San Miguel',
]

/** Opción del selector de entrega para quien vive fuera de la lista. */
export const DISTRITO_OTRO = 'Otro (lo indico en el chat)'

export interface Pregunta {
  q: string
  a: string
}

export const PREGUNTAS: Pregunta[] = [
  { q: '¿Necesito entregar un envase vacío?', a: 'En la primera compra coordinamos el envase; de ahí en adelante cambias vacío por lleno y pagas S/ 20 de recarga.' },
  { q: '¿En cuánto llega el pedido?', a: 'El mismo día dentro de Lima Metropolitana. Escribes por WhatsApp y te confirmamos la hora según la ruta de reparto.' },
  { q: '¿Es agua mineral de manantial?', a: 'No. Es agua de mesa tratada: ósmosis inversa, alcalinización y ozonización en planta propia. Por eso el resultado es el mismo en cada bidón.' },
  { q: '¿Cómo se paga?', a: 'Yape, efectivo o transferencia al momento de la entrega. Para empresas se coordina la modalidad que necesite administración.' },
]

/** La frase que se ilumina palabra por palabra; el acento va en celeste. */
export const FRASE = 'No se la compramos a nadie para revenderla. Sale de nuestra planta en Lima, tratada y sellada por nosotros.'
export const FRASE_ACENTO = 'De ahí a tu puerta, sin intermediarios.'

export const PAGOS = ['Yape', 'Efectivo', 'Transferencia'] as const
export type Pago = (typeof PAGOS)[number]
