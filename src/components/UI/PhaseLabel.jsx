import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'
import { phases } from '../../data/phases.js'

// ════════════════════════════════════════════════════════
//  PhaseLabel — Subtle current phase indicator (top center)
// ════════════════════════════════════════════════════════

export default function PhaseLabel() {
  const phaseIndex = useStore((s) => s.phaseIndex)
  const scene = useStore((s) => s.scene)

  if (scene !== 'world') return null

  const current = phases[phaseIndex]
  if (!current || !current.label) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={phaseIndex}
        className="phase-label"
        initial={{ opacity: 0, y: -6 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -6 }}
        transition={{ duration: 1.2, ease: [0.43, 0.13, 0.23, 0.96] }}
      >
        <div className="phase-number">{current.label}</div>
        <div className="phase-title">{current.title}</div>
      </motion.div>
    </AnimatePresence>
  )
}
