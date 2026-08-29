import { useEffect, useRef } from 'react'
import { IconoCarrito } from '../../components/Icono'

interface Props {
  unidades: number
  onAbrir: () => void
}

export default function BotonCarrito({ unidades, onAbrir }: Props) {
  const ref = useRef<HTMLButtonElement>(null)
  const previas = useRef(unidades)

  // Pulso de 450 ms al agregar. Reinicia la animación forzando un reflow,
  // igual que hacía pulso() en el sitio actual.
  useEffect(() => {
    if (unidades > previas.current && ref.current) {
      const boton = ref.current
      boton.classList.remove('pulse')
      void boton.offsetWidth
      boton.classList.add('pulse')
    }
    previas.current = unidades
  }, [unidades])

  return (
    <button className="cart-btn" id="vf-abrir" type="button" onClick={onAbrir} ref={ref}>
      <IconoCarrito />
      Pedido{' '}
      <span className="count" id="vf-count" hidden={unidades === 0}>
        {unidades}
      </span>
    </button>
  )
}
