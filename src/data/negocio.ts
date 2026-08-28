export const NEGOCIO = {
  telefono: '51994647840',
  telefonoVisible: '994 647 840',
  eslogan: 'Pureza que refresca tu vida',
  facebook: 'https://www.facebook.com/villafreshlima',
  instagram: 'https://www.instagram.com/villafresh.lima/',
} as const

/** Enlace de WhatsApp con el mensaje ya escrito. */
export function urlWhatsApp(texto?: string): string {
  const base = `https://wa.me/${NEGOCIO.telefono}`
  return texto ? `${base}?text=${encodeURIComponent(texto)}` : base
}
