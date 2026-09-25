import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  PolaroidPopup — Full-screen Polaroid display
//  Physical depth, paper texture, handwritten caption
// ════════════════════════════════════════════════════════

export default function PolaroidPopup() {
  const activePolaroid = useStore((s) => s.activePolaroid)
  const setActivePolaroid = useStore((s) => s.setActivePolaroid)

  return (
    <AnimatePresence>
      {activePolaroid && (
        <motion.div
          className="polaroid-popup"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          onClick={() => setActivePolaroid(null)}
        >
          <motion.div
            className="polaroid-frame"
            style={{ transform: `rotate(${activePolaroid.rotation || 0}deg)` }}
            initial={{ opacity: 0, y: 40, scale: 0.92, rotate: activePolaroid.rotation || 0 }}
            animate={{ opacity: 1, y: 0, scale: 1, rotate: activePolaroid.rotation || 0 }}
            exit={{ opacity: 0, y: -30, scale: 0.92 }}
            transition={{ duration: 0.55, ease: [0.43, 0.13, 0.23, 0.96] }}
            onClick={(e) => e.stopPropagation()}
          >
            <img
              className="polaroid-img"
              src={activePolaroid.src}
              alt={activePolaroid.caption}
              onError={(e) => {
                // Graceful fallback: show placeholder gradient
                e.target.style.display = 'none'
              }}
            />
            {activePolaroid.caption && (
              <p className="polaroid-caption">{activePolaroid.caption}</p>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
