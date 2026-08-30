export function IconoWhatsApp() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-5.6A8 8 0 0 1 13 4a8 8 0 0 1 8 8z" />
    </svg>
  )
}

export function IconoCheck() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4.5 12.5l5 5 10-11" />
    </svg>
  )
}

export function IconoCarrito() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M5 8h14l-1.2 11a2 2 0 0 1-2 1.8H8.2a2 2 0 0 1-2-1.8z" />
      <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
    </svg>
  )
}

export function IconoSol() {
  return (
    <svg className="ico ico-sol" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="12" cy="12" r="4.2" />
      <path d="M12 2.6v2.1M12 19.3v2.1M21.4 12h-2.1M4.7 12H2.6M18.6 5.4l-1.5 1.5M6.9 17.1l-1.5 1.5M18.6 18.6l-1.5-1.5M6.9 6.9L5.4 5.4" />
    </svg>
  )
}

export function IconoLuna() {
  return (
    <svg className="ico ico-luna" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M20.4 14.6A8.6 8.6 0 0 1 9.4 3.6a8.6 8.6 0 1 0 11 11z" />
    </svg>
  )
}

/* --------------------------------------------------------------------------
   Los cuatro pasos del proceso

   Retícula de 24, trazo 1.7, sin relleno, heredando el color del texto. No
   ilustran: distinguen. Cada uno tiene que reconocerse a 22 px y no parecerse
   a su vecino, que es lo único que se le pide a un icono de lista.
   -------------------------------------------------------------------------- */

/** 01 — Filtrado: un embudo y lo que cae dentro. */
export function IconoFiltro() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M8.4 3.4v.01M12 2.6v.01M15.6 3.4v.01" />
      <path d="M3.6 6.6h16.8l-6.6 7.9v5.7l-3.6-2.1v-3.6z" />
    </svg>
  )
}

/** 02 — Ósmosis inversa: la membrana, y lo que la cruza y lo que no. */
export function IconoMembrana() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M11 3v18" />
      <path d="M3.4 12h16.2M17.2 9.6 19.6 12l-2.4 2.4" />
      <path d="M6.4 7.4v.01M8.6 7.4v.01M6.4 16.6v.01M8.6 16.6v.01" />
    </svg>
  )
}

/** 03 — Alcalinización: la gota y su nivel. */
export function IconoNivel() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M12 2.8s-6.2 7-6.2 10.9a6.2 6.2 0 0 0 12.4 0C18.2 9.8 12 2.8 12 2.8z" />
      <path d="M6.1 14.6h11.8" />
    </svg>
  )
}

/** 04 — Ozonización: burbujas subiendo. Es lo que hace el vídeo, en 24 px. */
export function IconoBurbujas() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <circle cx="10.6" cy="17.9" r="2.9" />
      <circle cx="14" cy="11.6" r="2.1" />
      <circle cx="10.8" cy="6.2" r="1.4" />
    </svg>
  )
}

/* --------------------------------------------------------------------------
   Las tres formas de pedir
   -------------------------------------------------------------------------- */

/** Hogar. */
export function IconoCasa() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3 10.9 12 3.6l9 7.3" />
      <path d="M5.5 9.4V20.4h13V9.4" />
      <path d="M9.8 20.4v-5.6h4.4v5.6" />
    </svg>
  )
}

/** Empresa. */
export function IconoEdificio() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M2.6 20.6h18.8" />
      <path d="M5.2 20.6V3.9h9v16.7" />
      <path d="M14.2 10.4h4.6v10.2" />
      <path d="M7.9 8.2h1.4M11.5 8.2h1.4M7.9 13.2h1.4M11.5 13.2h1.4M16.4 14.4h1.4" />
    </svg>
  )
}

/**
 * Obra. Es un cono y no un casco porque el casco no funciona: dibujado a
 * este tamaño es una cúpula sobre una línea, y se lee como un puente. Un
 * icono que hay que explicar no está limpio.
 */
export function IconoCono() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M3.6 20.4h16.8" />
      <path d="M10.2 4.2h3.6l3.8 16.2H6.4z" />
      <path d="M9 9.4h6M8 13.8h8" />
    </svg>
  )
}

/* --------------------------------------------------------------------------
   Redes. Marcas de terceros, redibujadas como trazo en la misma retícula
   para que no rompan el sistema: ni el azul de Facebook ni el degradado de
   Instagram entran en la página.
   -------------------------------------------------------------------------- */

export function IconoFacebook() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <path d="M15.4 3.4h-2.3a4 4 0 0 0-4 4v2.6H6.7v3.3h2.4v7.3" />
      <path d="M9.1 13.3h4.5" />
      <path d="M13.6 20.6v-7.3" />
    </svg>
  )
}

export function IconoInstagram() {
  return (
    <svg className="ico" viewBox="0 0 24 24" aria-hidden="true">
      <rect x="3.4" y="3.4" width="17.2" height="17.2" rx="4.6" />
      <circle cx="12" cy="12" r="4" />
      <path d="M16.9 7.1v.01" />
    </svg>
  )
}
