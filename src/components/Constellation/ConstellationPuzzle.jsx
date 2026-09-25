import { useRef, useState, useCallback, useEffect } from 'react'
import { useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import gsap from 'gsap'
import Star from './Star.jsx'
import StarField from './StarField.jsx'
import {
  ALL_STARS,
  VALID_EDGES,
  isValidEdge,
  isPuzzleComplete,
} from '../../utils/constellation.js'
import { useStore } from '../../store/useStore.js'

// ════════════════════════════════════════════════════════
//  ConstellationPuzzle — Full star puzzle orchestrator
//  Stars scaled to viewport, forgiving touch targets
// ════════════════════════════════════════════════════════

// Map 0..1 normalized coords to 3D space
const SCALE_X = 4.5
const SCALE_Y = 4.0
const OFFSET_X = -2.25
const OFFSET_Y = 2.0

function normalizedToWorld(nx, ny) {
  return [
    nx * SCALE_X + OFFSET_X,
    -ny * SCALE_Y + OFFSET_Y,
    0,
  ]
}

// SVG-like line between two 3D points rendered in Three.js
function ConnectionLine({ start, end, complete }) {
  const ref = useRef()

  const dir = new THREE.Vector3(
    end[0] - start[0],
    end[1] - start[1],
    end[2] - start[2],
  )
  const length = dir.length()
  const midpoint = [
    (start[0] + end[0]) / 2,
    (start[1] + end[1]) / 2,
    (start[2] + end[2]) / 2,
  ]
  const quaternion = new THREE.Quaternion()
  const up = new THREE.Vector3(0, 1, 0)
  quaternion.setFromUnitVectors(up, dir.normalize())

  useFrame(({ clock }) => {
    if (!ref.current) return
    ref.current.material.opacity = complete
      ? 0.9 + Math.sin(clock.elapsedTime * 2) * 0.05
      : 0.55
  })

  return (
    <mesh ref={ref} position={midpoint} quaternion={quaternion}>
      <cylinderGeometry args={[0.004, 0.004, length, 4]} />
      <meshStandardMaterial
        color={complete ? '#F0D870' : '#C8D8F0'}
        emissive={complete ? '#D0B840' : '#5070A0'}
        emissiveIntensity={complete ? 1.2 : 0.4}
        transparent
        opacity={0.55}
        depthWrite={false}
      />
    </mesh>
  )
}

export default function ConstellationPuzzle() {
  const [selected, setSelected] = useState(null)
  const [connectedEdges, setConnectedEdges] = useState([])
  const setConstellationComplete = useStore((s) => s.setConstellationComplete)
  const setScene = useStore((s) => s.setScene)
  const { camera } = useThree()

  // Build star world positions
  const starPositions = ALL_STARS.reduce((acc, star) => {
    acc[star.id] = normalizedToWorld(star.x, star.y)
    return acc
  }, {})

  const connectedStarIds = new Set(connectedEdges.flat())
  const isComplete = isPuzzleComplete(connectedEdges)

  const handleStarSelect = useCallback((id) => {
    const star = ALL_STARS.find(s => s.id === id)

    if (!star.correct) {
      // Decoy — subtle shimmer, no punishment
      return
    }

    if (selected === null) {
      setSelected(id)
      return
    }

    if (selected === id) {
      // Deselect
      setSelected(null)
      return
    }

    // Try to connect
    if (isValidEdge(selected, id)) {
      const alreadyConnected = connectedEdges.some(
        ([a, b]) => (a === selected && b === id) || (a === id && b === selected)
      )

      if (!alreadyConnected) {
        setConnectedEdges(prev => [...prev, [selected, id]])
      }
      setSelected(null)
    } else {
      // Not adjacent — just switch selection
      setSelected(id)
    }
  }, [selected, connectedEdges])

  // Trigger completion sequence
  useEffect(() => {
    if (!isComplete) return

    setSelected(null)

    // 1.5s pause then transition
    setTimeout(() => {
      setConstellationComplete(true)

      // Camera push toward constellation
      gsap.to(camera.position, {
        z: -1, duration: 2, ease: 'power2.inOut',
      })

      // Transition to final scene after particle reveal
      setTimeout(() => {
        setScene('final')
      }, 2500)
    }, 1500)
  }, [isComplete, setConstellationComplete, setScene, camera])

  return (
    <>
      {/* Background star field */}
      <StarField count={350} />

      {/* Ambient night lighting */}
      <ambientLight intensity={0.08} color="#101828" />
      <pointLight position={[0, 5, 2]} intensity={0.3} color="#3050A0" distance={20} decay={2} />

      {/* Connection lines */}
      {connectedEdges.map(([a, b], i) => (
        <ConnectionLine
          key={`${a}-${b}`}
          start={starPositions[a]}
          end={starPositions[b]}
          complete={isComplete}
        />
      ))}

      {/* All stars */}
      {ALL_STARS.map((star) => (
        <Star
          key={star.id}
          id={star.id}
          position={starPositions[star.id]}
          correct={star.correct}
          selected={selected === star.id}
          connected={connectedStarIds.has(star.id) && star.correct}
          onSelect={handleStarSelect}
        />
      ))}
    </>
  )
}
