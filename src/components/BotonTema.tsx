import { IconoLuna, IconoSol } from './Icono'

/**
 * Conmutador de tema. Aqui solo esta la forma: quien escucha el clic es el
 * script en linea de index.html, marcado por data-conmuta-tema.
 *
 * Es a proposito. La pagina se publica pre-renderizada, asi que el HTML llega
 * mucho antes que el bundle; con un onClick de React el boton quedaria mudo
 * hasta que termine de hidratar. Tampoco guarda el tema en estado: en el
 * servidor no existe ni el sistema del visitante ni su eleccion previa, y
 * cualquier estado aqui daria una hidratacion distinta a la del pre-render.
 * El icono que se ve lo elige el CSS a partir del mismo data-tema.
 */
export default function BotonTema() {
  return (
    <button
      className="tema-btn"
      type="button"
      data-conmuta-tema=""
      aria-label="Cambiar entre tema claro y oscuro"
    >
      <IconoSol />
      <IconoLuna />
    </button>
  )
}
