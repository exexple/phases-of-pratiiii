import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Desk — Desk surface + Lamp (interactive) + Cup + Books
// ════════════════════════════════════════════════════════

// Shared hover cursor
function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

// Lamp component
function Lamp({ onTap }) {
  const groupRef = useRef()
  const glowRef = useRef()
  const [on, setOn] = useState(false)
  const cursor = useHoverCursor()

  useFrame(({ clock }) => {
    if (!glowRef.current) return
    if (on) {
      const t = clock.elapsedTime
      glowRef.current.intensity = 1.8 + Math.sin(t * 8.1) * 0.06 + Math.sin(t * 14.3) * 0.03
    } else {
      glowRef.current.intensity = 0
    }
  })

  const handleTap = useCallback(() => {
    const nextOn = !on
    setOn(nextOn)
    if (groupRef.current) {
      gsap.to(groupRef.current.rotation, { z: nextOn ? 0.04 : 0, duration: 0.3, ease: 'back.out' })
    }
    onTap()
  }, [on, onTap])

  return (
    <group ref={groupRef} position={[1.4, 0.82, 0.6]}>
      {/* Base */}
      <mesh castShadow onClick={handleTap} {...cursor}>
        <cylinderGeometry args={[0.1, 0.12, 0.06, 12]} />
        <meshStandardMaterial color="#2A2438" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Arm */}
      <mesh position={[0, 0.45, 0]} castShadow onClick={handleTap} {...cursor}>
        <cylinderGeometry args={[0.018, 0.018, 0.9, 8]} />
        <meshStandardMaterial color="#3A3448" roughness={0.5} metalness={0.5} />
      </mesh>

      {/* Shade */}
      <mesh position={[0, 0.9, 0]} castShadow onClick={handleTap} {...cursor}>
        <coneGeometry args={[0.18, 0.28, 10, 1, true]} />
        <meshStandardMaterial
          color={on ? '#C8A860' : '#3A3348'}
          roughness={0.7}
          emissive={on ? '#C8A860' : '#000000'}
          emissiveIntensity={on ? 0.3 : 0}
          side={2}
        />
      </mesh>

      {/* Invisible tap target (larger) */}
      <mesh visible={false} onClick={handleTap} position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.3, 0.3, 1.2, 8]} />
      </mesh>

      {/* Point light from lamp shade */}
      <pointLight
        ref={glowRef}
        position={[0, 0.7, 0]}
        intensity={0}
        color="#F2C870"
        distance={4}
        decay={2}
      />
    </group>
  )
}

// A single book
function Book({ position, color, height = 0.28, onClick }) {
  const cursor = useHoverCursor()
  return (
    <mesh position={position} castShadow onClick={onClick} {...cursor}>
      <boxGeometry args={[0.06, height, 0.2]} />
      <meshStandardMaterial color={color} roughness={0.9} />
    </mesh>
  )
}

// Cup
function Cup({ position }) {
  return (
    <group position={position}>
      <mesh castShadow>
        <cylinderGeometry args={[0.055, 0.045, 0.12, 12]} />
        <meshStandardMaterial color="#342C44" roughness={0.7} metalness={0.1} />
      </mesh>
      {/* Liquid surface */}
      <mesh position={[0, 0.055, 0]}>
        <circleGeometry args={[0.048, 12]} />
        <meshStandardMaterial color="#1A1010" roughness={0.2} />
      </mesh>
      {/* Handle */}
      <mesh position={[0.065, 0, 0]}>
        <torusGeometry args={[0.03, 0.008, 8, 12, Math.PI]} />
        <meshStandardMaterial color="#342C44" roughness={0.7} />
      </mesh>
    </group>
  )
}

export default function Desk({ onMemory }) {
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  const triggerMemory = useCallback((memId) => {
    const mem = memories.find(m => m.id === memId)
    if (mem) {
      handleDiscover(memId)
      setActiveMemory(mem)
    }
  }, [handleDiscover, setActiveMemory])

  return (
    <group position={[1.0, 0, 0.8]}>
      {/* ── Desk surface ─────────────────────────────── */}
      <mesh position={[0, 0.8, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.8, 0.06, 0.9]} />
        <meshStandardMaterial color="#1E1820" roughness={0.85} metalness={0.05} />
      </mesh>

      {/* ── Desk legs ─────────────────────────────────── */}
      {[[-0.82, 0.4, -0.4], [0.82, 0.4, -0.4], [-0.82, 0.4, 0.4], [0.82, 0.4, 0.4]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <boxGeometry args={[0.06, 0.8, 0.06]} />
          <meshStandardMaterial color="#1A1620" roughness={0.9} />
        </mesh>
      ))}

      {/* ── Lamp ──────────────────────────────────────── */}
      <Lamp onTap={() => triggerMemory('lamp-01')} />

      {/* ── Books (small stack) ───────────────────────── */}
      <group position={[-0.55, 0.83, 0.1]}>
        <Book position={[0,   0.14, 0]} color="#3A2C40" height={0.28} />
        <Book position={[0.07, 0.11, 0]} color="#2A3440" height={0.22} />
        <Book position={[-0.07, 0.09, 0]} color="#3A3028" height={0.18} />
      </group>

      {/* ── Cup ───────────────────────────────────────── */}
      <Cup position={[-0.1, 0.83, -0.2]} />

      {/* ── Desk surface tap (general desk memory) ────── */}
      <mesh
        position={[0, 0.84, 0]}
        visible={false}
        onClick={() => triggerMemory('desk-01')}
      >
        <boxGeometry args={[1.8, 0.1, 0.9]} />
      </mesh>
    </group>
  )
}
