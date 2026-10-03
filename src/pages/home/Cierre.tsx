import { NEGOCIO, urlWhatsApp } from '../../data/negocio'

export default function Cierre() {
  return (
    <section className="seccion cierre">
      <div data-reveal="" className="contenedor cierre-in">
        <div className="rotulo rotulo-sobre-acento">Pedidos por WhatsApp</div>
        <a href={urlWhatsApp()} target="_blank" rel="noopener" className="cierre-numero">{NEGOCIO.telefonoVisible}</a>
        <p className="bajada cierre-bajada">Escribe la dirección y cuántos bidones. Nada de formularios.</p>
        <div className="cierre-acciones">
          <a href={urlWhatsApp()} target="_blank" rel="noopener" className="btn btn-lg btn-claro">Escribir ahora</a>
          <a href={NEGOCIO.instagram} target="_blank" rel="noopener" className="btn btn-lg btn-borde">Instagram</a>
          <a href={NEGOCIO.facebook} target="_blank" rel="noopener" className="btn btn-lg btn-borde">Facebook</a>
        </div>
      </div>
    </section>
  )
}
