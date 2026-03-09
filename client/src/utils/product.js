/**
 * Calcule le pourcentage de réduction à afficher à partir du prix ancien et du prix actuel.
 * Si le produit a déjà un discount stocké et qu'il y a une réduction, on utilise le max (calculé ou stocké).
 * @param {{ originalPrice?: number | null, price: number, discount?: number }} product
 * @returns {number} Pourcentage de réduction (0 si pas de réduction)
 */
export function getDisplayDiscount(product) {
  const op = product.originalPrice
  const pr = product.price
  if (op != null && op > 0 && pr < op) {
    const computed = Math.round(((op - pr) / op) * 100)
    return Math.max(computed, product.discount || 0)
  }
  return product.discount || 0
}

/** Indique si le produit doit afficher une réduction (ancien prix barré + badge). */
export function hasDiscount(product) {
  return getDisplayDiscount(product) > 0
}
