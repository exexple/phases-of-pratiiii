import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  HiddenNote — A small folded note hidden under/near an object
//  Has a faint shimmer to hint it's discoverable
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

export default function HiddenNote({ position = [-0.6, 0.835, 0.3] }) {
  const meshRef = useRef()
  const [discovered, setDiscovered] = useState(false)
  const cursor = useHoverCursor()
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)

  // Subtle shimmer to hint interactivity
  useFrame(({ clock }) => {
    if (!meshRef.current || discovered) return
    const t = clock.elapsedTime
    meshRef.current.material.emissiveIntensity = 0.04 + Math.sin(t * 1.8) * 0.03
  })

  const handleTap = () => {
    if (discovered) return
    setDiscovered(true)

    if (meshRef.current) {
      gsap.timeline()
        .to(meshRef.current.position, { y: meshRef.current.position.y + 0.08, duration: 0.3, ease: 'power2.out' })
        .to(meshRef.current.rotation, { z: 0.2, duration: 0.3 }, '<')
        .to(meshRef.current.position, { y: meshRef.current.position.y, duration: 0.4, ease: 'power2.in' }, '+=0.1')
    }

    const mem = memories.find(m => m.id === 'note-01')
    if (mem) {
      handleDiscover('note-01')
      setTimeout(() => setActiveMemory(mem), 500)
    }
  }

  return (
    <group position={position} rotation={[0, 0.3, 0.05]}>
      <mesh ref={meshRef} castShadow onClick={handleTap} {...cursor}>
        <boxGeometry args={[0.12, 0.001, 0.09]} />
        <meshStandardMaterial
          color="#E8E0D0"
          roughness={0.9}
          emissive="#D0C8B8"
          emissiveIntensity={0.04}
        />
      </mesh>
      {/* Fold line */}
      <mesh position={[0, 0.002, 0]}>
        <boxGeometry args={[0.001, 0.002, 0.09]} />
        <meshStandardMaterial color="#C8C0B0" roughness={1} />
      </mesh>
      {/* Invisible tap target */}
      <mesh visible={false} onClick={handleTap} position={[0, 0.02, 0]}>
        <boxGeometry args={[0.25, 0.08, 0.2]} />
      </mesh>
    </group>
  )
}
