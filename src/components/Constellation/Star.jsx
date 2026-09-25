import { useRef, useState, useCallback } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'

// ════════════════════════════════════════════════════════
//  Star — Single interactive constellation star
//  Large invisible touch target, visual star is small
// ════════════════════════════════════════════════════════

export default function Star({
  id,
  position,   // [x, y, z]
  correct,
  selected,
  connected,
  onSelect,
}) {
  const meshRef = useRef()
  const glowRef = useRef()
  const [hovered, setHovered] = useState(false)

  const isActive = selected || connected
  const baseSize = correct ? 0.025 : 0.018
  const targetSize = isActive ? baseSize * 2.2 : hovered ? baseSize * 1.6 : baseSize

  useFrame(({ clock }) => {
    if (!meshRef.current) return
    const t = clock.elapsedTime

    // Twinkle
    const twinkle = 1.0 + Math.sin(t * (2 + position[0] * 1.3) + position[1] * 7) * 0.15
    meshRef.current.scale.setScalar(targetSize * twinkle / baseSize)

    // Glow intensity
    if (glowRef.current) {
      glowRef.current.intensity = isActive ? 0.4 : hovered ? 0.15 : 0.05
    }
  })

  const handleClick = useCallback((e) => {
    e.stopPropagation()
    onSelect(id)
  }, [id, onSelect])

  const color = connected ? '#F8E8A0' : selected ? '#E8D880' : '#C8D8F0'
  const emissive = connected ? '#D0C060' : selected ? '#C0A840' : '#6080A0'

  return (
    <group position={position}>
      {/* Visual star */}
      <mesh ref={meshRef}>
        <sphereGeometry args={[baseSize, 8, 6]} />
        <meshStandardMaterial
          color={color}
          emissive={emissive}
          emissiveIntensity={isActive ? 1.5 : hovered ? 0.8 : 0.4}
          roughness={0.2}
          metalness={0.1}
        />
      </mesh>

      {/* Glow */}
      <pointLight
        ref={glowRef}
        intensity={0.05}
        color={connected ? '#F8E8A0' : '#8AAAE0'}
        distance={0.5}
        decay={2}
      />

      {/* LARGE invisible tap target */}
      <mesh
        visible={false}
        onClick={handleClick}
        onPointerEnter={() => {
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerLeave={() => {
          setHovered(false)
          document.body.style.cursor = 'default'
        }}
      >
        <sphereGeometry args={[0.12, 8, 6]} />
      </mesh>
    </group>
  )
}
