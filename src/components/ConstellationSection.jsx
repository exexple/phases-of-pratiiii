import { useRef, useState, useEffect, useCallback } from 'react'

// ════════════════════════════════════════════════════════
//  Constellation Section — Stars auto-connect to spell
//  "PRATIKSHA" with a cinematic reveal animation
// ════════════════════════════════════════════════════════

// Each letter defined as a set of points and line segments
// Coordinates in a local grid per letter, scaled at render time
const LETTER_DATA = {
  P: {
    points: [[0,0],[0,2],[0,4],[0,6],[0,8], [2,0],[4,0],[5,1],[5,3],[4,4],[2,4]],
    lines: [[0,1],[1,2],[2,3],[3,4], [0,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,2]],
  },
  R: {
    points: [[0,0],[0,2],[0,4],[0,6],[0,8], [2,0],[4,0],[5,1],[5,3],[4,4],[2,4], [3,6],[5,8]],
    lines: [[0,1],[1,2],[2,3],[3,4], [0,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,2], [2,11],[11,12]],
  },
  A: {
    points: [[0,8],[1,6],[2,4],[3,2],[4,0], [5,2],[6,4],[7,6],[8,8], [2.5,5],[5.5,5]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8], [9,10]],
  },
  T: {
    points: [[0,0],[2,0],[4,0],[6,0], [3,0],[3,2],[3,4],[3,6],[3,8]],
    lines: [[0,1],[1,4],[4,2],[2,3], [4,5],[5,6],[6,7],[7,8]],
  },
  I: {
    points: [[0,0],[2,0],[4,0], [2,2],[2,4],[2,6],[2,8], [0,8],[4,8]],
    lines: [[0,1],[1,2], [1,3],[3,4],[4,5],[5,6], [7,6],[6,8]],
  },
  K: {
    points: [[0,0],[0,2],[0,4],[0,6],[0,8], [4,0],[3,2],[1,4],[3,6],[4,8]],
    lines: [[0,1],[1,2],[2,3],[3,4], [5,6],[6,7],[7,2], [7,8],[8,9]],
  },
  S: {
    points: [[5,0],[3,0],[1,0],[0,1],[0,2],[1,3.5],[3,4],[5,4.5],[5.5,5.5],[5,7],[3,8],[1,8],[0,8]],
    lines: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,10],[10,11],[11,12]],
  },
  H: {
    points: [[0,0],[0,2],[0,4],[0,6],[0,8], [5,0],[5,2],[5,4],[5,6],[5,8], [0,4],[5,4]],
    lines: [[0,1],[1,2],[2,3],[3,4], [5,6],[6,7],[7,8],[8,9], [10,11]],
  },
}

// Build the full constellation for "PRATIKSHA"
function buildConstellation(width, height, word = 'PRATIKSHA') {
  const letters = word.split('')
  const letterWidth = 8 // max x extent per letter
  const letterHeight = 8 // max y extent
  const spacing = 2
  const totalLetterUnits = letters.length * letterWidth + (letters.length - 1) * spacing

  // Scale to fit canvas
  const padding = 40
  const availW = width - padding * 2
  const availH = height - padding * 2
  const scale = Math.min(availW / totalLetterUnits, availH / letterHeight)

  const offsetY = (height - letterHeight * scale) / 2
  let offsetX = (width - totalLetterUnits * scale) / 2

  const allPoints = []
  const allLines = []

  letters.forEach((letter, li) => {
    const data = LETTER_DATA[letter]
    if (!data) return

    const baseIdx = allPoints.length
    const lx = offsetX + li * (letterWidth + spacing) * scale

    data.points.forEach(([px, py]) => {
      allPoints.push({
        x: lx + px * scale,
        y: offsetY + py * scale,
        letter: li,
      })
    })

    data.lines.forEach(([a, b]) => {
      allLines.push([baseIdx + a, baseIdx + b])
    })
  })

  return { points: allPoints, lines: allLines }
}

export default function ConstellationSection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)
  const [animPhase, setAnimPhase] = useState(0) // 0=waiting, 1=drawing, 2=done
  const [drawnLines, setDrawnLines] = useState(0)
  const [nameRevealed, setNameRevealed] = useState(false)

  const canvasWidth = 900
  const canvasHeight = 320

  const constellation = useRef(
    buildConstellation(canvasWidth, canvasHeight)
  ).current

  // Trigger animation when section scrolls into view
  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !visible) {
          setVisible(true)
        }
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [visible])

  // Start drawing when visible
  useEffect(() => {
    if (!visible) return

    const startDelay = setTimeout(() => {
      setAnimPhase(1)
    }, 800)

    return () => clearTimeout(startDelay)
  }, [visible])

  // Animate lines one by one
  useEffect(() => {
    if (animPhase !== 1) return

    if (drawnLines >= constellation.lines.length) {
      setAnimPhase(2)
      // Reveal name after a pause
      setTimeout(() => setNameRevealed(true), 600)
      return
    }

    const timer = setTimeout(() => {
      setDrawnLines((d) => d + 1)
    }, 40) // Speed of line drawing

    return () => clearTimeout(timer)
  }, [animPhase, drawnLines, constellation.lines.length])

  // Determine which points are active (connected)
  const activePoints = new Set()
  constellation.lines.slice(0, drawnLines).forEach(([a, b]) => {
    activePoints.add(a)
    activePoints.add(b)
  })

  return (
    <section className="constellation-section" ref={sectionRef}>
      <div className="phase-divider" />

      <div className={`phase-header reveal ${visible ? 'visible' : ''}`}>
        <p className="phase-number">look up</p>
        <h2 className="phase-title">the stars know your name</h2>
      </div>

      <div className="constellation-canvas">
        <svg
          className="constellation-svg"
          viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
          preserveAspectRatio="xMidYMid meet"
        >
          {/* Background scatter stars */}
          {Array.from({ length: 60 }).map((_, i) => (
            <circle
              key={`bg-${i}`}
              cx={Math.random() * canvasWidth}
              cy={Math.random() * canvasHeight}
              r={Math.random() < 0.2 ? 1.5 : 0.8}
              fill="rgba(248, 244, 238, 0.15)"
            />
          ))}

          {/* Constellation lines */}
          {constellation.lines.slice(0, drawnLines).map(([a, b], i) => {
            const p1 = constellation.points[a]
            const p2 = constellation.points[b]
            return (
              <line
                key={`line-${i}`}
                x1={p1.x}
                y1={p1.y}
                x2={p2.x}
                y2={p2.y}
                className="constellation-line"
                style={{
                  opacity: 0,
                  animation: `fade-in 0.3s ease ${i * 0.02}s forwards`,
                }}
              />
            )
          })}

          {/* Constellation stars (points) */}
          {constellation.points.map((pt, i) => (
            <circle
              key={`star-${i}`}
              cx={pt.x}
              cy={pt.y}
              r={activePoints.has(i) ? 3 : 2}
              className={`constellation-star ${activePoints.has(i) ? 'active' : ''}`}
              style={{
                transition: 'all 0.4s ease',
              }}
            />
          ))}
        </svg>
      </div>

      {/* Name reveal */}
      <h2 className={`constellation-name ${nameRevealed ? 'revealed' : ''}`}>
        pratiksha
      </h2>
      <p className={`constellation-subtitle ${nameRevealed ? 'revealed' : ''}`}>
        every star i see reminds me of you
      </p>
    </section>
  )
}
