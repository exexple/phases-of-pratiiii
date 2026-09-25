import { useEffect } from 'react'
import { useStore } from '../store/useStore.js'

// ════════════════════════════════════════════════════════
//  useDeviceQuality — Sets quality tier based on device
//  High: modern GPU phones, desktop
//  Medium: mid-range phones
//  Low: older devices / reduced motion preference
// ════════════════════════════════════════════════════════

export function useDeviceQuality() {
  const setQualityTier = useStore((s) => s.setQualityTier)

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches

    if (prefersReducedMotion) {
      setQualityTier('low')
      return
    }

    // Hardware concurrency heuristic
    const cores = navigator.hardwareConcurrency || 4
    const memory = navigator.deviceMemory || 4  // GB, Chrome only

    if (cores <= 2 || memory <= 2) {
      setQualityTier('low')
    } else if (cores <= 4 || memory <= 4) {
      setQualityTier('medium')
    } else {
      setQualityTier('high')
    }
  }, [setQualityTier])
}
