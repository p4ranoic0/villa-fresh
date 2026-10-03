import { useCallback, useEffect, useState } from 'react'
import { iniciarAnimaciones, irA, pausarScroll } from '../animaciones'
import Footer from '../components/Footer'
import Nav from '../components/Nav'
import BarraPedido from '../features/pedido/BarraPedido'
import Bolsa from '../features/pedido/Bolsa'
import { usePedido } from '../features/pedido/usePedido'
import Cierre from './home/Cierre'
import Cobertura from './home/Cobertura'
import Frase from './home/Frase'
import Hero from './home/Hero'
import Planes from './home/Planes'
import Precios from './home/Precios'
import Preguntas from './home/Preguntas'
import Proceso from './home/Proceso'
import Productos from './home/Productos'

export default function Home() {
  const pedido = usePedido()
  const [bolsaAbierta, setBolsaAbierta] = useState(false)

  useEffect(iniciarAnimaciones, [])

  // Con la bolsa abierta la página no se desplaza por detrás.
  useEffect(() => {
    pausarScroll(bolsaAbierta)
    return () => pausarScroll(false)
  }, [bolsaAbierta])

  const abrirBolsa = useCallback(() => setBolsaAbierta(true), [])
  const cerrarBolsa = useCallback(() => setBolsaAbierta(false), [])
  const verProductos = useCallback(() => {
    setBolsaAbierta(false)
    pausarScroll(false)
    irA('productos')
  }, [])

  return (
    <>
      <Nav unidades={pedido.unidades} onAbrirBolsa={abrirBolsa} />
      <main>
        <Hero />
        <Frase />
        <Proceso />
        <Precios />
        <Productos lineas={pedido.lineas} onAgregar={pedido.agregar} onQuitarUno={pedido.decrementar} />
        <Planes />
        <Cobertura />
        <Preguntas />
        <Cierre />
      </main>
      <Footer />
      {pedido.unidades > 0 && !bolsaAbierta && <BarraPedido pedido={pedido} onAbrir={abrirBolsa} />}
      <Bolsa abierta={bolsaAbierta} onCerrar={cerrarBolsa} onVerProductos={verProductos} pedido={pedido} />
    </>
  )
}
