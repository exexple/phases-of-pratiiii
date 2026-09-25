import { useMemo } from 'react'

// ════════════════════════════════════════════════════════
//  Stars Background — CSS-only twinkling star field
// ════════════════════════════════════════════════════════

export default function StarsBackground() {
  const stars = useMemo(() => {
    const result = []
    for (let i = 0; i < 150; i++) {
      const isLarge = Math.random() < 0.15
      result.push({
        id: i,
        left: `${Math.random() * 100}%`,
        top: `${Math.random() * 100}%`,
        duration: `${3 + Math.random() * 5}s`,
        delay: `${Math.random() * 5}s`,
        minOpacity: 0.1 + Math.random() * 0.2,
        maxOpacity: 0.5 + Math.random() * 0.5,
        large: isLarge,
      })
    }
    return result
  }, [])

  return (
    <div className="stars-container">
      {stars.map((s) => (
        <div
          key={s.id}
          className={`star ${s.large ? 'large' : ''}`}
          style={{
            left: s.left,
            top: s.top,
            '--duration': s.duration,
            '--delay': s.delay,
            '--min-opacity': s.minOpacity,
            '--max-opacity': s.maxOpacity,
          }}
        />
      ))}
    </div>
  )
}
