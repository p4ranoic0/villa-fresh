const PRECIOS = [
  { rotulo: 'Un bidón', cifra: 30, texto: 'Bidón de 20 L sellado, en tu puerta el mismo día.' },
  { rotulo: 'Dos bidones', cifra: 50, texto: 'Dos bidones en una sola entrega, al precio de promoción.', ahorro: 'Ahorras S/ 10' },
  { rotulo: 'Recarga', cifra: 20, texto: 'Cambias tu bidón vacío por uno lleno y sellado.' },
]

export default function Precios() {
  return (
    <section id="precio" className="seccion seccion-blanca">
      <div className="contenedor">
        <div data-reveal="" className="encabezado-centro">
          <h2 className="titulo-seccion">Lo que cuesta<br />es lo que cuesta.</h2>
          <p className="bajada bajada-centro">Sin distribuidor ni comisión de por medio. El bidón de 20 litros cuesta lo mismo hoy que la próxima semana.</p>
        </div>
        <div className="precios">
          {PRECIOS.map((p) => (
            <div key={p.cifra} data-reveal="" className={p.ahorro ? 'precio precio-destacado' : 'precio'}>
              <div className="precio-cabeza">
                <span className="rotulo">{p.rotulo}</span>
                {p.ahorro && <span className="precio-ahorro">{p.ahorro}</span>}
              </div>
              <div className="precio-cifra">
                <span className="precio-moneda">S/</span>
                <span className="precio-monto" data-count={p.cifra}>{p.cifra}</span>
              </div>
              <p>{p.texto}</p>
            </div>
          ))}
        </div>
        <p data-reveal="" className="precios-nota">Pagas al recibir: Yape, efectivo o transferencia. IGV incluido.</p>
      </div>
    </section>
  )
}
