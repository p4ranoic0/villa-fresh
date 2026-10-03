/* Iconos SVG en línea. Heredan el color con currentColor. */

export function IconoGota() {
  return (
    <svg className="ico-gota" viewBox="0 0 100 120" aria-hidden="true">
      <path d="M50 5C50 5 9 52 9 78a41 41 0 0 0 82 0C91 52 50 5 50 5z" />
      <path d="M23 91L45 62l13 17 10-11 16 21" />
    </svg>
  )
}

export function IconoBolsa({ className = 'ico' }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l-1.2 11.2a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </svg>
  )
}

export function IconoCerrar() {
  return (
    <svg className="ico-cerrar" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  )
}

export function IconoCheck() {
  return (
    <svg className="ico-check" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  )
}

export function IconoWhatsApp() {
  return (
    <svg className="ico-wa" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2a10 10 0 0 0-8.6 15.1L2 22l5-1.3A10 10 0 1 0 12 2zm5.3 14.2c-.2.6-1.3 1.2-1.8 1.2-.5.1-1 .2-3.3-.7-2.8-1.1-4.5-4-4.7-4.2-.1-.2-1.1-1.5-1.1-2.8s.7-2 1-2.3c.2-.3.5-.3.7-.3h.5c.2 0 .4 0 .6.5l.9 2.1c.1.2.1.3 0 .5l-.3.5-.4.5c-.1.1-.3.3-.1.6.2.3.7 1.2 1.6 1.9 1.1 1 2 1.3 2.3 1.4.3.1.5.1.6-.1l.9-1c.2-.3.4-.2.6-.1l2 1c.3.1.5.2.5.3.1.2.1.6-.1 1.2z" />
    </svg>
  )
}
