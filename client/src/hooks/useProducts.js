import { useState, useEffect } from 'react'
import { getProducts } from '../api'
import { products as fallbackProducts } from '../data/products'

export function useProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [fromApi, setFromApi] = useState(false)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getProducts()
      .then((data) => {
        if (!cancelled) {
          setProducts(Array.isArray(data) ? data : [])
          setFromApi(true)
        }
      })
      .catch(() => {
        if (!cancelled) {
          setProducts(fallbackProducts)
          setFromApi(false)
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  const refetch = () => {
    setLoading(true)
    getProducts()
      .then((data) => setProducts(Array.isArray(data) ? data : []))
      .catch(() => setProducts(fallbackProducts))
      .finally(() => setLoading(false))
  }

  return { products, loading, fromApi, refetch }
}
