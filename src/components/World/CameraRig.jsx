import { useRef, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import gsap from 'gsap'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  CameraRig — GSAP-driven cinematic camera controller
//
//  Handles:
//    - Idle drift (slow sinusoidal)
//    - Object focus (smooth push-in)
//    - Scene transitions
//    - Mobile vs desktop composition
// ════════════════════════════════════════════════════════

const isMobile = () => window.innerWidth < 768

// Camera preset positions
export const CAM_PRESETS = {
  intro:   { pos: [0, 1.6, 5.5], target: [0, 1.2, 0] },
  world:   { pos: [0, 1.6, 4.2], target: [0, 1.2, 0] },
  worldMobile: { pos: [0, 1.7, 5.0], target: [0, 1.3, 0] },
  lamp:    { pos: [1.0, 2.0, 2.8], target: [1.0, 1.8, 0] },
  drawer:  { pos: [-0.5, 0.9, 2.5], target: [-0.5, 0.7, 0] },
  book:    { pos: [-2.2, 1.5, 2.5], target: [-2.2, 1.5, 0] },
  headphones: { pos: [0.2, 1.6, 2.5], target: [0.2, 1.4, 0] },
  window:  { pos: [0, 1.8, 1.5], target: [0, 1.8, -3] },
  sky:     { pos: [0, 0, 0.1], target: [0, 0, -1] },
}

export default function CameraRig() {
  const { camera } = useThree()
  const activeMemory = useStore((s) => s.activeMemory)
  const scene = useStore((s) => s.scene)
  const driftRef = useRef({ t: 0 })
  const tlRef = useRef(null)
  const focusedRef = useRef(false)

  // Set initial camera position
  useEffect(() => {
    const mobile = isMobile()
    const preset = mobile ? CAM_PRESETS.worldMobile : CAM_PRESETS.world
    camera.position.set(...preset.pos)
    camera.lookAt(...preset.target)
  }, [camera])

  // Focus camera on active memory object
  useEffect(() => {
    if (tlRef.current) tlRef.current.kill()

    if (activeMemory && CAM_PRESETS[activeMemory.object]) {
      focusedRef.current = true
      const preset = CAM_PRESETS[activeMemory.object]
      tlRef.current = gsap.timeline()
      tlRef.current.to(camera.position, {
        x: preset.pos[0], y: preset.pos[1], z: preset.pos[2],
        duration: 1.4, ease: 'power2.inOut',
      })
    } else if (focusedRef.current) {
      focusedRef.current = false
      const mobile = isMobile()
      const preset = mobile ? CAM_PRESETS.worldMobile : CAM_PRESETS.world
      tlRef.current = gsap.to(camera.position, {
        x: preset.pos[0], y: preset.pos[1], z: preset.pos[2],
        duration: 1.8, ease: 'power2.inOut',
      })
    }
  }, [activeMemory, camera])

  // Idle drift
  useFrame((_, delta) => {
    if (focusedRef.current) return
    if (scene !== 'world') return
    driftRef.current.t += delta * 0.12
    const t = driftRef.current.t
    camera.position.x += (Math.sin(t) * 0.015 - camera.position.x * 0.002)
    camera.position.y += (Math.sin(t * 0.7) * 0.01 - (camera.position.y - 1.6) * 0.002)
  })

  return null
}
