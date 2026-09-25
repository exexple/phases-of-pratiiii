import { useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { useAudio } from '../../hooks/useAudio.js'

// ════════════════════════════════════════════════════════
//  IntroOverlay — Cinematic opening: dark → title → enter
// ════════════════════════════════════════════════════════

export default function IntroOverlay() {
  const scene = useStore((s) => s.scene)
  const setScene = useStore((s) => s.setScene)
  const titleRef = useRef()
  const subtitleRef = useRef()
  const btnRef = useRef()
  const { startMusic } = useAudio()

  useEffect(() => {
    if (scene !== 'intro') return

    const tl = gsap.timeline({ delay: 0.8 })

    tl.to(titleRef.current, {
      opacity: 1,
      y: 0,
      duration: 2.2,
      ease: 'power2.out',
    })
    .to(subtitleRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.6,
      ease: 'power2.out',
    }, '-=1.0')
    .to(btnRef.current, {
      opacity: 1,
      y: 0,
      duration: 1.2,
      ease: 'power2.out',
    }, '-=0.6')

    // Set initial offsets
    gsap.set([titleRef.current, subtitleRef.current, btnRef.current], {
      y: 12, opacity: 0,
    })
  }, [scene])

  const handleEnter = () => {
    startMusic()

    const tl = gsap.timeline({
      onComplete: () => setScene('world'),
    })

    tl.to([titleRef.current, subtitleRef.current, btnRef.current], {
      opacity: 0,
      y: -10,
      stagger: 0.1,
      duration: 0.8,
      ease: 'power2.in',
    })
  }

  if (scene !== 'intro') return null

  return (
    <div className="intro-overlay">
      <div ref={titleRef} className="intro-title">
        some phases of pratii{' '}
        <span className="intro-blossom">🌺</span>
      </div>

      <div ref={subtitleRef} className="intro-subtitle">
        a little world made from things worth remembering.
      </div>

      <button
        ref={btnRef}
        className="enter-btn"
        onClick={handleEnter}
        id="enter-btn"
        aria-label="Enter the experience"
      >
        enter
      </button>
    </div>
  )
}
