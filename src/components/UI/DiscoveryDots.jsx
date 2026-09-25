import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from '../../store/useStore.js'
import { useStore as useDiscoveryStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  DiscoveryDots — Subtle progress indicator (top right)
//  Gold dots that illuminate as you discover things
// ════════════════════════════════════════════════════════

const TOTAL_DOTS = 10

export default function DiscoveryDots() {
  const discovered = useStore((s) => s.discovered)
  const scene = useStore((s) => s.scene)
  const count = discovered.size

  if (scene !== 'world') return null

  return (
    <div className="discovery-dots" aria-hidden="true">
      {Array.from({ length: TOTAL_DOTS }).map((_, i) => (
        <div
          key={i}
          className={`discovery-dot ${i < count ? 'found' : ''}`}
        />
      ))}
    </div>
  )
}
