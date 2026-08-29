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
        <div className="pasos">
          <div className="paso">
            <div className="k">01</div>
            <h3>Filtrado y sedimentación</h3>
            <p className="dimtext">Retención de partículas, cloro y sedimentos. Es el paso que nadie ve y del que depende todo lo demás.</p>
          </div>
          <div className="paso">
            <div className="k">02</div>
            <h3>Ósmosis inversa</h3>
            <p className="dimtext">Una membrana separa sales y minerales disueltos. El corazón del proceso y la razón del sabor.</p>
          </div>
          <div className="paso">
            <div className="k">03</div>
            <h3>Alcalinización a pH 8.3</h3>
            <p className="dimtext">El agua vuelve a un pH alcalino y estable, más suave al tomar que el agua de caño.</p>
          </div>
          <div className="paso">
            <div className="k">04</div>
            <h3>Ozonización y sellado</h3>
            <p className="dimtext">Desinfección final sin residuo químico y sello de seguridad en el envase. Si el sello está roto, no lo recibas.</p>
          </div>
        </div>
        <p className="ph" style={{ marginTop: 30 }}>[ Estas son las 4 etapas documentadas. El desglose completo de los 8 pasos y el N.° de registro DIGESA — confirmar con planta ]</p>
      </div>
    </section>
  )
}
