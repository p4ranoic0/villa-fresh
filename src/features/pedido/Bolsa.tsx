import { useEffect, useRef } from 'react'
import { IconoBolsa, IconoCerrar, IconoWhatsApp } from '../../components/Iconos'
import { DISTRITOS, DISTRITO_OTRO, PAGOS } from '../../data/contenido'
import { urlWhatsApp } from '../../data/negocio'
import { PRODUCTOS } from '../../data/productos'
import { soles } from './mensajeWhatsApp'
import { lineasConProducto } from './pedido'
import type { Pedido } from './usePedido'

interface Props {
  abierta: boolean
  onCerrar: () => void
  onVerProductos: () => void
  pedido: Pedido
}

export function rotuloUnidades(unidades: number): string {
  return `${unidades} ${unidades === 1 ? 'producto' : 'productos'}`
}

export function rotuloTotal(total: number, pendientes: boolean): string {
  return `${soles(total)}${pendientes ? ' + cotización' : ''}`
}

/** Panel lateral con el detalle del pedido, la entrega y el pago. */
export default function Bolsa({ abierta, onCerrar, onVerProductos, pedido }: Props) {
  const botonCerrar = useRef<HTMLButtonElement>(null)
  const { entrega, cambiarEntrega } = pedido
  const lineas = lineasConProducto(pedido.lineas, PRODUCTOS)
  const vacia = pedido.unidades === 0

  useEffect(() => {
    if (!abierta) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsar)
    botonCerrar.current?.focus()
    return () => document.removeEventListener('keydown', alPulsar)
  }, [abierta, onCerrar])

  return (
    <>
      <div className="velo" data-abierta={abierta || undefined} onClick={onCerrar} />
      <aside
        className="bolsa"
        role="dialog"
        aria-modal="true"
        aria-label="Tu bolsa"
        aria-hidden={!abierta}
        inert={!abierta}
        data-abierta={abierta || undefined}
        data-lenis-prevent=""
      >
        <div className="bolsa-cabeza">
          <div>
            <h2>Tu bolsa</h2>
            <div className="bolsa-cuenta">{rotuloUnidades(pedido.unidades)}</div>
          </div>
          <button ref={botonCerrar} type="button" className="bolsa-cerrar" onClick={onCerrar} aria-label="Cerrar">
            <IconoCerrar />
          </button>
        </div>

        <div className="bolsa-cuerpo">
          {vacia ? (
            <div className="bolsa-vacia">
              <IconoBolsa className="bolsa-vacia-ico" />
              <h3>Tu bolsa está vacía.</h3>
              <p>Agrega bidones o recargas y te armamos el mensaje de WhatsApp.</p>
              <button type="button" className="btn btn-md" onClick={onVerProductos}>Ver productos</button>
            </div>
          ) : (
            <>
              <div>
                {lineas.map(({ linea, producto }) => (
                  <div key={producto.sku} className="linea">
                    <div className="linea-foto">
                      <img src={producto.imagen} alt="" />
                    </div>
                    <div className="linea-info">
                      <div className="linea-nombre">{producto.nombre}</div>
                      <div className="linea-unidad">
                        {producto.precio === null ? `A cotizar · ${producto.unidad}` : `${soles(producto.precio)} c/u · ${producto.unidad}`}
                      </div>
                      <div className="linea-controles">
                        <div className="stepper stepper-sm">
                          <button type="button" onClick={() => pedido.decrementar(producto.sku)} aria-label="Quitar uno">−</button>
                          <span>{linea.cantidad}</span>
                          <button type="button" onClick={() => pedido.agregar(producto.sku)} aria-label="Agregar uno">+</button>
                        </div>
                        <button type="button" className="linea-eliminar" onClick={() => pedido.quitar(producto.sku)}>Eliminar</button>
                      </div>
                    </div>
                    <div className="linea-subtotal">
                      {producto.precio === null ? 'A cotizar' : soles(producto.precio * linea.cantidad)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="bolsa-bloque">
                <div className="rotulo-sm">Entrega</div>
                <div className="bolsa-campos">
                  <input
                    className="campo"
                    value={entrega.direccion}
                    onChange={(e) => cambiarEntrega({ direccion: e.target.value })}
                    placeholder="Dirección (calle, número, dpto.)"
                    aria-label="Dirección"
                    autoComplete="street-address"
                  />
                  <select
                    className="campo campo-select"
                    value={entrega.distrito}
                    onChange={(e) => cambiarEntrega({ distrito: e.target.value })}
                    aria-label="Distrito"
                  >
                    <option value="">Distrito</option>
                    {[...DISTRITOS, DISTRITO_OTRO].map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                  <input
                    className="campo"
                    value={entrega.referencia}
                    onChange={(e) => cambiarEntrega({ referencia: e.target.value })}
                    placeholder="Referencia u horario (opcional)"
                    aria-label="Referencia u horario"
                  />
                </div>
              </div>

              <div className="bolsa-bloque bolsa-bloque-pago">
                <div className="rotulo-sm">Pago al recibir</div>
                <div className="segmentado" role="radiogroup" aria-label="Pago al recibir">
                  {PAGOS.map((pago) => (
                    <button
                      key={pago}
                      type="button"
                      role="radio"
                      aria-checked={entrega.pago === pago}
                      className="segmento"
                      onClick={() => cambiarEntrega({ pago })}
                    >
                      {pago}
                    </button>
                  ))}
                </div>
              </div>

              <div className="resumen">
                <div className="resumen-fila"><span className="tenue">Subtotal</span><span>{soles(pedido.total)}</span></div>
                <div className="resumen-fila"><span className="tenue">Delivery</span><span className="tenue">Se confirma por WhatsApp</span></div>
                {pedido.pendientes && (
                  <div className="resumen-fila"><span className="tenue">Productos a cotizar</span><span className="tenue">{pedido.aCotizar}</span></div>
                )}
                <div className="resumen-fila resumen-total"><span>Total</span><span>{rotuloTotal(pedido.total, pedido.pendientes)}</span></div>
                <div className="resumen-nota">IGV incluido. Los productos a cotizar se confirman en el chat.</div>
              </div>
            </>
          )}
        </div>

        {!vacia && (
          <div className="bolsa-pie">
            {(!entrega.direccion.trim() || !entrega.distrito) && (
              <div className="bolsa-aviso">Puedes completar la dirección ahora o en el chat.</div>
            )}
            <a href={urlWhatsApp(pedido.mensaje)} target="_blank" rel="noopener" className="btn bolsa-enviar">
              <IconoWhatsApp />
              Enviar pedido por WhatsApp
            </a>
          </div>
        )}
      </aside>
    </>
  )
}
