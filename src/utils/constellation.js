// ════════════════════════════════════════════════════════
//  Constellation — P Shape Star Coordinates
//  Normalized 0→1 coordinate space, scaled at render time.
//
//  The P consists of:
//    - A vertical stroke (left side)
//    - A curved bump (right side, upper half)
//    - Connection segments forming a clear capital P
// ════════════════════════════════════════════════════════

// ── Correct stars (form the P) ─────────────────────────
// Carefully positioned to produce unmistakable P shape
export const CONSTELLATION_STARS = [
  // Vertical stroke — left column
  { id: 'p0',  x: 0.30, y: 0.10, correct: true },  // top
  { id: 'p1',  x: 0.30, y: 0.22, correct: true },
  { id: 'p2',  x: 0.30, y: 0.35, correct: true },
  { id: 'p3',  x: 0.30, y: 0.48, correct: true },  // mid (P bump base)
  { id: 'p4',  x: 0.30, y: 0.61, correct: true },
  { id: 'p5',  x: 0.30, y: 0.74, correct: true },
  { id: 'p6',  x: 0.30, y: 0.88, correct: true },  // bottom

  // Bump — top horizontal bar
  { id: 'p7',  x: 0.42, y: 0.10, correct: true },  // top crossbar right
  { id: 'p8',  x: 0.54, y: 0.10, correct: true },  // top

  // Bump — right curve
  { id: 'p9',  x: 0.62, y: 0.17, correct: true },  // upper right
  { id: 'p10', x: 0.66, y: 0.26, correct: true },  // rightmost
  { id: 'p11', x: 0.63, y: 0.36, correct: true },  // lower right

  // Bump — middle crossbar
  { id: 'p12', x: 0.52, y: 0.45, correct: true },  // mid right
  { id: 'p13', x: 0.40, y: 0.48, correct: true },  // mid crossbar left (meets stroke p3)
]

// ── Valid connection edges ──────────────────────────────
// Pairs of star IDs that form valid P segments
export const VALID_EDGES = [
  // Vertical stroke
  ['p0', 'p1'], ['p1', 'p2'], ['p2', 'p3'], ['p3', 'p4'],
  ['p4', 'p5'], ['p5', 'p6'],
  // Top bar
  ['p0', 'p7'], ['p7', 'p8'],
  // Right curve
  ['p8', 'p9'], ['p9', 'p10'], ['p10', 'p11'],
  // Mid bar
  ['p11', 'p12'], ['p12', 'p13'], ['p13', 'p3'],
]

// Total edges needed to complete the P
export const TOTAL_EDGES = VALID_EDGES.length

// ── Decoy stars (wrong stars, placed outside P zone) ────
// Placed to feel naturally distributed, not suspicious
export const DECOY_STARS = [
  { id: 'd0',  x: 0.08, y: 0.15, correct: false },
  { id: 'd1',  x: 0.18, y: 0.38, correct: false },
  { id: 'd2',  x: 0.12, y: 0.65, correct: false },
  { id: 'd3',  x: 0.05, y: 0.82, correct: false },
  { id: 'd4',  x: 0.20, y: 0.92, correct: false },
  { id: 'd5',  x: 0.78, y: 0.08, correct: false },
  { id: 'd6',  x: 0.88, y: 0.25, correct: false },
  { id: 'd7',  x: 0.82, y: 0.48, correct: false },
  { id: 'd8',  x: 0.75, y: 0.70, correct: false },
  { id: 'd9',  x: 0.88, y: 0.85, correct: false },
  { id: 'd10', x: 0.55, y: 0.65, correct: false },
  { id: 'd11', x: 0.45, y: 0.80, correct: false },
  { id: 'd12', x: 0.68, y: 0.55, correct: false },
]

export const ALL_STARS = [...CONSTELLATION_STARS, ...DECOY_STARS]

// ── Edge validation ─────────────────────────────────────
export function isValidEdge(starA, starB) {
  return VALID_EDGES.some(
    ([a, b]) => (a === starA && b === starB) || (a === starB && b === starA)
  )
}

// ── Check if puzzle is complete ─────────────────────────
export function isPuzzleComplete(connectedEdges) {
  return VALID_EDGES.every(([a, b]) =>
    connectedEdges.some(([ca, cb]) =>
      (ca === a && cb === b) || (ca === b && cb === a)
    )
  )
}
