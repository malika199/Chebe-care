import React from 'react'

const GALLERY_IMAGES = [
  '/images/temoignages/temoignage-1.png',
  '/images/temoignages/temoignage-2.png',
  '/images/temoignages/temoignage-3.png',
  '/images/temoignages/temoignage-4.png'
]

const GallerySection = () => {
  return (
    <section id="gallery" className="py-24 lg:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {GALLERY_IMAGES.map((src, index) => (
            <div key={index} className="aspect-[3/4] overflow-hidden bg-[#F5EFEA]">
              <img
                src={src}
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
