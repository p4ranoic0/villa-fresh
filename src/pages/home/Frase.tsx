import { FRASE, FRASE_ACENTO } from '../../data/contenido'

const PALABRAS = [
  ...FRASE.split(' ').map((w) => ({ w, acento: false })),
  ...FRASE_ACENTO.split(' ').map((w) => ({ w, acento: true })),
]

/** Fondo oscuro y una frase que se ilumina palabra por palabra al bajar. */
export default function Frase() {
  return (
    <section className="frase" data-escena="frase">
      <div className="escena-fija frase-fija">
        <div className="frase-in">
          <div className="rotulo rotulo-oscuro">Planta propia</div>
          <p className="frase-texto">
            {PALABRAS.map(({ w, acento }, i) => (
              <span key={i} data-w="" className={acento ? 'acento-oscuro' : undefined}>{w}</span>
            ))}
          </p>
        </div>
      </div>
    </section>
  )
}
