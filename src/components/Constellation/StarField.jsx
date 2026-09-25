import { useRef, useMemo, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'

// ════════════════════════════════════════════════════════
//  StarField — Background star field for sky scene
// ════════════════════════════════════════════════════════

export default function StarField({ count = 400 }) {
  const ref = useRef()

  const { positions, sizes } = useMemo(() => {
    const positions = new Float32Array(count * 3)
    const sizes = new Float32Array(count)

    for (let i = 0; i < count; i++) {
      // Distribute on sphere surface
      const theta = Math.random() * Math.PI * 2
      const phi = Math.acos(2 * Math.random() - 1)
      const r = 15 + Math.random() * 5

      positions[i * 3]     = r * Math.sin(phi) * Math.cos(theta)
      positions[i * 3 + 1] = r * Math.sin(phi) * Math.sin(theta)
      positions[i * 3 + 2] = r * Math.cos(phi)

      sizes[i] = 0.5 + Math.random() * 2.5
    }
    return { positions, sizes }
  }, [count])

  const geometry = useMemo(() => {
    const geo = new THREE.BufferGeometry()
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3))
    geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1))
    return geo
  }, [positions, sizes])

  // Subtle twinkle
  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.material.opacity = 0.75 + Math.sin(clock.elapsedTime * 0.4) * 0.05
  })

  return (
    <points ref={ref} geometry={geometry}>
      <pointsMaterial
        size={0.04}
        color="#E8F0FF"
        transparent
        opacity={0.75}
        depthWrite={false}
        sizeAttenuation
        vertexColors={false}
      />
    </points>
  )
}
