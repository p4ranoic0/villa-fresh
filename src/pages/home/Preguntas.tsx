export default function Preguntas() {
  return (
    <section className="band" id="preguntas" style={{ paddingTop: 0 }}>
      <div className="wrap">
        <span className="lbl lbl-cyan">Preguntas</span>
        <h2 style={{ margin: '18px 0 40px' }}>Lo que más nos preguntan.</h2>
        <div className="qas">
          <div className="qa">
            <h3>¿Necesito entregar un envase vacío?</h3>
            <p className="dimtext">El bidón es retornable. En la primera compra coordinamos el envase; de ahí en adelante cambias vacío por lleno a precio de recarga. También vendemos el envase por separado.</p>
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
            <p className="dimtext">Yape, efectivo o transferencia al momento de la entrega. Para empresas se coordina la modalidad que necesite administración.</p>
          </div>
        </div>
      </div>
    </section>
  )
}
