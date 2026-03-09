import React, { useState, useEffect } from 'react'
import { useProducts } from '../hooks/useProducts'
import { getDisplayDiscount, hasDiscount } from '../utils/product'
import '../styles/ProductCarousel.css'

const ProductCarousel = () => {
  const { products, loading } = useProducts()
  const [currentIndex, setCurrentIndex] = useState(0)

  useEffect(() => {
    if (products.length === 0) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % products.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [products.length])

  if (loading || products.length === 0) return null
  const currentProduct = products[currentIndex]
  const showDiscount = hasDiscount(currentProduct)
  const discountPercent = getDisplayDiscount(currentProduct)

  return (
    <div className="product-carousel-container">
      <div className="carousel-slide">
        <img 
          src={currentProduct.image} 
          alt={currentProduct.name}
          className="carousel-main-image"
          key={currentIndex}
          onError={(e) => {
            e.target.src = 'https://via.placeholder.com/1200x500?text=Produit'
          }}
        />
        <div className="carousel-overlay-content">
          <div className="carousel-info">
            <h2 className="carousel-product-title">{currentProduct.name}</h2>
            <p className="carousel-product-description">{currentProduct.description}</p>
            <div className="carousel-pricing">
              {showDiscount ? (
                <>
                  <span className="carousel-original-price">{currentProduct.originalPrice.toFixed(2)} €</span>
                  <span className="carousel-current-price">{currentProduct.price.toFixed(2)} €</span>
                  <span className="carousel-discount-badge">−{discountPercent} %</span>
                </>
              ) : (
                <span className="carousel-current-price">{currentProduct.price.toFixed(2)} €</span>
              )}
            </div>
          </div>
        </div>
        <div className="carousel-indicators">
          {products.map((_, index) => (
            <button
              key={index}
              className={`carousel-indicator ${index === currentIndex ? 'active' : ''}`}
              onClick={() => setCurrentIndex(index)}
              aria-label={`Aller au produit ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}

export default ProductCarousel
