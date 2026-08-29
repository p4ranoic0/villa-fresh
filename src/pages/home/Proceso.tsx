import { IconoBurbujas, IconoFiltro, IconoMembrana, IconoNivel } from '../../components/Icono'
import SecuenciaAgua from '../../components/SecuenciaAgua'

/** Los cuatro pasos documentados. El icono distingue; el número ordena. */
const PASOS = [
  {
    n: '01',
    icono: <IconoFiltro />,
    titulo: 'Filtrado y sedimentación',
    texto: 'Retención de partículas, cloro y sedimentos. Es el paso que nadie ve y del que depende todo lo demás.',
  },
  {
    n: '02',
    icono: <IconoMembrana />,
    titulo: 'Ósmosis inversa',
    texto: 'Una membrana separa sales y minerales disueltos. El corazón del proceso y la razón del sabor.',
  },
  {
    n: '03',
    icono: <IconoNivel />,
    titulo: 'Alcalinización a pH 8.3',
    texto: 'El agua vuelve a un pH alcalino y estable, más suave al tomar que el agua de caño.',
  },
  {
    n: '04',
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
            <span className="lbl lbl-cyan">El proceso</span>
            <h2 style={{ marginTop: 18 }}>Ocho pasos<br />entre el agua<br />y tu vaso.</h2>
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

        <p className="ph" style={{ marginTop: 30 }}>[ Estas son las 4 etapas documentadas. El desglose completo de los 8 pasos y el N.° de registro DIGESA — confirmar con planta ]</p>
      </div>
    </section>
  )
}
