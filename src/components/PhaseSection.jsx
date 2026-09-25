import { useRef, useEffect, useState } from 'react'

// ════════════════════════════════════════════════════════
//  Phase Section — One full-screen section per phase
//  with scroll-reveal memory cards
// ════════════════════════════════════════════════════════

function useScrollReveal() {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true)
        }
      },
      { threshold: 0.15 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return [ref, visible]
}

export default function PhaseSection({ phase, memories, icons, onMemoryClick, index }) {
  const [headerRef, headerVisible] = useScrollReveal()

  return (
    <section className="phase-section" id={`phase-${phase.index}`}>
      {/* Ambient glow orbs */}
      <div className="ambient-orb orb-1" style={{ opacity: 0.08 + index * 0.02 }} />
      <div className="ambient-orb orb-2" style={{ opacity: 0.06 + index * 0.02 }} />

      {/* Divider line */}
      <div className="phase-divider" />

      {/* Phase header */}
      <div
        ref={headerRef}
        className={`phase-header reveal ${headerVisible ? 'visible' : ''}`}
      >
        <p className="phase-number">{phase.label}</p>
        <h2 className="phase-title">{phase.title}</h2>
        <p className="phase-desc">{phase.description}</p>
      </div>

      {/* Memory cards grid */}
      <div className="memories-grid">
        {memories.map((memory, i) => (
          <MemoryCard
            key={memory.id}
            memory={memory}
            icon={icons[memory.object] || '✨'}
            onClick={() => onMemoryClick(memory)}
            delay={i}
          />
        ))}
      </div>
    </section>
  )
}

function MemoryCard({ memory, icon, onClick, delay }) {
  const [ref, visible] = useScrollReveal()

  return (
    <div
      ref={ref}
      className={`memory-card reveal reveal-delay-${Math.min(delay + 1, 5)} ${visible ? 'visible' : ''}`}
      onClick={onClick}
    >
      <span className="memory-icon">{icon}</span>
      <h3 className="memory-title">{memory.title}</h3>
      <p className="memory-text">{memory.text}</p>
      {memory.date && <p className="memory-date">{memory.date}</p>}
    </div>
  )
}
