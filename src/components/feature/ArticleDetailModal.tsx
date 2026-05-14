import React from 'react'
import type { Article } from '@/globals/types'
import { LikeButton } from '@/features/likes/components/common/LikeButton'

interface Props {
    article: Article
    onClose: () => void
}

export function ArticleDetailModal({ article, onClose }: Props): React.ReactNode {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 pt-4"
            onClick={(e) => { if (e.target === e.currentTarget) onClose() }}>
            <div className="bg-white rounded-md w-full max-w-2xl max-h-[70vh] overflow-y-auto shadow-2xl border border-neutral-200">
                <div className="sticky top-0 z-10 bg-white border-b border-neutral-100 px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-green-100 flex items-center justify-center">
                            <span className="text-sm">📜</span>
                        </div>
                        <div>
                            <p className="text-[15px] font-semibold text-neutral-800">{article.title}</p>
                        </div>
                    </div>
                </div>
                {article.imageUrl && (
                    <div className="relative w-full h-56 bg-neutral-100">
                        <img
                            src={article.imageUrl}
                            alt={article.title}
                            className="w-full h-full object-cover"
                            onError={(e) => (e.currentTarget.style.display = 'none')}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                    </div>
                )}

                <div className="flex flex-wrap items-center gap-2 px-6 py-3 border-b border-neutral-100">
                    <span
                        className="text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-full border"
                        style={{
                            color: article.categoryColor,
                            borderColor: article.categoryColor,
                            backgroundColor: `${article.categoryColor}18`,
                        }}
                    >
                        {article.categoryLabel}
                    </span>
                    {article.isPremium && (
                        <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full bg-amber-50 text-amber-600 border border-amber-200">
                            Premium
                        </span>
                    )}
                    <span
                        className={`text-[10px] font-bold px-2.5 py-1 rounded-full border capitalize ${article.articleStatus === 'published'
                            ? 'bg-green-50 text-green-700 border-green-200'
                            : article.articleStatus === 'draft'
                                ? 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                : 'bg-blue-50 text-blue-700 border-blue-200'
                            }`}
                    >
                        {article.articleStatus}
                    </span>
                    <div className="ml-auto flex items-center">
                        <LikeButton
                            contentType="article"
                            contentId={article.id}
                        />
                    </div>
                </div>

                <div className="px-6 py-5 flex flex-col gap-5">
                    <div className="flex flex-col gap-2">
                        <div className="flex items-center gap-3 text-[12px] text-neutral-400 flex-wrap">
                            <span className="font-semibold text-neutral-600">{article.author}</span>
                            <span className="w-1 h-1 bg-neutral-300 rounded-full inline-block" />
                            <span>{article.readTime} read</span>
                            <span className="w-1 h-1 bg-neutral-300 rounded-full inline-block" />
                            <span>{article.date}</span>
                            <span className="w-1 h-1 bg-neutral-300 rounded-full inline-block" />
                            <span>{article.slug}</span>
                        </div>
                    </div>
                    <div className="h-px bg-neutral-100" />
                    <div>
                        <h1>  {article.title}</h1>
                    </div>
                    {article.excerpt && (
                        <div className="flex flex-col gap-1.5">
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">Excerpt</p>
                            <p
                                className="text-[13.5px] text-neutral-500 leading-relaxed italic pl-3.5 border-l-[3px]"
                                style={{ borderColor: article.categoryColor }}
                            >
                                {article.excerpt}
                            </p>
                        </div>
                    )}
                    {article.tags && article.tags.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                                Tags ({article.tags.length})
                            </p>
                            <div className="flex flex-wrap gap-1.5">
                                {article.tags.map((tag, i) => (
                                    <span
                                        key={i}
                                        className="text-[11px] font-medium px-2.5 py-1 rounded-full bg-neutral-100 text-neutral-600 border border-neutral-200"
                                    >
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}
                    {(article.seoTitle || article.seoDescription) && (
                        <div className="flex flex-col gap-2">
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">SEO Preview</p>
                            <div className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 flex flex-col gap-1.5">
                                {article.seoTitle && (
                                    <p className="text-[14px] font-medium text-black leading-snug">{article.seoTitle}</p>
                                )}
                                {article.seoDescription && (
                                    <p className="text-[12px] text-neutral-500 leading-relaxed">{article.seoDescription}</p>
                                )}
                            </div>
                        </div>
                    )}
                    {article.sections && article.sections.length > 0 && (
                        <div className="flex flex-col gap-2.5">
                            <p className="text-[10px] uppercase tracking-widest font-semibold text-neutral-400">
                                Sections ({article.sections.length})
                            </p>
                            {article.sections.map((section, sIdx) => (
                                <div key={sIdx} className="rounded-xl border border-neutral-200 overflow-hidden">
                                    <div className="flex items-center gap-3 px-4 py-2.5 bg-neutral-50 border-b border-neutral-100">
                                        <div className="w-5 h-5 rounded-md text-white text-[10px] bg-black/50 font-bold flex items-center justify-center flex-shrink-0">
                                            {sIdx + 1}
                                        </div>
                                        <p className="text-[13px] font-semibold text-neutral-800">{section.heading}</p>
                                    </div>
                                    <div className="flex flex-col divide-y divide-neutral-100">
                                        {section.items.map((item, iIdx) => (
                                            <div key={iIdx} className="flex items-start gap-2 px-4 py-2">
                                                <span className="mt-1.5 w-1.5 h-1.5 rounded-full flex-shrink-0" />
                                                <p className="text-[13px] text-neutral-600 leading-relaxed">{item}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-neutral-200 px-6 py-2 flex justify-end">
                    <button
                        type="button"
                        onClick={onClose}
                        className="text-xs font-semibold text-green-500 border border-green-200 rounded-full px-4 py-1 hover:bg-neutral-50 transition-colors">
                        Close
                    </button>
                </div>

            </div>
        </div>
    )
}