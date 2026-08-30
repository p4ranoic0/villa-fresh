import { existeLogoYape } from '../data/negocio'
import { activo } from '../rutas-publicas'

/**
 * Medios de pago aceptados.
 *
 * El logotipo de Yape es marca registrada de un tercero y Yape no publica un
 * kit de marca, así que no se dibuja aquí ni se copia de su web: el hueco
 * está cableado y el archivo lo pone el negocio en `public/pago-yape.svg`.
 * Mientras no exista, se nombra el medio con la tipografía del sitio, que es
 * igual de cierto y no inventa la marca de nadie.
 *
 * Efectivo y transferencia salen porque nadie los ha confirmado todavía; ver
 * contenido/verificacion.md, punto 02.
 */
export default function Pagos() {
  return (
    <div className="pagos">
      <span className="lbl">Pago al recibir</span>
      <ul className="pagos-lista">
        <li>
          {existeLogoYape
            ? <img src={activo('/pago-yape.svg')} alt="Yape" height={20} />
            : <span className="pago-nombre">Yape</span>}
        </li>
      </ul>
    </div>
  )
}
