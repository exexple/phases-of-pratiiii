import * as THREE from 'three'

// ════════════════════════════════════════════════════════
//  Room — Walls, floor, ceiling, architectural details
//  Stylized low-poly illustrated 3D aesthetic
// ════════════════════════════════════════════════════════

// Room dimensions
const W = 9    // width
const H = 4.5  // height
const D = 8    // depth

// Material helpers
function wallMat(color, roughness = 0.92, metalness = 0) {
  return <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
}

export default function Room() {
  return (
    <group>
      {/* ── Floor ─────────────────────────────────────── */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        <meshStandardMaterial color="#1E1A16" roughness={0.95} metalness={0.02} />
      </mesh>

      {/* Rug */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.002, 0.5]} receiveShadow>
        <planeGeometry args={[4.5, 2.8]} />
        <meshStandardMaterial color="#2A2330" roughness={1} />
      </mesh>

      {/* ── Back wall ─────────────────────────────────── */}
      <mesh position={[0, H / 2, -D / 2]} receiveShadow>
        <planeGeometry args={[W, H]} />
        {wallMat('#1C1A22')}
      </mesh>

      {/* ── Left wall ─────────────────────────────────── */}
      <mesh position={[-W / 2, H / 2, 0]} rotation={[0, Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        {wallMat('#1A1820')}
      </mesh>

      {/* ── Right wall ────────────────────────────────── */}
      <mesh position={[W / 2, H / 2, 0]} rotation={[0, -Math.PI / 2, 0]} receiveShadow>
        <planeGeometry args={[D, H]} />
        {wallMat('#1A1820')}
      </mesh>

      {/* ── Ceiling ───────────────────────────────────── */}
      <mesh position={[0, H, 0]} rotation={[Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[W, D]} />
        {wallMat('#13111A')}
      </mesh>

      {/* ── Baseboard / skirting (left wall) ─────────── */}
      <mesh position={[-W / 2 + 0.03, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.2, D]} />
        <meshStandardMaterial color="#252230" roughness={0.8} />
      </mesh>

      {/* ── Baseboard / skirting (right wall) ────────── */}
      <mesh position={[W / 2 - 0.03, 0.1, 0]}>
        <boxGeometry args={[0.06, 0.2, D]} />
        <meshStandardMaterial color="#252230" roughness={0.8} />
      </mesh>

      {/* ── Baseboard (back wall) ─────────────────────── */}
      <mesh position={[0, 0.1, -D / 2 + 0.03]}>
        <boxGeometry args={[W, 0.2, 0.06]} />
        <meshStandardMaterial color="#252230" roughness={0.8} />
      </mesh>

      {/* ── Ceiling trim ──────────────────────────────── */}
      <mesh position={[0, H - 0.05, -D / 2 + 0.03]}>
        <boxGeometry args={[W, 0.1, 0.06]} />
        <meshStandardMaterial color="#1A1822" transparent={true} opacity={0.5} roughness={0.9} />
      </mesh>

      {/* ── Wall panel detail (back wall decorative) ──── */}
      <mesh position={[0, H / 2, -D / 2 + 0.04]}>
        <boxGeometry args={[5.5, 3, 0.02]} />
        <meshStandardMaterial color="#1F1C26" roughness={0.95} />
      </mesh>
      <mesh position={[0, H / 2, -D / 2 + 0.05]}>
        <boxGeometry args={[5.2, 2.75, 0.01]} />
        <meshStandardMaterial color="#22202A" roughness={0.95} />
      </mesh>
    </group>
  )
}
