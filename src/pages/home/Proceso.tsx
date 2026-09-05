import { IconoBurbujas, IconoFiltro, IconoMembrana, IconoNivel } from '../../components/Icono'
import SecuenciaAgua from '../../components/SecuenciaAgua'

/** Los cuatro pasos documentados. El icono distingue; el número ordena.
 *  Sin cero a la izquierda: «01» no ordena mejor que «1», sólo viste. */
const PASOS = [
  {
    n: '1',
    icono: <IconoFiltro />,
    titulo: 'Filtrado y sedimentación',
    texto: 'Retención de partículas, cloro y sedimentos. Es el paso que nadie ve y del que depende todo lo demás.',
  },
  {
    n: '2',
    icono: <IconoMembrana />,
    titulo: 'Ósmosis inversa',
    texto: 'Una membrana separa sales y minerales disueltos. El corazón del proceso y la razón del sabor.',
  },
  {
    n: '3',
    icono: <IconoNivel />,
    titulo: 'Alcalinización a pH 8.3',
    texto: 'El agua vuelve a un pH alcalino y estable de 8.3.',
  },
  {
    n: '4',
    icono: <IconoBurbujas />,
    titulo: 'Ozonización y sellado',
    texto: 'Desinfección final sin residuo químico y sello de seguridad en el envase. Si el sello está roto, no lo recibas.',
  },
]

export default function Proceso() {
  return (
    <section className="band" id="proceso">
      <div className="wrap">
        <div className="split">
          <div>
            {/* Decía «Ocho pasos entre el agua y tu vaso» y debajo hay cuatro.
                Los ocho procesos están respaldados por las redes; el desglose
                no, y la nota de pendientes lo reconoce. Era la única frase de
                la web que prometía algo que la propia página no cumplía dos
                centímetros más abajo, y justo en la sección que existe para
                dar confianza. El titular deja de contar; cuando llegue el
                desglose, los ocho podrán citarse en texto corrido. */}
            <h2 style={{ marginTop: 18 }}>De la planta<br />a tu vaso.</h2>
          </div>
          <p className="lede" style={{ maxWidth: '46ch' }}>No compramos agua a terceros ni reenvasamos. Tratamos, controlamos y embotellamos nosotros mismos, y por eso podemos responder por cada bidón que sale de planta.</p>
        </div>

        {/* El vídeo y los pasos comparten bloque a propósito: el vídeo se queda
            fijo mientras los cuatro pasos pasan por delante, así que el agua se
            va asentando conforme se lee. Suelto encima de la sección era una
            caja negra que no tenía que ver con lo que había alrededor. */}
        <div className="proceso-cuerpo">
          <SecuenciaAgua />
          <div className="pasos">
            {PASOS.map((paso) => (
              <div className="paso" key={paso.n}>
                <div className="k">{paso.icono}{paso.n}</div>
                <h3>{paso.titulo}</h3>
                <p className="dimtext">{paso.texto}</p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
