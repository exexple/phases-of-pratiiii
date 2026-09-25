import { useRef, useState, useEffect } from 'react'

// ════════════════════════════════════════════════════════
//  Polaroid Section — scattered polaroid gallery
// ════════════════════════════════════════════════════════

export default function PolaroidSection({ polaroids }) {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.1 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="polaroid-section" ref={sectionRef}>
      <div className="phase-divider" />

      <div className={`phase-header reveal ${visible ? 'visible' : ''}`}>
        <p className="phase-number">gallery</p>
        <h2 className="phase-title">moments in polaroids</h2>
        <p className="phase-desc">some photos i kept. you probably forgot about most of them.</p>
      </div>

      <div className="polaroids-grid">
        {polaroids.map((pol, i) => (
          <div
            key={pol.id}
            className={`polaroid-card reveal reveal-delay-${Math.min(i + 1, 5)} ${visible ? 'visible' : ''}`}
            style={{ transform: `rotate(${pol.rotation}deg)` }}
          >
            <img
              className="polaroid-img"
              src={pol.src}
              alt={pol.caption}
              loading="lazy"
              onError={(e) => {
                // Show gradient placeholder if image fails
                e.target.style.display = 'none'
              }}
            />
            <p className="polaroid-caption">{pol.caption}</p>
          </div>
        ))}
      </div>
    </section>
  )
}
