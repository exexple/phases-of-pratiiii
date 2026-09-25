import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  LoadingScreen — Beautiful minimal loading state
// ════════════════════════════════════════════════════════

export default function LoadingScreen() {
  const scene = useStore((s) => s.scene)

  return (
    <AnimatePresence>
      {scene === 'loading' && (
        <motion.div
          className="loading-screen"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.5, ease: 'easeInOut' }}
        >
          <div className="loading-mark" aria-hidden="true" />
          <p className="loading-text">putting a few things in place...</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
