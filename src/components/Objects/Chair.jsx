// ════════════════════════════════════════════════════════
//  Chair — Simple stylized chair geometry (environmental)
// ════════════════════════════════════════════════════════

export default function Chair({ position = [2.8, 0, 1.2] }) {
  const legColor = '#1A1820'
  const seatColor = '#252230'
  const backColor = '#222030'

  return (
    <group position={position} rotation={[0, -0.4, 0]}>
      {/* Seat */}
      <mesh position={[0, 0.52, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.52, 0.06, 0.48]} />
        <meshStandardMaterial color={seatColor} roughness={0.9} />
      </mesh>

      {/* Back support */}
      <mesh position={[0, 0.85, -0.22]} castShadow>
        <boxGeometry args={[0.48, 0.6, 0.04]} />
        <meshStandardMaterial color={backColor} roughness={0.88} />
      </mesh>

      {/* Back legs */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.25, -0.22]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color={legColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Front legs */}
      {[-0.22, 0.22].map((x, i) => (
        <mesh key={i} position={[x, 0.25, 0.22]} castShadow>
          <boxGeometry args={[0.04, 0.5, 0.04]} />
          <meshStandardMaterial color={legColor} roughness={0.9} />
        </mesh>
      ))}

      {/* Seat cushion */}
      <mesh position={[0, 0.56, 0.02]}>
        <boxGeometry args={[0.46, 0.04, 0.42]} />
        <meshStandardMaterial color="#2A2840" roughness={0.95} />
      </mesh>
    </group>
  )
}
