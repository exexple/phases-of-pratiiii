import { useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Flower — Stylized bloom with subtle sway, memory reveal
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

// Single petal
function Petal({ angle, color }) {
  return (
    <mesh
      position={[Math.cos(angle) * 0.055, 0.01, Math.sin(angle) * 0.055]}
      rotation={[Math.PI / 2, 0, angle]}
      scale={[1, 1.7, 1]}
    >
      <circleGeometry args={[0.035, 8]} />
      <meshStandardMaterial color={color} roughness={0.8} side={2} />
    </mesh>
  )
}

export default function Flower({ position = [-1.8, 0.85, 0.7] }) {
  const stemRef = useRef()
  const bloomRef = useRef()
  const cursor = useHoverCursor()
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  useFrame(({ clock }) => {
    const t = clock.elapsedTime
    if (stemRef.current) stemRef.current.rotation.z = Math.sin(t * 0.5) * 0.025
    if (bloomRef.current) {
      bloomRef.current.rotation.y = Math.sin(t * 0.4) * 0.03
      bloomRef.current.rotation.z = Math.sin(t * 0.5) * 0.025
    }
  })

  const handleTap = () => {
    const mem = memories.find(m => m.id === 'flower-01')
    if (mem) {
      handleDiscover('flower-01')
      setActiveMemory(mem)
    }
  }

  const petals = 8
  const petalColors = ['#C8A0B0', '#D4A8B8', '#BCA0C0', '#C8B0D0']

  return (
    <group position={position} onClick={handleTap} {...cursor}>
      {/* ── Vase ─────────────────────────────────── */}
      <group>
        <mesh castShadow>
          <cylinderGeometry args={[0.055, 0.04, 0.14, 10]} />
          <meshStandardMaterial color="#2C2840" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0, 0.07, 0]}>
          <cylinderGeometry args={[0.035, 0.055, 0.04, 10]} />
          <meshStandardMaterial color="#2C2840" roughness={0.5} metalness={0.3} />
        </mesh>
      </group>

      {/* ── Stem ──────────────────────────────────── */}
      <group ref={stemRef} position={[0, 0.07, 0]}>
        <mesh position={[0, 0.18, 0]} castShadow>
          <cylinderGeometry args={[0.006, 0.006, 0.36, 6]} />
          <meshStandardMaterial color="#3A5030" roughness={0.9} />
        </mesh>

        {/* ── Leaf ──────────────────────────────────── */}
        <mesh position={[0.04, 0.14, 0]} rotation={[0, 0, 0.8]} scale={[1, 2, 1]}>
          <circleGeometry args={[0.03, 8]} />
          <meshStandardMaterial color="#354828" roughness={0.85} side={2} />
        </mesh>

        {/* ── Bloom ─────────────────────────────────── */}
        <group ref={bloomRef} position={[0, 0.36, 0]}>
          {/* Center */}
          <mesh>
            <circleGeometry args={[0.028, 10]} />
            <meshStandardMaterial color="#D4A040" roughness={0.7} emissive="#C09030" emissiveIntensity={0.15} />
          </mesh>

          {/* Petals */}
          {Array.from({ length: petals }).map((_, i) => (
            <Petal
              key={i}
              angle={(i / petals) * Math.PI * 2}
              color={petalColors[i % petalColors.length]}
            />
          ))}
        </group>
      </group>

      {/* Invisible tap target */}
      <mesh visible={false} position={[0, 0.25, 0]}>
        <cylinderGeometry args={[0.15, 0.15, 0.6, 8]} />
      </mesh>
    </group>
  )
}
