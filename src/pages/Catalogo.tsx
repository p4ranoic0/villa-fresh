import { useState } from 'react'
import Footer from '../components/Footer'
import { IconoCarrito } from '../components/Icono'
import Nav from '../components/Nav'
import WaFlotante from '../components/WaFlotante'
import { PRODUCTOS } from '../data/productos'
import FiltrosCatalogo from '../features/catalogo/FiltrosCatalogo'
import Grilla from '../features/catalogo/Grilla'
import { alternar, filtrarPorCategorias } from '../features/catalogo/filtros'
import { usePedido } from '../features/pedido/usePedido'
import type { CategoriaId } from '../types'

export default function Catalogo() {
  const [activas, setActivas] = useState<ReadonlySet<CategoriaId>>(new Set())
  const visibles = filtrarPorCategorias(PRODUCTOS, activas)
  const pedido = usePedido()

  const botonCarrito = (
    <button className="cart-btn" id="vf-abrir" type="button">
      <IconoCarrito />
      Pedido{' '}
      <span className="count" id="vf-count" hidden={pedido.unidades === 0}>
        {pedido.unidades}
      </span>
    </button>
  )

  return (
    <>
      <Nav enCatalogo accion={botonCarrito} />

      <section className="band" style={{ paddingBottom: 'clamp(28px,4vw,44px)' }}>
        <div className="wrap">
          <span className="lbl lbl-cyan">Catálogo</span>
          <h2 style={{ margin: '18px 0 20px' }}>Arma tu pedido.</h2>
          <p className="lede" style={{ maxWidth: '56ch' }}>Elige lo que necesitas y lo enviamos armado por WhatsApp: llega la lista completa con cantidades y total, y desde ahí coordinamos dirección y hora.</p>
        </div>
      </section>

      <section style={{ paddingBottom: 'var(--band)' }}>
        <div className="wrap cat-layout">
          <aside className="filters">
            <fieldset>
              <legend className="lbl" style={{ marginBottom: '6px' }}>Categorías</legend>
              <FiltrosCatalogo
                activas={activas}
                onAlternar={(id) => setActivas((actuales) => alternar(actuales, id))}
              />
            </fieldset>
            <p className="note" style={{ borderTop: '1px solid var(--line)', paddingTop: 18 }}>Sin ninguna marcada se muestra todo el catálogo.</p>
          </aside>

          <div>
            <div className="cat-head">
              <span className="lbl" id="vf-cuenta">
                {visibles.length} {visibles.length === 1 ? 'producto' : 'productos'}
              </span>
              <span className="lbl">Precios en soles · IGV incluido</span>
            </div>
            <Grilla productos={visibles} onAgregar={pedido.agregar} />
            <p className="ph" style={{ marginTop: 28 }}>[ Precios de recarga, envase, botellas y dispensador — confirmar y cargarlos en src/data/productos.ts ]</p>
          </div>
        </div>
      </section>

      <Footer />
      <WaFlotante />
    </>
  )
}
