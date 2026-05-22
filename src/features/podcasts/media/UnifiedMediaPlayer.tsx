import React, { useCallback, useEffect, useRef, useState } from 'react'

type MediaKind = 'audio' | 'video'

interface UnifiedMediaPlayerProps {
  mediaId: string
  title: string
  sourceUrl: string
  kind: MediaKind
  posterUrl?: string
  className?: string
  autoPlay?: boolean
}

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) return '0:00'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`
  return `${m}:${s.toString().padStart(2, '0')}`
}

export function UnifiedMediaPlayer({
  mediaId,
  title,
  sourceUrl,
  kind,
  posterUrl,
  className,
  autoPlay = false,
}: UnifiedMediaPlayerProps): React.ReactNode {
  const mediaRef = useRef<HTMLAudioElement & HTMLVideoElement>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)


  const saveProgress = useCallback(
    async (time: number) => {
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/media/progress/${mediaId}`, {
          method: 'PUT',
          credentials: 'include',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            kind,
            positionSec: Math.floor(time),
            durationSec: Math.floor(duration),
          }),
        })
      } catch { }
    },
    [mediaId, kind, duration]
  )

  useEffect(() => {
    const media = mediaRef.current
    if (!media) return

    const onLoadedMetadata = (): void => {
      if (Number.isFinite(media.duration) && media.duration > 0) {
        setDuration(media.duration)
      }
      void (async () => {
        try {
          const res = await fetch(
            `${import.meta.env.VITE_API_BASE_URL}/api/media/progress/${mediaId}`,
            { credentials: 'include' }
          )
          if (res.ok) {
            const data = await res.json() as { positionSec: number }
            if (data.positionSec > 0 && data.positionSec < media.duration - 1) {
              media.currentTime = data.positionSec
              setCurrentTime(data.positionSec)
              if (autoPlay) void media.play()
            }
          }
        } catch { }
      })()
    }

    let lastSaved = 0
    const onTimeUpdate = (): void => {
      setCurrentTime(media.currentTime)
      if (media.duration && media.currentTime >= media.duration - 0.5) return
      if (Math.abs(media.currentTime - lastSaved) >= 10) {
        lastSaved = media.currentTime
        void saveProgress(media.currentTime)
      }
    }

    const onPlay = () => setIsPlaying(true)
    const onPause = (): void => {
      setIsPlaying(false)
      void saveProgress(media.currentTime)
    }

    const onBeforeUnload = (): void => {
      navigator.sendBeacon(
        `${import.meta.env.VITE_API_BASE_URL}/api/media/progress/${mediaId}`,
        JSON.stringify({
          kind,
          positionSec: Math.floor(media.currentTime),
          durationSec: Math.floor(media.duration),
        })
      )
    }
    window.addEventListener('beforeunload', onBeforeUnload)

    const onEnded = async () => {
      setIsPlaying(false)
      try {
        await fetch(`${import.meta.env.VITE_API_BASE_URL}/api/media/progress/${mediaId}`, {
          method: 'DELETE',
          credentials: 'include',
        })
      } catch { }
    }

    media.addEventListener('loadedmetadata', () => { void onLoadedMetadata() })
    media.addEventListener('timeupdate', onTimeUpdate)
    media.addEventListener('play', onPlay)
    media.addEventListener('pause', onPause)
    media.addEventListener('ended', onEnded)

    return () => {
      media.removeEventListener('loadedmetadata', () => { void onLoadedMetadata() })
      media.removeEventListener('timeupdate', onTimeUpdate)
      media.removeEventListener('play', onPlay)
      media.removeEventListener('pause', onPause)
      media.removeEventListener('ended', onEnded)
      window.removeEventListener('beforeunload', onBeforeUnload)
    }
  }, [mediaId, saveProgress])

  const togglePlayPause = async () => {
    const media = mediaRef.current
    if (!media) return
    if (media.paused) {
      await media.play()
      return
    }
    media.pause()
  }

  const handleSeek = (nextValue: number) => {
    const media = mediaRef.current
    if (!media || !Number.isFinite(nextValue)) return
    media.currentTime = nextValue
    setCurrentTime(nextValue)
    saveProgress(nextValue)
  }

  return (
    <div className={className}>
      {kind === 'video' ? (
        <video ref={mediaRef} src={sourceUrl} poster={posterUrl} autoPlay={autoPlay} className="w-full h-[176px] rounded-md bg-black object-cover" />
      ) : (
        <audio ref={mediaRef} src={sourceUrl} preload="metadata" />
      )}

      <div className="mt-2 rounded-md border border-border bg-white p-2 absolute bottom-[10px] left-[2.5%] w-[95%] bg-white/80 border-0">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => void togglePlayPause()}
            aria-label={isPlaying ? `Pause ${title}` : `Play ${title}`}
            className="h-8 min-w-10 rounded-md bg-green-500 px-3 text-xs font-bold text-white transition-colors hover:bg-green-600"
          >
            {isPlaying ? 'Pause' : 'Play'}
          </button>
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-semibold text-ink">{title}</p>

            <div className="mt-2 flex items-center gap-2">
              <span className="shrink-0 text-[10px] text-ink-4 tabular-nums">
                {formatTime(currentTime)}
              </span>
              <input
                type="range"
                min={0}
                max={Math.max(duration, 0)}
                step={0.1}
                value={Math.min(currentTime, duration || 0)}
                onChange={(e) => handleSeek(Number(e.target.value))}
                className="h-1 min-w-0 flex-1 accent-green-500 cursor-pointer"
              />
              <span className="shrink-0 text-right text-[10px] text-ink-4 tabular-nums">
                {formatTime(duration)}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
