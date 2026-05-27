import React, { useState } from 'react'
import { X, Send } from 'lucide-react'
import { LikeButton } from '@/features/likes/components/common/LikeButton'
import { CommentButton } from '@/features/comments/components/CommentButton'
import { CommentModal } from '@/features/comments/components/CommentModal'
import { UnifiedMediaPlayer } from '@/features/podcasts/media/UnifiedMediaPlayer'
import type { Podcast } from '@/globals/types'

interface PodcastDetailModalProps {
    podcast: Podcast
    onClose: () => void
}

export function PodcastDetailModal({ podcast, onClose }: PodcastDetailModalProps): React.ReactNode {
    const [openComments, setOpenComments] = useState(false)

    return (
        <>
            <div
                className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm px-4"
                onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
            >
                <div className="w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl bg-white shadow-2xl border border-neutral-100 animate-zoom-in">

                    {/* ── Header ── */}
                    <div className="flex items-start justify-between gap-3 px-5 sm:px-6 pt-5 pb-4 border-b border-neutral-100">
                        <div className="flex flex-col gap-2.5 min-w-0 flex-1">

                            {/* Badges */}
                            <div className="flex items-center gap-2">
                                <span className="text-[10px] font-bold uppercase tracking-widest text-green-600 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full">
                                    {podcast.episode}
                                </span>
                                <span className="text-[10px] font-bold uppercase tracking-widest text-neutral-500 bg-neutral-100 px-2.5 py-1 rounded-full">
                                    {podcast.category}
                                </span>
                            </div>

                            {/* Title */}
                            <h2 className="text-lg sm:text-xl font-bold leading-snug text-neutral-900">
                                {podcast.title}
                            </h2>

                            {/* Guest */}
                            <p className="text-sm text-neutral-500">
                                with <span className="font-semibold text-neutral-700">{podcast.guest}</span>
                            </p>

                            {/* Meta + Actions row */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
                                {/* Duration + Date */}
                                <div className="flex items-center gap-3 text-xs text-neutral-500 flex-wrap">
                                    <span>
                                        <span className="font-medium text-neutral-700">Duration: </span>
                                        {podcast.duration}
                                    </span>
                                    <span className="w-1 h-1 rounded-full bg-neutral-300 shrink-0" />
                                    <span>
                                        <span className="font-medium text-neutral-700">Date: </span>
                                        {podcast.date}
                                    </span>
                                </div>

                                {/* Action buttons */}
                                <div
                                    className="flex items-center gap-4"
                                    onClick={(e) => e.stopPropagation()}
                                >
                                    <LikeButton contentType="podcast" contentId={podcast.id} />

                                    <CommentButton
                                        contentType="podcast"
                                        contentId={podcast.id}
                                        onClick={() => setOpenComments(true)}
                                    />

                                    <button
                                        type="button"
                                        className="flex items-center gap-1 text-neutral-400 hover:text-green-600 transition-colors"
                                    >
                                        <Send className="w-4 h-4" />
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Close */}
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="Close podcast detail"
                            className="shrink-0 w-8 h-8 flex items-center justify-center rounded-full bg-neutral-100 hover:bg-neutral-200 text-neutral-500 hover:text-neutral-800 transition-colors mt-0.5"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>

                    {/* ── Video Player ── */}
                    <div className="px-5 sm:px-6 py-5">
                        <div className="rounded-xl overflow-hidden bg-neutral-950">
                            <UnifiedMediaPlayer
                                mediaId={`podcast-${podcast.id}-detail`}
                                title={podcast.title}
                                sourceUrl={podcast.videoUrl}
                                kind="video"
                            />
                        </div>
                    </div>

                </div>
            </div>

            {/* Comment Modal — outside main modal so z-index sahi rahe */}
            {openComments && (
                <CommentModal
                    contentType="podcast"
                    contentId={podcast.id}
                    total={0}
                    onClose={() => setOpenComments(false)}
                />
            )}
        </>
    )
}