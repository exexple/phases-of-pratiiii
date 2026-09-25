import { Suspense, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useStore } from './store/useStore.js'

// Scenes
import MainWorld from './scenes/MainWorld.jsx'
import SkyScene from './scenes/SkyScene.jsx'
import FinalScene from './scenes/FinalScene.jsx'

// UI
import LoadingScreen from './components/UI/LoadingScreen.jsx'
import IntroOverlay from './components/UI/IntroOverlay.jsx'
import MemoryReveal from './components/UI/MemoryReveal.jsx'
import MusicPlayer from './components/UI/MusicPlayer.jsx'
import PhaseLabel from './components/UI/PhaseLabel.jsx'
import ConstellationHint from './components/UI/ConstellationHint.jsx'
import DiscoveryDots from './components/UI/DiscoveryDots.jsx'
import PolaroidPopup from './components/UI/PolaroidPopup.jsx'

// ════════════════════════════════════════════════════════
//  App — Scene router + global UI layer
// ════════════════════════════════════════════════════════

export default function App() {
  const scene = useStore((s) => s.scene)

  return (
    <div style={{ position: 'fixed', inset: 0, background: '#090C1A' }}>
      {/* ── 3D Scene layer ─────────────────────────── */}
      <AnimatePresence mode="wait">
        {(scene === 'loading' || scene === 'intro' || scene === 'world') && (
          <motion.div
            key="world"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
          >
            <MainWorld />
          </motion.div>
        )}

        {scene === 'sky' && (
          <motion.div
            key="sky"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
          >
            <SkyScene />
          </motion.div>
        )}

        {scene === 'final' && (
          <motion.div
            key="final"
            style={{ position: 'absolute', inset: 0 }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 2.0 }}
          >
            <FinalScene />
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Global UI overlay layer ─────────────────── */}
      <LoadingScreen />
      <IntroOverlay />
      <MemoryReveal />
      <PolaroidPopup />
      <MusicPlayer />
      <PhaseLabel />
      <ConstellationHint />
      <DiscoveryDots />
    </div>
  )
}
