import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { polaroids } from '../../data/polaroids.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Drawer — Animated slide-open with Polaroid reveal inside
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

export default function Drawer() {
  const drawerRef = useRef()
  const [isOpen, setIsOpen] = useState(false)
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)
  const setActivePolaroid = useStore((s) => s.setActivePolaroid)
  const cursor = useHoverCursor()

  const handleTap = useCallback(() => {
    if (isOpen) {
      // Close
      setIsOpen(false)
      gsap.to(drawerRef.current.position, { z: 0, duration: 0.5, ease: 'power2.in' })
    } else {
      // Open with satisfying slide
      setIsOpen(true)
      gsap.to(drawerRef.current.position, { z: 0.35, duration: 0.6, ease: 'back.out(1.2)' })

      // Discover memory + polaroid
      const mem = memories.find(m => m.id === 'drawer-01')
      if (mem) {
        handleDiscover('drawer-01')
        setTimeout(() => {
          setActiveMemory(mem)
          // Also show polaroid after memory dismissed — handled in UI
        }, 300)
      }
    }
  }, [isOpen, handleDiscover, setActiveMemory, setActivePolaroid])

  return (
    <group position={[-0.8, 0, -1.2]}>
      {/* ── Nightstand body ────────────────────────── */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[0.55, 0.65, 0.45]} />
        <meshStandardMaterial color="#1E1C28" roughness={0.88} />
      </mesh>

      {/* ── Drawer unit (slides on z) ─────────────── */}
      <group ref={drawerRef}>
        <mesh
          position={[0, -0.05, 0.225]}
          castShadow
          onClick={handleTap}
          {...cursor}
        >
          <boxGeometry args={[0.5, 0.22, 0.03]} />
          <meshStandardMaterial color="#242030" roughness={0.85} />
        </mesh>

        {/* Drawer handle */}
        <mesh
          position={[0, -0.05, 0.245]}
          onClick={handleTap}
          {...cursor}
        >
          <boxGeometry args={[0.12, 0.018, 0.018]} />
          <meshStandardMaterial color="#3A3060" roughness={0.4} metalness={0.6} />
        </mesh>

        {/* Invisible expanded tap target */}
        <mesh visible={false} position={[0, -0.05, 0.24]} onClick={handleTap}>
          <boxGeometry args={[0.6, 0.3, 0.1]} />
        </mesh>
      </group>

      {/* ── Polaroid visible inside (when open) ───── */}
      {isOpen && (
        <mesh
          position={[0.08, -0.04, 0.18]}
          rotation={[0.1, 0.15, -0.08]}
          onClick={() => {
            const pol = polaroids.find(p => p.location === 'drawer')
            if (pol) setActivePolaroid(pol)
          }}
          {...cursor}
        >
          {/* White frame */}
          <boxGeometry args={[0.18, 0.22, 0.005]} />
          <meshStandardMaterial color="#F0EBE3" roughness={0.8} />
        </mesh>
      )}

      {/* ── Top surface items ──────────────────────── */}
      {/* Small book */}
      <mesh position={[0.12, 0.35, 0.08]} rotation={[0, 0.1, 0]} castShadow>
        <boxGeometry args={[0.15, 0.04, 0.2]} />
        <meshStandardMaterial color="#2E2840" roughness={0.9} />
      </mesh>

      {/* Tiny plant pot */}
      <group position={[-0.12, 0.36, 0.05]}>
        <mesh castShadow>
          <cylinderGeometry args={[0.04, 0.035, 0.07, 8]} />
          <meshStandardMaterial color="#3A2830" roughness={0.85} />
        </mesh>
        {/* Stem */}
        <mesh position={[0, 0.06, 0]}>
          <cylinderGeometry args={[0.005, 0.005, 0.08, 6]} />
          <meshStandardMaterial color="#3A5030" roughness={0.9} />
        </mesh>
        {/* Leaf */}
        <mesh position={[0.02, 0.1, 0]} rotation={[0, 0, 0.5]}>
          <sphereGeometry args={[0.025, 6, 4]} />
          <meshStandardMaterial color="#3A5030" roughness={0.9} />
        </mesh>
      </group>

      {/* Nightstand legs */}
      {[[-0.23, -0.32, -0.19], [0.23, -0.32, -0.19], [-0.23, -0.32, 0.19], [0.23, -0.32, 0.19]].map((pos, i) => (
        <mesh key={i} position={pos} castShadow>
          <cylinderGeometry args={[0.015, 0.012, 0.025, 6]} />
          <meshStandardMaterial color="#1A1820" roughness={0.9} />
        </mesh>
      ))}
    </group>
  )
}
