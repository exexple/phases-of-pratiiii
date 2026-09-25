import { useRef, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { polaroids } from '../../data/polaroids.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  PolaroidWall — Polaroids physically placed on the wall
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

// Single wall polaroid
function WallPolaroid({ position, rotation, polaroid, onClick }) {
  const frameRef = useRef()
  const cursor = useHoverCursor()

  useFrame(({ clock }) => {
    if (!frameRef.current) return
    const t = clock.elapsedTime
    frameRef.current.rotation.z = rotation[2] + Math.sin(t * 0.3 + position[0]) * 0.004
  })

  const rot = rotation.map(r => r * Math.PI / 180)

  return (
    <group ref={frameRef} position={position} rotation={rot} onClick={onClick} {...cursor}>
      {/* White frame */}
      <mesh castShadow>
        <boxGeometry args={[0.22, 0.26, 0.008]} />
        <meshStandardMaterial color="#F2EDE5" roughness={0.75} />
      </mesh>
      {/* Photo area */}
      <mesh position={[0, 0.015, 0.005]}>
        <planeGeometry args={[0.185, 0.185]} />
        <meshStandardMaterial color="#2A2438" roughness={0.9} />
      </mesh>
      {/* Bottom white area (polaroid strip) */}
      <mesh position={[0, -0.09, 0.005]}>
        <planeGeometry args={[0.185, 0.055]} />
        <meshStandardMaterial color="#EDE8E0" roughness={0.8} />
      </mesh>
      {/* Pin / string */}
      <mesh position={[0, 0.12, 0.01]}>
        <cylinderGeometry args={[0.006, 0.006, 0.02, 6]} />
        <meshStandardMaterial color="#A08070" roughness={0.5} metalness={0.3} />
      </mesh>

      {/* Shadow below */}
      <mesh position={[0.01, -0.015, -0.005]}>
        <planeGeometry args={[0.23, 0.28]} />
        <meshStandardMaterial color="#000000" transparent opacity={0.12} depthWrite={false} />
      </mesh>
    </group>
  )
}

export default function PolaroidWall() {
  const setActivePolaroid = useStore((s) => s.setActivePolaroid)
  const wallPolaroids = polaroids.filter(p => p.location === 'wall')

  // Hardcoded positions for wall polaroids
  const positions = [
    { pos: [-1.2, 2.8, -3.9], rot: [0, 0, -3] },
    { pos: [-0.3, 3.1, -3.9], rot: [0, 0, 2.5] },
    { pos: [0.6,  2.7, -3.9], rot: [0, 0, -1.5] },
  ]

  return (
    <>
      {wallPolaroids.slice(0, 3).map((pol, i) => (
        <WallPolaroid
          key={pol.id}
          position={positions[i]?.pos || [0, 2.5, -3.9]}
          rotation={positions[i]?.rot || [0, 0, 0]}
          polaroid={pol}
          onClick={() => setActivePolaroid(pol)}
        />
      ))}
    </>
  )
}
