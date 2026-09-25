import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  ConstellationHint — "there's one more thing for you"
//  Appears after enough discoveries, points to window
// ════════════════════════════════════════════════════════

export default function ConstellationHint() {
  const showConstellationHint = useStore((s) => s.showConstellationHint)
  const activeMemory = useStore((s) => s.activeMemory)
  const activePolaroid = useStore((s) => s.activePolaroid)
  const scene = useStore((s) => s.scene)

  // Don't show when something else is open
  const hidden = activeMemory || activePolaroid || scene !== 'world'

  return (
    <AnimatePresence>
      {showConstellationHint && !hidden && (
        <motion.div
          className="constellation-hint"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 12 }}
          transition={{ duration: 1.6, ease: [0.43, 0.13, 0.23, 0.96] }}
        >
          <p className="hint-text">there's one more thing for you.</p>
          <p className="hint-sub">look up.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
