import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  Lighting — Cinematic room lighting system
//  Moonlight + warm lamp glow + ambient fill
// ════════════════════════════════════════════════════════

export default function Lighting() {
  const lampLight = useRef()
  const discovered = useStore((s) => s.discovered)
  const lampDiscovered = discovered.has('lamp-01')

  // Subtle lamp flicker
  useFrame(({ clock }) => {
    if (!lampLight.current) return
    const t = clock.elapsedTime
    const flicker = 1.0 + Math.sin(t * 7.3) * 0.04 + Math.sin(t * 13.7) * 0.02
    lampLight.current.intensity = (lampDiscovered ? 1.8 : 1.0) * flicker
  })

  return (
    <>
      {/* Ambient fill — cool muted */}
      <ambientLight intensity={0.18} color="#C8C0D8" />

      {/* Moonlight from window — cold directional */}
      <directionalLight
        position={[-3.5, 5, -4]}
        intensity={0.55}
        color="#C8D8E8"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-camera-near={0.5}
        shadow-camera-far={20}
        shadow-camera-left={-6}
        shadow-camera-right={6}
        shadow-camera-top={6}
        shadow-camera-bottom={-6}
        shadow-bias={-0.001}
      />

      {/* Desk lamp — warm point light */}
      <pointLight
        ref={lampLight}
        position={[1.4, 1.95, 0.6]}
        intensity={1.0}
        color="#F0C870"
        distance={5.5}
        decay={2}
        castShadow
        shadow-mapSize-width={512}
        shadow-mapSize-height={512}
        shadow-bias={-0.001}
      />

      {/* Window rim light — subtle blue bounce */}
      <pointLight
        position={[0, 2.2, -4.5]}
        intensity={0.25}
        color="#8AAAC0"
        distance={6}
        decay={2}
      />

      {/* Floor bounce — warm subtle */}
      <pointLight
        position={[0, -0.1, 0]}
        intensity={0.1}
        color="#E0C89A"
        distance={4}
        decay={2}
      />

      {/* Bookshelf fill */}
      <pointLight
        position={[-3, 1.8, 0.5]}
        intensity={0.2}
        color="#DDD6E8"
        distance={3}
        decay={2}
      />
    </>
  )
}
