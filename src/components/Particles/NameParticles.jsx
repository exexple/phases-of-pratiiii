import { useRef, useEffect, useMemo, useState } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import { sampleTextParticles } from '../../utils/particleText.js'

// ════════════════════════════════════════════════════════
//  NameParticles — PRATIKSHA particle formation
//
//  Constellation stars → fly to letter positions → name forms
// ════════════════════════════════════════════════════════

const NAME = 'PRATIKSHA'
const PARTICLE_COUNT = 900
const CANVAS_W = 900
const CANVAS_H = 180

export default function NameParticles({ onComplete }) {
  const meshRef = useRef()
  const [phase, setPhase] = useState('gathering') // 'gathering' | 'forming' | 'formed'

  // Sample target positions from canvas text
  const targets = useMemo(() => {
    const raw = sampleTextParticles(NAME, {
      fontSize: 112,
      canvasWidth: CANVAS_W,
      canvasHeight: CANVAS_H,
      sampleStep: 5,
    })
    // Normalize to world space: center around origin
    return raw.map(p => ({
      x: (p.x - 0.5) * 7,
      y: -(p.y - 0.5) * 1.6,
      z: 0,
    }))
  }, [])

  // Build instanced mesh geometry
  const dummy = useMemo(() => new THREE.Object3D(), [])
  const particleData = useMemo(() => {
    return Array.from({ length: PARTICLE_COUNT }).map((_, i) => ({
      // Initial position: scattered (former constellation stars area)
      ix: (Math.random() - 0.5) * 5,
      iy: (Math.random() - 0.5) * 4,
      iz: (Math.random() - 0.5) * 1,
      // Target position: letter pixel
      tx: targets[i % targets.length]?.x ?? 0,
      ty: targets[i % targets.length]?.y ?? 0,
      tz: 0,
      // Anim state
      progress: 0,
      delay: i * 3.5, // ms stagger
    }))
  }, [targets])

  // Initialize instance positions
  useEffect(() => {
    if (!meshRef.current) return
    particleData.forEach((p, i) => {
      dummy.position.set(p.ix, p.iy, p.iz)
      dummy.scale.setScalar(0.6)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  }, [particleData, dummy])

  // Animate particles toward letter targets
  useEffect(() => {
    if (!meshRef.current) return

    const timeout = setTimeout(() => {
      setPhase('forming')

      particleData.forEach((p, i) => {
        gsap.to(p, {
          progress: 1,
          duration: 1.8,
          delay: p.delay / 1000,
          ease: 'power3.inOut',
          onUpdate: () => {
            if (!meshRef.current) return
            const pr = p.progress
            dummy.position.set(
              p.ix + (p.tx - p.ix) * pr,
              p.iy + (p.ty - p.iy) * pr,
              p.iz + (p.tz - p.iz) * pr,
            )
            dummy.scale.setScalar(0.6 + pr * 0.4)
            dummy.updateMatrix()
            meshRef.current.setMatrixAt(i, dummy.matrix)
            meshRef.current.instanceMatrix.needsUpdate = true
          },
        })
      })

      // Signal completion
      setTimeout(() => {
        setPhase('formed')
        onComplete?.()
      }, particleData.length * 3.5 + 2000)

    }, 800)

    return () => clearTimeout(timeout)
  }, [particleData, dummy, onComplete])

  // Subtle drift when formed
  useFrame(({ clock }) => {
    if (phase !== 'formed' || !meshRef.current) return
    const t = clock.elapsedTime
    particleData.forEach((p, i) => {
      dummy.position.set(
        p.tx + Math.sin(t * 0.3 + i * 0.1) * 0.008,
        p.ty + Math.cos(t * 0.4 + i * 0.07) * 0.006,
        p.tz,
      )
      dummy.scale.setScalar(1.0 + Math.sin(t + i) * 0.05)
      dummy.updateMatrix()
      meshRef.current.setMatrixAt(i, dummy.matrix)
    })
    meshRef.current.instanceMatrix.needsUpdate = true
  })

  return (
    <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
      <sphereGeometry args={[0.018, 6, 4]} />
      <meshStandardMaterial
        color="#F8ECA0"
        emissive="#D0A820"
        emissiveIntensity={phase === 'formed' ? 1.8 : 0.8}
        roughness={0.1}
        metalness={0.05}
      />
    </instancedMesh>
  )
}
