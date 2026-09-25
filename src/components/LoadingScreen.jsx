import { useState, useEffect } from 'react'

// ════════════════════════════════════════════════════════
//  Loading Screen — flower pulse + fade out
// ════════════════════════════════════════════════════════

export default function LoadingScreen({ loaded, onLoaded }) {
  useEffect(() => {
    // Simulate loading / ensure fonts are loaded
    const timer = setTimeout(() => {
      onLoaded()
    }, 2000)
    return () => clearTimeout(timer)
  }, [onLoaded])

  return (
    <div className={`loading-screen ${loaded ? 'hidden' : ''}`}>
      <div className="loading-flower">🌺</div>
      <p className="loading-text">some phases of pratii</p>
    </div>
  )
}
