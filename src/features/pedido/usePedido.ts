import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { PRODUCTOS } from '../../data/productos'
import type { Entrega, LineaPedido } from '../../types'
import { ENTREGA_VACIA, guardarEntrega, guardarPedido, leerEntrega, leerPedido } from './almacenamiento'
import { mensajeWhatsApp } from './mensajeWhatsApp'
import { hayPendientes, productosACotizar, reducirPedido, totalSoles, totalUnidades } from './pedido'

const VACIO: LineaPedido[] = []

export function usePedido() {
  const [lineas, despachar] = useReducer(reducirPedido, VACIO)
  const [entrega, setEntrega] = useState<Entrega>(ENTREGA_VACIA)
  const [restaurado, setRestaurado] = useState(false)

  // Se restaura después de hidratar: el HTML publicado sale siempre con la
  // bolsa vacía y así el primer render del navegador coincide con él.
  useEffect(() => {
    despachar({ tipo: 'restaurar', lineas: leerPedido(PRODUCTOS) })
    setEntrega(leerEntrega())
    setRestaurado(true)
  }, [])

  useEffect(() => {
    if (restaurado) guardarPedido(lineas)
  }, [lineas, restaurado])

  useEffect(() => {
    if (restaurado) guardarEntrega(entrega)
  }, [entrega, restaurado])

  const agregar = useCallback((sku: string) => despachar({ tipo: 'agregar', sku }), [])
  const decrementar = useCallback((sku: string) => despachar({ tipo: 'decrementar', sku }), [])
  const quitar = useCallback((sku: string) => despachar({ tipo: 'quitar', sku }), [])
  const cambiarEntrega = useCallback(
    (cambio: Partial<Entrega>) => setEntrega((actual) => ({ ...actual, ...cambio })),
    [],
  )

  const unidades = useMemo(() => totalUnidades(lineas), [lineas])
  const total = useMemo(() => totalSoles(lineas, PRODUCTOS), [lineas])
  const pendientes = useMemo(() => hayPendientes(lineas, PRODUCTOS), [lineas])
  const aCotizar = useMemo(() => productosACotizar(lineas, PRODUCTOS), [lineas])
  const mensaje = useMemo(() => mensajeWhatsApp(lineas, PRODUCTOS, entrega), [lineas, entrega])

  return {
    lineas, entrega, unidades, total, pendientes, aCotizar, mensaje,
    agregar, decrementar, quitar, cambiarEntrega,
  }
}

export type Pedido = ReturnType<typeof usePedido>
