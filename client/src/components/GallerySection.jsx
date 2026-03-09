import React from 'react'
import gallery1 from '../assets/images/temoignage-1.png'
import gallery2 from '../assets/images/temoignage-2.png'
import gallery3 from '../assets/images/temoignage-3.png'
import gallery4 from '../assets/images/temoignage-4.png'

const GALLERY_IMAGES = [gallery1, gallery2, gallery3, gallery4]

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
