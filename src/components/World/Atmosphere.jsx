import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  Atmosphere — Dust motes, curtain animation, ambient fog
// ════════════════════════════════════════════════════════

// Dust mote particle system
function DustMotes({ count = 80, qualityTier }) {
  const mesh = useRef()
  const actualCount = qualityTier === 'low' ? 30 : qualityTier === 'medium' ? 55 : count

  const { positions, speeds, phases: motePhases } = useMemo(() => {
    const positions = new Float32Array(actualCount * 3)
    const speeds = new Float32Array(actualCount)
    const phases = new Float32Array(actualCount)

    for (let i = 0; i < actualCount; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 7   // x
      positions[i * 3 + 1] = Math.random() * 3.5          // y
      positions[i * 3 + 2] = (Math.random() - 0.5) * 5   // z
      speeds[i] = 0.05 + Math.random() * 0.1
      phases[i] = Math.random() * Math.PI * 2
    }
    return { positions, speeds, phases }
  }, [actualCount])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions.slice(), 3))
    return geo
  }, [positions])

  useFrame(({ clock }) => {
    if (!mesh.current) return
    const t = clock.elapsedTime
    const pos = mesh.current.geometry.attributes.position
    for (let i = 0; i < actualCount; i++) {
      const px = positions[i * 3]
      const py = positions[i * 3 + 1]
      const pz = positions[i * 3 + 2]
      const ph = motePhases[i]
      const sp = speeds[i]
      pos.setXYZ(
        i,
        px + Math.sin(t * sp + ph) * 0.008,
        ((py + t * sp * 0.03) % 3.5),
        pz + Math.cos(t * sp * 0.7 + ph) * 0.006,
      )
    }
    pos.needsUpdate = true
  })

  return (
    <points ref={mesh} geometry={geometry}>
      <pointsMaterial
        size={0.012}
        color="#D4C8B8"
        transparent
        opacity={0.35}
        depthWrite={false}
        sizeAttenuation
      />
    </points>
  )
}

// Animated curtain panels
function Curtains() {
  const leftRef = useRef()
  const rightRef = useRef()

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    const sway = Math.sin(t * 0.4) * 0.008
    if (leftRef.current)  leftRef.current.rotation.z =  sway
    if (rightRef.current) rightRef.current.rotation.z = -sway
  })

  return (
    <>
      {/* Left curtain */}
      <group ref={leftRef} position={[-1.5, 3.8, -3.95]}>
        <mesh>
          <planeGeometry args={[1.2, 3.2]} />
          <meshStandardMaterial
            color="#2A2438"
            roughness={1}
            side={2}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* Right curtain */}
      <group ref={rightRef} position={[1.5, 3.8, -3.95]}>
        <mesh>
          <planeGeometry args={[1.2, 3.2]} />
          <meshStandardMaterial
            color="#2A2438"
            roughness={1}
            side={2}
            transparent
            opacity={0.92}
          />
        </mesh>
      </group>

      {/* Curtain rod */}
      <mesh position={[0, 4.3, -3.9]}>
        <cylinderGeometry args={[0.02, 0.02, 3.6, 8]} />
        <meshStandardMaterial color="#3A3448" roughness={0.6} metalness={0.3} />
      </mesh>
    </>
  )
}

export default function Atmosphere({ qualityTier = 'high' }) {
  return (
    <>
      <fog attach="fog" color="#0D0B14" near={6} far={14} />
      <DustMotes count={80} qualityTier={qualityTier} />
      <Curtains />
    </>
  )
}
