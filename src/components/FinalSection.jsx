import { useRef, useState, useEffect } from 'react'

// ════════════════════════════════════════════════════════
//  Final Section — The emotional closing message
// ════════════════════════════════════════════════════════

export default function FinalSection() {
  const sectionRef = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = sectionRef.current
    if (!el) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setVisible(true)
      },
      { threshold: 0.3 }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="final-section" ref={sectionRef}>
      <div className={`final-content reveal ${visible ? 'visible' : ''}`}>
        <div className="final-flower">🌺</div>

        <h2 className="final-heading">
          i made this for you
        </h2>

        <p className="final-message-text">
          because i remember everything about you.
        </p>
        <p className="final-message-text">
          the small things. the throwaway lines. the moments you probably forgot happened.
        </p>
        <p className="final-message-text">
          i didn't forget any of them.
        </p>
        <p className="final-message-text" style={{ marginTop: '1.5rem' }}>
          and i didn't build this to impress you.
          <br />
          i built it because i wanted you to smile again
          <br />
          i built it because you deserve to know —
          <br />
          someone was paying attention the whole time.
          <br />
          i built it because you deserve this and everything
          <br />
          else that i've ever done and i'll ever do
        </p>

        <p className="final-signature">
          — for you, from someone who wants you to be happy forever🌺
        </p>
      </div>
    </section>
  )
}
