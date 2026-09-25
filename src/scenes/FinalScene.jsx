import { Suspense, useState, useRef } from 'react'
import { Canvas } from '@react-three/fiber'
import { motion, AnimatePresence } from 'framer-motion'
import NameParticles from '../components/Particles/NameParticles.jsx'
import StarField from '../components/Constellation/StarField.jsx'
import { useStore } from '../store/useStore.js'

// ════════════════════════════════════════════════════════
//  FinalScene — PRATIKSHA particle reveal + quiet ending
// ════════════════════════════════════════════════════════

function FinalMessage({ visible }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          className="final-message"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 2.0, ease: [0.43, 0.13, 0.23, 0.96], delay: 0.5 }}
        >
          <p>maybe the little things weren't so little after all.</p>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

export default function FinalScene() {
  const [nameFormed, setNameFormed] = useState(false)

  return (
    <>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 65, near: 0.01, far: 30 }}
        gl={{ antialias: true, alpha: false }}
        style={{ position: 'fixed', inset: 0 }}
        onCreated={({ gl }) => gl.setClearColor('#040810')}
      >
        <Suspense fallback={null}>
          <ambientLight intensity={0.05} color="#081020" />
          <pointLight position={[0, 0, 3]} intensity={0.5} color="#3060A0" distance={15} decay={2} />
          <StarField count={250} />
          <NameParticles onComplete={() => setNameFormed(true)} />
        </Suspense>
      </Canvas>

      <FinalMessage visible={nameFormed} />
    </>
  )
}
