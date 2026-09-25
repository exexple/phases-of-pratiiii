// ════════════════════════════════════════════════════════
//  particleText.js — Sample text pixels for PRATIKSHA
//
//  Renders text to an OffscreenCanvas, samples filled pixels,
//  returns normalized [x,y] targets for the particle system.
// ════════════════════════════════════════════════════════

/**
 * Sample particle positions from rendered text.
 * @param {string} text — e.g. "PRATIKSHA"
 * @param {object} options
 * @param {number} options.fontSize — px, default 96
 * @param {string} options.font — CSS font string
 * @param {number} options.sampleStep — pixel grid step, default 4
 * @param {number} options.canvasWidth — default 800
 * @param {number} options.canvasHeight — default 160
 * @returns {{ x: number, y: number }[]} normalized 0..1 positions
 */
export function sampleTextParticles(text, {
  fontSize = 96,
  font = `600 ${fontSize}px 'Cormorant Garamond', Georgia, serif`,
  sampleStep = 4,
  canvasWidth = 800,
  canvasHeight = 160,
} = {}) {
  // OffscreenCanvas works in modern browsers including mobile Safari 16.4+
  let canvas
  try {
    canvas = new OffscreenCanvas(canvasWidth, canvasHeight)
  } catch {
    // Fallback to regular canvas for older browsers
    canvas = document.createElement('canvas')
    canvas.width = canvasWidth
    canvas.height = canvasHeight
  }

  const ctx = canvas.getContext('2d')
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)
  ctx.fillStyle = '#ffffff'
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.letterSpacing = '0.08em'
  ctx.fillText(text, canvasWidth / 2, canvasHeight / 2)

  const imageData = ctx.getImageData(0, 0, canvasWidth, canvasHeight)
  const pixels = imageData.data
  const points = []

  for (let y = 0; y < canvasHeight; y += sampleStep) {
    for (let x = 0; x < canvasWidth; x += sampleStep) {
      const idx = (y * canvasWidth + x) * 4
      const alpha = pixels[idx + 3]
      if (alpha > 128) {
        points.push({
          x: x / canvasWidth,
          y: y / canvasHeight,
        })
      }
    }
  }

  return points
}

/**
 * Generate individual letter positions with timing offsets.
 * Returns an array of { letter, particles, delay } for staggered reveal.
 */
export function sampleLetterByLetter(text, options = {}) {
  const letters = text.split('')
  const result = []

  letters.forEach((letter, i) => {
    // Build up prefix to get cumulative letter positions
    const prefix = text.slice(0, i + 1)
    const all = sampleTextParticles(prefix, options)
    result.push({
      letter,
      index: i,
      particles: all,
      delay: i * 220, // ms between each letter appearing
    })
  })

  return result
}
