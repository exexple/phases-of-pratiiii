import { Suspense, useState } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import ConstellationPuzzle from '../components/Constellation/ConstellationPuzzle.jsx'
import { useStore } from '../store/useStore.js'

// ════════════════════════════════════════════════════════
//  SkyScene — Night sky + constellation puzzle
// ════════════════════════════════════════════════════════

function SkyIntroText({ visible, onDismiss }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="sky-intro-text"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 1.4, ease: [0.43, 0.13, 0.23, 0.96] }}
          onClick={onDismiss}
        >
          <h2>some things only make sense<br />when you connect them.</h2>
          <p>try connecting the stars.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function SkyScene() {
  const showSkyIntro = useStore((s) => s.showSkyIntro)
  const setShowSkyIntro = useStore((s) => s.setShowSkyIntro)
  const qualityTier = useStore((s) => s.qualityTier)

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 3], fov: 75, near: 0.01, far: 50 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'fixed', inset: 0 }}
        onCreated={({ gl }) => gl.setClearColor('#050812')}
      >
        <Suspense fallback={null}>
          <ConstellationPuzzle />
        </Suspense>
      </Canvas>

      <SkyIntroText
        visible={showSkyIntro}
        onDismiss={() => setShowSkyIntro(false)}
      />
    </>
  )
}
