import { useRef, useState, useCallback } from 'react'
import { useFrame } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'
import { memories } from '../../data/memories.js'
import { useDiscovery } from '../../hooks/useDiscovery.js'

// ════════════════════════════════════════════════════════
//  Window — Camera push-in, moon shimmer, sky gateway
//  After enough discoveries, tapping triggers constellation hint
// ════════════════════════════════════════════════════════

function useHoverCursor() {
  return {
    onPointerEnter: () => { document.body.style.cursor = 'pointer' },
    onPointerLeave: () => { document.body.style.cursor = 'default' },
  }
}

// Animated moon
function Moon() {
  const ref = useRef()

  useFrame(({ clock }) => {
    if (!ref.current) return
    const t = clock.elapsedTime
    ref.current.material.emissiveIntensity = 0.4 + Math.sin(t * 0.3) * 0.05
  })

  return (
    <mesh ref={ref} position={[0.8, 0.6, -0.1]}>
      <circleGeometry args={[0.18, 16]} />
      <meshStandardMaterial
        color="#D8E8F4"
        emissive="#C0D4EC"
        emissiveIntensity={0.4}
        roughness={0.8}
      />
    </mesh>
  )
}

// Stars visible through window
function WindowStars() {
  return (
    <>
      {Array.from({ length: 18 }).map((_, i) => {
        const x = (Math.sin(i * 137.5) * 0.5)
        const y = (Math.cos(i * 97.3) * 0.4) + 0.1
        const size = 0.006 + Math.random() * 0.008
        return (
          <mesh key={i} position={[x, y, -0.05]}>
            <circleGeometry args={[size, 6]} />
            <meshStandardMaterial
              color="#E8F0F8"
              emissive="#E8F0F8"
              emissiveIntensity={0.8}
            />
          </mesh>
        )
      })}
    </>
  )
}

export default function Window() {
  const groupRef = useRef()
  const cursor = useHoverCursor()
  const { handleDiscover } = useDiscovery()
  const setActiveMemory = useStore((s) => s.setActiveMemory)
  const showConstellationHint = useStore((s) => s.showConstellationHint)
  const setScene = useStore((s) => s.setScene)
  const setShowSkyIntro = useStore((s) => s.setShowSkyIntro)

  const handleTap = useCallback(() => {
    if (showConstellationHint) {
      // Transition to sky
      gsap.to(groupRef.current?.position || {}, { z: 0 }) // noop, camera handles it
      setTimeout(() => {
        setScene('sky')
        setShowSkyIntro(true)
      }, 1200)
    } else {
      // Regular memory
      const mem = memories.find(m => m.id === 'window-01')
      if (mem) {
        handleDiscover('window-01')
        setActiveMemory(mem)
      }
    }
  }, [showConstellationHint, handleDiscover, setActiveMemory, setScene, setShowSkyIntro])

  return (
    <group ref={groupRef} position={[0, 2.1, -3.98]}>
      {/* ── Window frame outer ─────────────────────── */}
      <mesh castShadow>
        <boxGeometry args={[2.2, 1.8, 0.08]} />
        <meshStandardMaterial color="#1A1828" roughness={0.85} />
      </mesh>

      {/* ── Glass (dark night sky) ─────────────────── */}
      <mesh position={[0, 0, 0.05]}>
        <planeGeometry args={[2.0, 1.6]} />
        <meshStandardMaterial
          color="#060A18"
          roughness={0.0}
          metalness={0.1}
          transparent
          opacity={0.92}
        />
      </mesh>

      {/* ── Night sky bg ───────────────────────────── */}
      <group position={[0, 0, 0.04]}>
        <WindowStars />
        <Moon />
      </group>

      {/* ── Window crossbar H ─────────────────────── */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[2.0, 0.04, 0.04]} />
        <meshStandardMaterial color="#1E1C2C" roughness={0.8} />
      </mesh>

      {/* ── Window crossbar V ─────────────────────── */}
      <mesh position={[0, 0, 0.06]}>
        <boxGeometry args={[0.04, 1.6, 0.04]} />
        <meshStandardMaterial color="#1E1C2C" roughness={0.8} />
      </mesh>

      {/* Invisible large tap target */}
      <mesh visible={false} onClick={handleTap} position={[0, 0, 0.1]}>
        <boxGeometry args={[2.2, 1.8, 0.3]} />
      </mesh>

      {/* Moonlight spill on floor */}
      <pointLight position={[0, -2, 1]} intensity={0.15} color="#8AAAC0" distance={5} decay={2} />
    </group>
  )
}
