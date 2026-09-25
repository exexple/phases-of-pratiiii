import { Suspense } from 'react'
import { Canvas } from '@react-three/fiber'
import { EffectComposer, Bloom, Vignette } from '@react-three/postprocessing'
import { useStore } from '../store/useStore.js'
import { useDeviceQuality } from '../hooks/useDeviceQuality.js'

// World components
import Room from '../components/World/Room.jsx'
import Lighting from '../components/World/Lighting.jsx'
import Atmosphere from '../components/World/Atmosphere.jsx'
import CameraRig from '../components/World/CameraRig.jsx'

// Objects
import Desk from '../components/Objects/Desk.jsx'
import Drawer from '../components/Objects/Drawer.jsx'
import Bookshelf from '../components/Objects/Bookshelf.jsx'
import Headphones from '../components/Objects/Headphones.jsx'
import Window from '../components/Objects/Window.jsx'
import Flower from '../components/Objects/Flower.jsx'
import Chair from '../components/Objects/Chair.jsx'
import PolaroidWall from '../components/Objects/PolaroidWall.jsx'
import HiddenNote from '../components/Objects/HiddenNote.jsx'

// ════════════════════════════════════════════════════════
//  MainWorld — Primary 3D bedroom/studio/memory space
// ════════════════════════════════════════════════════════

function WorldContents() {
  const qualityTier = useStore((s) => s.qualityTier)

  return (
    <>
      <CameraRig />
      <Lighting />
      <Atmosphere qualityTier={qualityTier} />
      <Room />

      {/* ── Objects ──────────────────────────────── */}
      <Desk />
      <Drawer />
      <Bookshelf />
      <Headphones />
      <Window />
      <Flower />
      <Chair />
      <PolaroidWall />
      <HiddenNote />

      {/* ── Cinematic postprocessing ─────────────── */}
      {qualityTier !== 'low' && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.3}
            luminanceSmoothing={0.9}
            intensity={0.6}
            height={300}
          />
          <Vignette offset={0.35} darkness={0.65} />
        </EffectComposer>
      )}
    </>
  )
}

export default function MainWorld() {
  useDeviceQuality()
  const qualityTier = useStore((s) => s.qualityTier)
  const setScene = useStore((s) => s.setScene)

  return (
    <Canvas
      shadows
      dpr={qualityTier === 'high' ? [1, 2] : [1, 1.5]}
      camera={{ position: [0, 1.6, 4.2], fov: 60, near: 0.1, far: 30 }}
      gl={{
        antialias: true,
        alpha: false,
        powerPreference: 'high-performance',
      }}
      onCreated={({ gl }) => {
        gl.setClearColor('#090C1A')
        // Signal that 3D world is ready → show intro overlay
        setTimeout(() => setScene('intro'), 200)
      }}
      style={{ position: 'fixed', inset: 0 }}
    >
      <Suspense fallback={null}>
        <WorldContents />
      </Suspense>
    </Canvas>
  )
}
