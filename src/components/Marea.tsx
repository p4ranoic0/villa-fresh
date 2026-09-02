/**
 * La línea de agua sobre la que se apoya la portada.
 *
 * Es lo único de la página que se mueve sin que nadie lo pida, y existe por
 * una razón concreta: hasta aquí el sitio estaba completamente quieto. Una
 * página quieta sobre un producto líquido no transmite el producto, transmite
 * un catálogo impreso. La marea no informa de nada —no tiene que hacerlo—,
 * sólo evita que la portada parezca una captura de pantalla.
 *
 * Por qué una onda y no un degradado a la deriva: el degradado en movimiento
 * es mobiliario de plantilla y no dice agua, dice «efecto». Una superficie
 * ondulando dice agua y no dice nada más.
 *
 * EL EMPALME. El trazo mide el doble de ancho que su marco y contiene ocho
 * periodos completos. La animación lo desplaza exactamente la mitad —cuatro
 * periodos—, así que al volver al principio la curva coincide consigo misma
 * y el ciclo no tiene costura. Si el desplazamiento no cayera en un múltiplo
 * del periodo, cada vuelta daría un salto visible.
 */

const ANCHO = 2880
const ALTO = 120
const PERIODOS = 8
const PERIODO = ANCHO / PERIODOS

/**
 * Una onda completa por periodo: media curva por encima de la línea de agua y
 * media por debajo, en cúbicas para que la cresta no tenga vértice.
 *
 * `linea` es la altura en reposo y `amplitud` cuánto sube y baja. Las dos capas
 * usan valores distintos, que es lo que da la sensación de fondo y superficie.
 */
function trazo(linea: number, amplitud: number): string {
  const c1 = PERIODO / 6
  const c2 = PERIODO / 3
  const medio = PERIODO / 2
  let d = `M0 ${linea}`
  for (let i = 0; i < PERIODOS; i += 1) {
    d += `c${c1} ${-amplitud} ${c2} ${-amplitud} ${medio} 0`
    d += `c${c1} ${amplitud} ${c2} ${amplitud} ${medio} 0`
  }
  return `${d}V${ALTO}H0Z`
}

export default function Marea() {
  return (
    <div className="marea" aria-hidden="true">
      <svg className="marea-capa marea-fondo" viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none">
        <path d={trazo(46, 15)} />
      </svg>
      <svg className="marea-capa marea-cara" viewBox={`0 0 ${ANCHO} ${ALTO}`} preserveAspectRatio="none">
        <path d={trazo(64, 22)} />
      </svg>
    </div>
  )
}
