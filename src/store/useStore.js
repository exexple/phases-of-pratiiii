import { create } from 'zustand'

// ════════════════════════════════════════════════════════
//  Global store — scene state, discoveries, audio, quality
// ════════════════════════════════════════════════════════

export const useStore = create((set, get) => ({
  // ── Scene ──────────────────────────────────────────────
  scene: 'loading',   // 'loading' | 'intro' | 'world' | 'sky' | 'final'
  setScene: (scene) => set({ scene }),

  // ── Discovery ──────────────────────────────────────────
  discovered: new Set(),
  discoveredPolaroids: new Set(),
  discoveredSecrets: new Set(),

  discover: (id) => set((s) => ({
    discovered: new Set([...s.discovered, id]),
  })),
  discoverPolaroid: (id) => set((s) => ({
    discoveredPolaroids: new Set([...s.discoveredPolaroids, id]),
  })),
  discoverSecret: (id) => set((s) => ({
    discoveredSecrets: new Set([...s.discoveredSecrets, id]),
  })),

  get discoveryCount() {
    return get().discovered.size
  },

  // ── Phase progression ──────────────────────────────────
  phaseIndex: 0,
  advancePhase: () => set((s) => ({
    phaseIndex: Math.min(s.phaseIndex + 1, 4),
  })),

  // ── Active memory/polaroid display ─────────────────────
  activeMemory: null,
  setActiveMemory: (memory) => set({ activeMemory: memory }),

  activePolaroid: null,
  setActivePolaroid: (polaroid) => set({ activePolaroid: polaroid }),

  // ── Constellation ──────────────────────────────────────
  constellationComplete: false,
  setConstellationComplete: () => set({ constellationComplete: true }),

  // ── Audio ──────────────────────────────────────────────
  audioPlaying: false,
  audioReady: false,
  setAudioPlaying: (v) => set({ audioPlaying: v }),
  setAudioReady: (v) => set({ audioReady: v }),

  // ── Quality tier ───────────────────────────────────────
  qualityTier: 'high',  // 'high' | 'medium' | 'low'
  setQualityTier: (tier) => set({ qualityTier: tier }),

  // ── Hint flag (constellation gateway) ─────────────────
  showConstellationHint: false,
  setShowConstellationHint: (v) => set({ showConstellationHint: v }),

  // ── Sky intro text ─────────────────────────────────────
  showSkyIntro: false,
  setShowSkyIntro: (v) => set({ showSkyIntro: v }),
}))
