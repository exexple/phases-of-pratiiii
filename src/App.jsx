import { useState, useEffect, useRef, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import './index.css'

// Data
import { memories } from './data/memories.js'
import { phases } from './data/phases.js'
import { polaroids } from './data/polaroids.js'
import { musicConfig } from './data/music.js'

// Components
import LoadingScreen from './components/LoadingScreen.jsx'
import StarsBackground from './components/StarsBackground.jsx'
import IntroSection from './components/IntroSection.jsx'
import PhaseSection from './components/PhaseSection.jsx'
import PolaroidSection from './components/PolaroidSection.jsx'
import ConstellationSection from './components/ConstellationSection.jsx'
import FinalSection from './components/FinalSection.jsx'
import MusicPlayer from './components/MusicPlayer.jsx'

// ════════════════════════════════════════════════════════
//  App — Scroll-driven cinematic experience
// ════════════════════════════════════════════════════════

const OBJECT_ICONS = {
  lamp: '🪔',
  drawer: '🗃️',
  book: '📖',
  headphones: '🎧',
  window: '🌙',
  flower: '🌸',
  cup: '☕',
  note: '📝',
  shelf: '📚',
  calendar: '📅',
  frame: '🖼️',
  desk: '✨',
}

export default function App() {
  const [loaded, setLoaded] = useState(false)
  const [entered, setEntered] = useState(false)
  const [activeMemory, setActiveMemory] = useState(null)

  // Group memories by phase
  const phaseMemories = phases.slice(0, 4).map((phase) => ({
    ...phase,
    memories: memories.filter((m) => m.category === `phase-${phase.index + 1}`),
  }))

  return (
    <>
      <LoadingScreen loaded={loaded} onLoaded={() => setLoaded(true)} />
      <StarsBackground />

      <div style={{ position: 'relative', zIndex: 1 }}>
        <IntroSection entered={entered} onEnter={() => setEntered(true)} />

        {entered && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1.5, delay: 0.5 }}
          >
            {/* Phase sections with memory cards */}
            {phaseMemories.map((phase, i) => (
              <PhaseSection
                key={phase.index}
                phase={phase}
                memories={phase.memories}
                icons={OBJECT_ICONS}
                onMemoryClick={setActiveMemory}
                index={i}
              />
            ))}

            {/* Polaroid gallery */}
            <PolaroidSection polaroids={polaroids} />

            {/* Constellation reveal — auto-animates "PRATIKSHA" */}
            <ConstellationSection />

            {/* Final emotional message */}
            <FinalSection />
          </motion.div>
        )}
      </div>

      {/* Music player */}
      {entered && <MusicPlayer config={musicConfig} />}

      {/* Memory modal */}
      <AnimatePresence>
        {activeMemory && (
          <motion.div
            className="memory-modal-overlay"
            onClick={() => setActiveMemory(null)}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <motion.div
              className="memory-modal"
              onClick={(e) => e.stopPropagation()}
              initial={{ scale: 0.9, y: 30, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              exit={{ scale: 0.95, y: 10, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              <div className="modal-icon">{OBJECT_ICONS[activeMemory.object] || '✨'}</div>
              <h3 className="modal-title">{activeMemory.title}</h3>
              <p className="modal-text">{activeMemory.text}</p>
              {activeMemory.date && (
                <p className="modal-date">{activeMemory.date}</p>
              )}
              <button className="modal-close" onClick={() => setActiveMemory(null)}>
                close
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
