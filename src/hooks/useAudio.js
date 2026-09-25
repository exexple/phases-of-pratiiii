import { useEffect, useRef, useCallback } from 'react'
import { Howl } from 'howler'
import { musicConfig } from '../data/music.js'
import { useStore } from '../store/useStore.js'

// ════════════════════════════════════════════════════════
//  useAudio — Howler.js backed music hook
//  Handles autoplay, fallback on first interaction, fade-in
// ════════════════════════════════════════════════════════

export function useAudio() {
  const howlRef = useRef(null)
  const { audioPlaying, setAudioPlaying, setAudioReady } = useStore()
  const startedRef = useRef(false)

  useEffect(() => {
    const sound = new Howl({
      src: [musicConfig.src],
      loop: musicConfig.loop,
      volume: 0,
      html5: true,
      onload: () => {
        setAudioReady(true)
      },
      onloaderror: () => {
        // Graceful degradation — no audio, no crash
        console.warn('[audio] Music file not found. Drop it in /public/audio/')
        setAudioReady(false)
      },
      onplay: () => setAudioPlaying(true),
      onpause: () => setAudioPlaying(false),
      onstop: () => setAudioPlaying(false),
    })

    howlRef.current = sound

    // Attempt autoplay
    const id = sound.play()
    sound.fade(0, musicConfig.volume, musicConfig.fadeInMs, id)

    return () => {
      sound.unload()
    }
  }, []) // eslint-disable-line

  const startMusic = useCallback(() => {
    if (startedRef.current) return
    const sound = howlRef.current
    if (!sound) return
    startedRef.current = true

    if (!sound.playing()) {
      const id = sound.play()
      sound.fade(0, musicConfig.volume, musicConfig.fadeInMs, id)
    }
  }, [])

  const togglePlay = useCallback(() => {
    const sound = howlRef.current
    if (!sound) return
    if (sound.playing()) {
      sound.pause()
    } else {
      startedRef.current = true
      sound.play()
    }
  }, [])

  const toggleMute = useCallback(() => {
    const sound = howlRef.current
    if (!sound) return
    sound.mute(!sound._muted)
  }, [])

  return { startMusic, togglePlay, toggleMute, howlRef }
}
