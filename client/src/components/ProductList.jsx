import React from 'react'
import ProductCard from './ProductCard'
import { useProducts } from '../hooks/useProducts'
import '../styles/ProductList.css'

const ProductList = () => {
  const { products, loading } = useProducts()
  return (
    <>
      <div id="home" className="product-list-container">
        <div className="header-section">
          <h1 className="main-title">Boutique Capillaire</h1>
          <p className="subtitle">Découvrez notre sélection de produits professionnels pour vos cheveux</p>
        </div>
      </div>
      
      <div id="products" className="product-list-container">
        <h2 className="section-title">Nos Produits</h2>
        {loading ? (
          <p className="text-center py-8">Chargement…</p>
        ) : (
        <div className="products-grid">
          {products.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
        )}
      </div>
    </>
  )
}

export default ProductList
