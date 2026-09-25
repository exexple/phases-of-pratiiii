import { useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'
import { musicConfig } from '../../data/music.js'
import { useAudio } from '../../hooks/useAudio.js'

// ════════════════════════════════════════════════════════
//  MusicPlayer — Minimal refined music control
//  Animated bars indicator + compact track info
// ════════════════════════════════════════════════════════

export default function MusicPlayer() {
  const audioPlaying = useStore((s) => s.audioPlaying)
  const scene = useStore((s) => s.scene)
  const { togglePlay, toggleMute } = useAudio()
  const [muted, setMuted] = useState(false)

  // Only show in world/sky/final scenes
  if (scene === 'loading' || scene === 'intro') return null

  const handleMute = () => {
    setMuted(!muted)
    toggleMute()
  }

  return (
    <div className="music-player" role="region" aria-label="Music player">
      <div
        className={`music-indicator ${audioPlaying ? 'music-playing' : ''}`}
        onClick={togglePlay}
        role="button"
        aria-label={audioPlaying ? 'Pause music' : 'Play music'}
        id="music-toggle"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && togglePlay()}
      >
        {/* Animated bars */}
        <div className="music-bars" aria-hidden="true">
          <div className="music-bar" style={{ height: audioPlaying ? undefined : 4 }} />
          <div className="music-bar" style={{ height: audioPlaying ? undefined : 4 }} />
          <div className="music-bar" style={{ height: audioPlaying ? undefined : 4 }} />
          <div className="music-bar" style={{ height: audioPlaying ? undefined : 4 }} />
        </div>

        {/* Track info */}
        <div className="music-info">
          <span className="music-track">{musicConfig.title}</span>
          <span className="music-artist">{musicConfig.artist}</span>
        </div>

        {/* Mute button */}
        <button
          className="music-btn"
          onClick={(e) => { e.stopPropagation(); handleMute() }}
          aria-label={muted ? 'Unmute' : 'Mute'}
          id="music-mute"
        >
          {muted ? '○' : '◉'}
        </button>
      </div>
    </div>
  )
}
