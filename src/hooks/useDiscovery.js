import { useCallback } from 'react'
import { useStore } from '../store/useStore.js'

// ════════════════════════════════════════════════════════
//  useDiscovery — Tracks object discoveries + phase advance
// ════════════════════════════════════════════════════════

const PHASE_THRESHOLDS = [0, 3, 5, 7, 10]  // discoveries needed per phase
const CONSTELLATION_THRESHOLD = 7           // show constellation hint after N discoveries

export function useDiscovery() {
  const discovered = useStore((s) => s.discovered)
  const discover = useStore((s) => s.discover)
  const discoverPolaroid = useStore((s) => s.discoverPolaroid)
  const discoverSecret = useStore((s) => s.discoverSecret)
  const phaseIndex = useStore((s) => s.phaseIndex)
  const advancePhase = useStore((s) => s.advancePhase)
  const setShowConstellationHint = useStore((s) => s.setShowConstellationHint)
  const showConstellationHint = useStore((s) => s.showConstellationHint)

  const handleDiscover = useCallback((id) => {
    // Read fresh state to avoid stale closures
    const state = useStore.getState()
    if (state.discovered.has(id)) return
    state.discover(id)

    const newCount = state.discovered.size + 1  // +1 because discover is synchronous

    // Phase advancement
    const nextThreshold = PHASE_THRESHOLDS[state.phaseIndex + 1]
    if (nextThreshold && newCount >= nextThreshold) {
      state.advancePhase()
    }

    // Constellation hint trigger
    if (!state.showConstellationHint && newCount >= CONSTELLATION_THRESHOLD) {
      setTimeout(() => useStore.getState().setShowConstellationHint(true), 2000)
    }
  }, [])  // No deps needed — reads fresh state every call

  return {
    handleDiscover,
    discoverPolaroid,
    discoverSecret,
    discoveryCount: discovered.size,
  }
}
