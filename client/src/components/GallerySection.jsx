import React, { useEffect, useReducer } from 'react'
import { getProductImageUrl } from '../api'

const GALLERY_PATHS = [
  '/images/temoignages/temoignage-1.png',
  '/images/temoignages/temoignage-2.png',
  '/images/temoignages/temoignage-3.png',
  '/images/temoignages/temoignage-4.png'
]

const GallerySection = () => {
  const [, rerender] = useReducer((x) => x + 1, 0)
  useEffect(() => {
    window.addEventListener('chebe-asset-base', rerender)
    return () => window.removeEventListener('chebe-asset-base', rerender)
  }, [])
  return (
    <section id="gallery" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {GALLERY_PATHS.map((path, index) => (
            <div key={index} className="aspect-[3/4] overflow-hidden bg-[#F5EFEA]">
              <img
                src={getProductImageUrl(path)}
                alt=""
                className="w-full h-full object-cover"
                loading="lazy"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default GallerySection
