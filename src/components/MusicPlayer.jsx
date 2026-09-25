import { useState, useRef, useEffect, useCallback } from 'react'
import { Howl, Howler } from 'howler'

// ════════════════════════════════════════════════════════
//  Music Player — auto-starts on enter/first gesture
// ════════════════════════════════════════════════════════

export default function MusicPlayer({ config, entered = true }) {
  const [playing, setPlaying] = useState(false)
  const howlRef = useRef(null)
  const hasStartedRef = useRef(false)
  const configRef = useRef(config)
  configRef.current = config

  const playAudio = useCallback(() => {
    const howl = howlRef.current
    const conf = configRef.current
    if (!howl) return

    try {
      // Resume audio context if suspended by browser
      if (Howler.ctx && Howler.ctx.state === 'suspended') {
        Howler.ctx.resume()
      }

      if (!howl.playing()) {
        const soundId = howl.play()
        const targetVol = conf?.volume ?? 0.75
        const fadeMs = conf?.fadeInMs ?? 2000
        howl.fade(0, targetVol, fadeMs, soundId)
        setPlaying(true)
        hasStartedRef.current = true
      }
    } catch (err) {
      console.warn('Autoplay deferral:', err)
    }
  }, [])

  const pauseAudio = useCallback(() => {
    const howl = howlRef.current
    const conf = configRef.current
    if (!howl) return

    try {
      const currentVol = conf?.volume ?? 0.75
      howl.fade(currentVol, 0, 600)
      setTimeout(() => {
        try {
          howl.pause()
          setPlaying(false)
        } catch (e) {}
      }, 600)
    } catch (e) {
      setPlaying(false)
    }
  }, [])

  const toggle = useCallback((e) => {
    e?.stopPropagation()
    if (playing) {
      pauseAudio()
    } else {
      playAudio()
    }
  }, [playing, playAudio, pauseAudio])

  // Initialize Howl instance on mount to preload
  useEffect(() => {
    if (!config?.src) return

    const howl = new Howl({
      src: [config.src],
      loop: config.loop ?? true,
      html5: true,
      preload: true,
      volume: config.volume ?? 0.75,
      onload: () => {
        if (hasStartedRef.current || entered) {
          playAudio()
        }
      },
      onplay: () => setPlaying(true),
      onpause: () => setPlaying(false),
      onstop: () => setPlaying(false),
      onend: () => {
        if (!config.loop) setPlaying(false)
      },
    })

    howlRef.current = howl

    // Attempt direct play immediately
    playAudio()

    // Unlock on any first interaction anywhere on page
    const handleFirstGesture = () => {
      if (!hasStartedRef.current || (howlRef.current && !howlRef.current.playing())) {
        playAudio()
      }
    }

    window.addEventListener('click', handleFirstGesture, { passive: true })
    window.addEventListener('touchstart', handleFirstGesture, { passive: true })
    window.addEventListener('pointerdown', handleFirstGesture, { passive: true })
    window.addEventListener('keydown', handleFirstGesture, { passive: true })

    return () => {
      window.removeEventListener('click', handleFirstGesture)
      window.removeEventListener('touchstart', handleFirstGesture)
      window.removeEventListener('pointerdown', handleFirstGesture)
      window.removeEventListener('keydown', handleFirstGesture)
      howl.unload()
    }
  }, [config?.src, playAudio])

  // When user clicks "begin" (entered becomes true), guarantee playAudio is invoked
  useEffect(() => {
    if (entered) {
      playAudio()
    }
  }, [entered, playAudio])

  if (!config?.src) return null

  return (
    <div
      className={`music-player ${playing ? 'music-playing' : ''}`}
      style={{
        opacity: entered ? 1 : 0,
        pointerEvents: entered ? 'all' : 'none',
        transition: 'opacity 0.8s ease',
      }}
      onClick={toggle}
      role="button"
      tabIndex={0}
      title={playing ? 'Pause music' : 'Play music'}
    >
      <div className="music-bars">
        <div className="music-bar" />
        <div className="music-bar" />
        <div className="music-bar" />
        <div className="music-bar" />
      </div>
      <div className="music-info">
        <span className="music-track">{config.title || 'Music'}</span>
        <span className="music-artist">{config.artist || ''}</span>
      </div>
    </div>
  )
}
