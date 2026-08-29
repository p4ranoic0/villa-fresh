import { useEffect, useRef } from 'react'
import { IconoWhatsApp } from '../../components/Icono'
import { PRODUCTOS } from '../../data/productos'
import { urlWhatsApp } from '../../data/negocio'
import { mensajeWhatsApp, soles } from './mensajeWhatsApp'
import type { usePedido } from './usePedido'

interface Props {
  abierto: boolean
  onCerrar: () => void
  pedido: ReturnType<typeof usePedido>
}

export default function CajonPedido({ abierto, onCerrar, pedido }: Props) {
  const botonCerrar = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!abierto) return
    const alPulsar = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onCerrar()
    }
    document.addEventListener('keydown', alPulsar)
    document.body.style.overflow = 'hidden'
    botonCerrar.current?.focus()
    return () => {
      document.removeEventListener('keydown', alPulsar)
      document.body.style.overflow = ''
    }
  }, [abierto, onCerrar])

  const enviar = () => {
    if (pedido.lineas.length === 0) return
    window.open(
      urlWhatsApp(mensajeWhatsApp(pedido.lineas, PRODUCTOS)),
      '_blank',
      'noopener',
    )
  }

  return (
    <div
      className="drawer"
      id="vf-drawer"
      role="dialog"
      aria-modal="true"
      aria-label="Tu pedido"
      {...(abierto ? { open: true } : {})}
    >
      <div className="veil" id="vf-veil" onClick={onCerrar} />
      <div className="panel">
        <div className="head">
          <span className="lbl" style={{ color: 'var(--ink)' }}>Tu pedido</span>
          <button className="btn btn-ghost btn-sm" id="vf-cerrar" type="button" onClick={onCerrar} ref={botonCerrar}>Cerrar</button>
        </div>
        <div className="body" id="vf-lineas">
          {pedido.lineas.length === 0 ? (
            <p className="note" style={{ padding: '28px 0' }}>Tu pedido está vacío. Agrega productos del catálogo y los enviamos juntos por WhatsApp.</p>
          ) : (
            pedido.lineas.map((linea) => {
              const producto = PRODUCTOS.find((p) => p.sku === linea.sku)
              if (!producto) return null
              const subtotal = producto.precio !== null
                ? soles(producto.precio * linea.cantidad)
                : 'A cotizar'
              return (
                <div className="line" key={linea.sku}>
                  <div className="nm">
                    {producto.nombre}
                    <div className="sku" style={{ marginTop: '4px' }}>{producto.sku}</div>
                  </div>
                  <div className="pr">{subtotal}</div>
                  <div className="qty">
                    <button type="button" onClick={() => pedido.decrementar(linea.sku)} aria-label="Quitar uno">−</button>
                    <span>{linea.cantidad}</span>
                    <button type="button" onClick={() => pedido.incrementar(linea.sku)} aria-label="Agregar uno">+</button>
                  </div>
                  <button type="button" className="rm" onClick={() => pedido.quitar(linea.sku)}>Quitar</button>
                </div>
              )
            })
          )}
        </div>
        <div className="foot2">
          <div className="total">
            <span className="t">Total</span>
            <span className="v" id="vf-total">{soles(pedido.total)}</span>
          </div>
          {pedido.pendientes && (
            <p className="note" id="vf-aviso">Hay productos sin precio publicado: van al mensaje como “a cotizar” y te respondemos con el monto.</p>
          )}
          <button
            className="btn btn-wa"
            id="vf-enviar"
            type="button"
            disabled={pedido.lineas.length === 0}
            onClick={enviar}
          >
            <IconoWhatsApp />
            Enviar pedido por WhatsApp
          </button>
          <button className="btn btn-ghost btn-sm" id="vf-limpiar" type="button" onClick={pedido.limpiar}>Vaciar pedido</button>
          <p className="note">Pago con Yape, efectivo o transferencia al recibir.</p>
        </div>
      </div>
    </div>
  )
}
