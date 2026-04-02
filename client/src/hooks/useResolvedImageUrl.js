import { useEffect, useState } from 'react'
import { getProductImageUrl } from '../api'

/** Recalcule l’URL quand l’API envoie X-Asset-Base-Url (après chargement des produits). */
export function useResolvedImageUrl(path) {
  const [url, setUrl] = useState(() => getProductImageUrl(path))
  useEffect(() => {
    const update = () => setUrl(getProductImageUrl(path))
    update()
    window.addEventListener('chebe-asset-base', update)
    return () => window.removeEventListener('chebe-asset-base', update)
  }, [path])
  return url
}
