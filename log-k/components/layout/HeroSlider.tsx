'use client'

import { useState, useEffect } from 'react'
import Image from 'next/image'

const slides = [
  { id: 1, src: '/images/hero/hero-1.jpg', alt: 'Aviation hero image 1' },
  { id: 2, src: '/images/hero/hero-2.jpg', alt: 'Aviation hero image 2' },
  { id: 3, src: '/images/hero/hero-3.jpg', alt: 'Aviation hero image 3' },
  { id: 4, src: '/images/hero/hero-4.jpg', alt: 'Aviation hero image 4' },
  { id: 5, src: '/images/hero/hero-5.jpg', alt: 'Aviation hero image 5' },
]

interface HeroSliderProps {
  children?: React.ReactNode
  className?: string
  autoPlay?: boolean
  interval?: number
}

export default function HeroSlider({ 
  children, 
  className = '', 
  autoPlay = true, 
  interval = 5000 
}: HeroSliderProps) {
  const [currentSlide, setCurrentSlide] = useState(0)

  useEffect(() => {
    if (!autoPlay) return

    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length)
    }, interval)

    return () => clearInterval(timer)
  }, [autoPlay, interval])

  return (
    <div className={`relative w-full h-screen overflow-hidden ${className}`}>
      {/* Image Slides */}
      {slides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100' : 'opacity-0'
          }`}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover"
            priority={index === 0}
            quality={90}
          />
        </div>
      ))}

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/30 to-black/50" />
      
      {/* Additional overlay for better text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content */}
      {children && (
        <div className="relative z-10 h-full flex items-center justify-center">
          {children}
        </div>
      )}

      {/* Slide Indicators */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2 z-20">
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => setCurrentSlide(index)}
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-white w-8' 
                : 'bg-white/50 hover:bg-white/75'
            }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  )
}