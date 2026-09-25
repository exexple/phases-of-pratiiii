import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Bookshelf — Wall-mounted shelves with interactive books
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

// Interactive book that slides out
function InteractiveBook({ position, color, height = 0.32, memId, title }) {
  const groupRef = useRef()
  const [pulled, setPulled] = useState(false)
  const cursor = useHoverCursor()
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  const handleTap = useCallback(() => {
    const nextPulled = !pulled
    setPulled(nextPulled)
    if (groupRef.current) {
      gsap.to(groupRef.current.position, {
        z: nextPulled ? 0.12 : 0,
        duration: 0.45,
        ease: nextPulled ? 'back.out(1.5)' : 'power2.in',
      })
    }
    if (nextPulled && memId) {
      const mem = memories.find(m => m.id === memId)
      if (mem) {
        handleDiscover(memId)
        setTimeout(() => setActiveMemory(mem), 400)
      }
    }
  }, [pulled, memId, handleDiscover, setActiveMemory])

  return (
    <group ref={groupRef} position={position}>
      <mesh castShadow onClick={handleTap} {...cursor}>
        <boxGeometry args={[0.055, height, 0.16]} />
        <meshStandardMaterial color={color} roughness={0.88} />
      </mesh>
      {/* Book spine lines */}
      <mesh position={[0, 0, 0.08]}>
        <planeGeometry args={[0.04, height * 0.6]} />
        <meshStandardMaterial
          color={color}
          roughness={0.9}
          emissive={pulled ? '#888' : '#000'}
          emissiveIntensity={pulled ? 0.08 : 0}
        />
      </mesh>
      {/* Invisible wider tap target */}
      <mesh visible={false} onClick={handleTap} position={[0, 0, 0.05]}>
        <boxGeometry args={[0.12, height + 0.1, 0.3]} />
      </mesh>
    </group>
  )
}

// Decorative (non-interactive) book
function DecoBook({ position, color, height = 0.28 }) {
  return (
    <mesh position={position} castShadow>
      <boxGeometry args={[0.055, height, 0.16]} />
      <meshStandardMaterial color={color} roughness={0.88} />
    </mesh>
  )
}

// Shelf board
function Shelf({ position, width = 1.6 }) {
  return (
    <mesh position={position} castShadow receiveShadow>
      <boxGeometry args={[width, 0.04, 0.22]} />
      <meshStandardMaterial color="#1E1C28" roughness={0.85} metalness={0.05} />
    </mesh>
  )
}

export default function Bookshelf() {
  return (
    <group position={[-2.8, 0, -1.0]}>
      {/* ── Shelf unit back panel ─────────────────── */}
      <mesh position={[0, 1.6, -0.11]} castShadow>
        <boxGeometry args={[1.65, 3.4, 0.04]} />
        <meshStandardMaterial color="#181620" roughness={0.92} />
      </mesh>

      {/* ── Side panels ───────────────────────────── */}
      {[-0.82, 0.82].map((x, i) => (
        <mesh key={i} position={[x, 1.6, 0]} castShadow>
          <boxGeometry args={[0.04, 3.4, 0.24]} />
          <meshStandardMaterial color="#1A1820" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Shelves ───────────────────────────────── */}
      <Shelf position={[0, 0.35, 0]} />
      <Shelf position={[0, 1.05, 0]} />
      <Shelf position={[0, 1.75, 0]} />
      <Shelf position={[0, 2.45, 0]} />
      <Shelf position={[0, 3.15, 0]} />

      {/* ── Bottom shelf books ────────────────────── */}
      <group position={[0, 0.38, 0]}>
        <DecoBook position={[-0.6, 0.16, 0]} color="#2A3040" height={0.28} />
        <InteractiveBook position={[-0.5, 0.18, 0]} color="#3A2840" height={0.32} memId="book-01" />
        <DecoBook position={[-0.4, 0.14, 0]} color="#2C3028" height={0.24} />
        <DecoBook position={[-0.3, 0.15, 0]} color="#3A3020" height={0.26} />
        <DecoBook position={[0.1,  0.12, 0]} color="#402A30" height={0.2} />
        {/* Small ornament */}
        <mesh position={[0.35, 0.07, 0.02]} castShadow>
          <sphereGeometry args={[0.045, 8, 6]} />
          <meshStandardMaterial color="#3A3060" roughness={0.3} metalness={0.6} />
        </mesh>
      </group>

      {/* ── Mid shelf books ───────────────────────── */}
      <group position={[0, 1.08, 0]}>
        <DecoBook position={[-0.65, 0.2, 0]} color="#2A3848" height={0.36} />
        <DecoBook position={[-0.57, 0.18, 0]} color="#383040" height={0.32} />
        <InteractiveBook position={[-0.48, 0.19, 0]} color="#4A3028" height={0.34} memId="shelf-01" />
        <DecoBook position={[-0.38, 0.16, 0]} color="#283040" height={0.28} />
        {/* Tiny framed photo on shelf */}
        <mesh position={[0.3, 0.1, 0.04]} rotation={[0, 0, 0.05]} castShadow>
          <boxGeometry args={[0.12, 0.14, 0.012]} />
          <meshStandardMaterial color="#D4C8A8" roughness={0.7} />
        </mesh>
        <mesh position={[0.3, 0.1, 0.05]}>
          <boxGeometry args={[0.09, 0.1, 0.001]} />
          <meshStandardMaterial color="#2A2840" roughness={0.9} />
        </mesh>
      </group>

      {/* ── Upper shelf ───────────────────────────── */}
      <group position={[0, 1.78, 0]}>
        <DecoBook position={[-0.6, 0.17, 0]} color="#3A4028" height={0.3} />
        <DecoBook position={[-0.51, 0.15, 0]} color="#2A3850" height={0.26} />
        {/* Candle */}
        <group position={[0.5, 0, 0]}>
          <mesh castShadow>
            <cylinderGeometry args={[0.025, 0.025, 0.12, 8]} />
            <meshStandardMaterial color="#E8DCC8" roughness={0.9} />
          </mesh>
          <pointLight position={[0, 0.12, 0]} intensity={0.4} color="#FFA050" distance={1.5} decay={2} />
        </group>
        {/* Small ornamental box */}
        <mesh position={[-0.2, 0.06, 0.02]} castShadow>
          <boxGeometry args={[0.1, 0.08, 0.12]} />
          <meshStandardMaterial color="#2C2840" roughness={0.7} metalness={0.2} />
        </mesh>
      </group>
    </group>
  )
}
