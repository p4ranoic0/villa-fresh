import { useCallback, useEffect, useMemo, useReducer, useState } from 'react'
import { PRODUCTOS } from '../../data/productos'
import type { LineaPedido } from '../../types'
import { guardarPedido, leerPedido } from './almacenamiento'
import { hayPendientes, reducirPedido, totalSoles, totalUnidades } from './pedido'

const VACIO: LineaPedido[] = []

export function usePedido() {
  const [lineas, despachar] = useReducer(reducirPedido, VACIO)
  const [restaurado, setRestaurado] = useState(false)

  useEffect(() => {
    despachar({ tipo: 'restaurar', lineas: leerPedido(PRODUCTOS) })
    setRestaurado(true)
  }, [])

  useEffect(() => {
    if (restaurado) guardarPedido(lineas)
  }, [lineas, restaurado])

  const agregar = useCallback((sku: string) => despachar({ tipo: 'agregar', sku }), [])
  const incrementar = useCallback((sku: string) => despachar({ tipo: 'incrementar', sku }), [])
  const decrementar = useCallback((sku: string) => despachar({ tipo: 'decrementar', sku }), [])
  const quitar = useCallback((sku: string) => despachar({ tipo: 'quitar', sku }), [])
  const limpiar = useCallback(() => despachar({ tipo: 'limpiar' }), [])

  const unidades = useMemo(() => totalUnidades(lineas), [lineas])
  const total = useMemo(() => totalSoles(lineas, PRODUCTOS), [lineas])
  const pendientes = useMemo(() => hayPendientes(lineas, PRODUCTOS), [lineas])

  return { lineas, unidades, total, pendientes, agregar, incrementar, decrementar, quitar, limpiar }
}
