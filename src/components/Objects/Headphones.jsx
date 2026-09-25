import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Headphones — Lift and tilt on tap, memory reveal
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

export default function Headphones() {
  const groupRef = useRef()
  const [active, setActive] = useState(false)
  const cursor = useHoverCursor()
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  const handleTap = useCallback(() => {
    if (active) return
    setActive(true)

    if (groupRef.current) {
      gsap.timeline()
        .to(groupRef.current.position, { y: 1.25, duration: 0.5, ease: 'power2.out' })
        .to(groupRef.current.rotation, { x: -0.3, y: 0.4, duration: 0.5, ease: 'power2.out' }, '<')
        .to(groupRef.current.position, { y: 1.1, duration: 1.5, ease: 'power2.inOut' }, '+=0.3')
        .to(groupRef.current.rotation, { x: 0, y: 0, duration: 1.0, ease: 'power2.inOut' }, '<')
    }

    const mem = memories.find(m => m.id === 'headphones-01')
    if (mem) {
      handleDiscover('headphones-01')
      setTimeout(() => {
        setActiveMemory(mem)
        setActive(false)
      }, 800)
    }
  }, [active, handleDiscover, setActiveMemory])

  return (
    <group ref={groupRef} position={[0.3, 1.1, 0.5]} onClick={handleTap} {...cursor}>
      {/* Headband arc */}
      <mesh rotation={[0, 0, Math.PI / 2]}>
        <torusGeometry args={[0.14, 0.018, 8, 20, Math.PI]} />
        <meshStandardMaterial color="#2A2438" roughness={0.5} metalness={0.4} />
      </mesh>

      {/* Left ear cup */}
      <group position={[-0.14, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
          <meshStandardMaterial color="#1E1C2A" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[-0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.008, 12]} />
          <meshStandardMaterial color="#2E2C3E" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>

      {/* Right ear cup */}
      <group position={[0.14, 0, 0]}>
        <mesh rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.055, 0.055, 0.04, 12]} />
          <meshStandardMaterial color="#1E1C2A" roughness={0.5} metalness={0.3} />
        </mesh>
        <mesh position={[0.022, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
          <cylinderGeometry args={[0.05, 0.05, 0.008, 12]} />
          <meshStandardMaterial color="#2E2C3E" roughness={0.3} metalness={0.5} />
        </mesh>
      </group>

      {/* Invisible expanded tap target */}
      <mesh visible={false}>
        <boxGeometry args={[0.5, 0.4, 0.3]} />
      </mesh>
    </group>
  )
}
