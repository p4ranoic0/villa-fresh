import { activo } from '../../rutas-publicas'

export default function Preguntas() {
  return (
    <section className="band" id="preguntas" style={{ paddingTop: 0 }}>
      <div className="wrap">
        {/* La ultima banda de contenido antes del pie cerraba con el titular
            solo y setecientos pixeles de nada a su derecha. El bidon la cierra
            con el producto, que es de lo que van las cuatro preguntas.
            Decorativo para el lector de pantalla: no anade informacion que no
            este ya escrita al lado. */}
        <div className="banda-cabecera">
          <h2>Lo que más nos preguntan.</h2>
          <img
            className="objeto-banda objeto-alto"
            src={activo('/producto-bidon-20l.webp')}
            alt=""
            aria-hidden="true"
            width={353}
            height={668}
            loading="lazy"
          />
        </div>
        <div className="qas">
          <div className="qa">
            <h3>¿Necesito entregar un envase vacío?</h3>
            <p className="dimtext">En la primera compra coordinamos el envase; de ahí en adelante cambias vacío por lleno y pagas S/ 20 de recarga. Si necesitas comprar el envase aparte, consúltanos por WhatsApp.</p>
          </div>
          <div className="qa">
            <h3>¿En cuánto llega el pedido?</h3>
            <p className="dimtext">El mismo día dentro de Lima Metropolitana. Escribes por WhatsApp y te confirmamos la hora según la ruta de reparto de ese día.</p>
          </div>
          <div className="qa">
            <h3>¿Es agua mineral de manantial?</h3>
            <p className="dimtext">No. Es agua de mesa tratada: ósmosis inversa, alcalinización y ozonización en planta propia. Precisamente por eso el resultado es el mismo en cada bidón.</p>
          </div>
          <div className="qa">
            <h3>¿Cómo se paga?</h3>
            <p className="dimtext">Con Yape al momento de la entrega. Para empresas se coordina la modalidad que necesite administración.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
