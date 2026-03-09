import { useState, useEffect } from 'react'
import { getResults } from '../api'
import { fallbackResults } from '../data/results'

export function useResults() {
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    getResults()
      .then((data) => {
        if (!cancelled) setResults(Array.isArray(data) ? data : [])
      })
      .catch(() => {
        if (!cancelled) setResults(fallbackResults)
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => { cancelled = true }
  }, [])

  return { results, loading }
}
