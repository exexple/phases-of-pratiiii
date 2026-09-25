import { useState, useRef, useEffect, useCallback } from 'react'
import { Howl } from 'howler'

// ════════════════════════════════════════════════════════
//  Music Player — floating bottom-right pill
// ════════════════════════════════════════════════════════

export default function MusicPlayer({ config }) {
  const [playing, setPlaying] = useState(false)
  const [ready, setReady] = useState(false)
  const howlRef = useRef(null)

  useEffect(() => {
    if (!config?.src) return

    const howl = new Howl({
      src: [config.src],
      loop: config.loop ?? true,
      volume: 0,
      onload: () => setReady(true),
      onloaderror: () => setReady(false),
    })

    howlRef.current = howl
    return () => {
      howl.unload()
    }
  }, [config])

  const toggle = useCallback(() => {
    const howl = howlRef.current
    if (!howl || !ready) return

    if (playing) {
      howl.fade(config.volume || 0.75, 0, 800)
      setTimeout(() => howl.pause(), 800)
      setPlaying(false)
    } else {
      howl.play()
      howl.fade(0, config.volume || 0.75, config.fadeInMs || 2000)
      setPlaying(true)
    }
  }, [playing, ready, config])

  if (!config?.src) return null

  return (
    <div
      className={`music-player ${playing ? 'music-playing' : ''}`}
      onClick={toggle}
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
