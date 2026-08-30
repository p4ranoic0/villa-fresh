export const NEGOCIO = {
  nombre: 'Villa Fresh',
  telefono: '51994647840',
  telefonoVisible: '994 647 840',
  eslogan: 'Pureza que refresca tu vida',
  areaAtendida: 'Lima Metropolitana, Perú',
  monedaIso: 'PEN',
  facebook: 'https://www.facebook.com/villafreshlima',
  instagram: 'https://www.instagram.com/villafresh.lima/',
} as const

/**
 * Se pone en true cuando `public/pago-yape.svg` exista.
 *
 * No se detecta en tiempo de ejecución a propósito: el HTML se pre-renderiza,
 * así que preguntar por el archivo desde el navegador llegaría tarde y dejaría
 * el hueco parpadeando. Es una línea que se cambia a mano el día que llegue el
 * archivo oficial.
 */
export const existeLogoYape = false

/** Enlace de WhatsApp con el mensaje ya escrito. */
export function urlWhatsApp(texto?: string): string {
  const base = `https://wa.me/${NEGOCIO.telefono}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
