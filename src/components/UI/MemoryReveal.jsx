import { useRef, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  MemoryReveal — Spatial memory display (not a modal)
//  Fades in with the memory content, closes on tap
// ════════════════════════════════════════════════════════

export default function MemoryReveal() {
  const activeMemory = useStore((s) => s.activeMemory)
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  return (
    <AnimatePresence>
      {activeMemory && (
        <motion.div
          className="memory-reveal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6, ease: [0.43, 0.13, 0.23, 0.96] }}
          onClick={() => setActiveMemory(null)}
        >
          <motion.div
            className="memory-card"
            initial={{ opacity: 0, y: 20, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -12, scale: 0.97 }}
            transition={{ duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.1 }}
            onClick={(e) => e.stopPropagation()}
          >
            {activeMemory.date && (
              <div className="memory-label">{activeMemory.date}</div>
            )}

            <h2 className="memory-title">{activeMemory.title}</h2>
            <p className="memory-text">{activeMemory.text}</p>

            <button
              className="memory-close"
              onClick={() => setActiveMemory(null)}
              aria-label="Close memory"
            >
              close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
