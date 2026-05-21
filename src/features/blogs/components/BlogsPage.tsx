// import React, { useDeferredValue, useMemo, useState } from 'react'
// import { useNavigate } from 'react-router-dom'
// import { SectionHeader } from '@/components/common/SectionHeader'
// import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
// import { ErrorMessage } from '@/components/common/ErrorMessage'
// import { EmptyState } from '@/components/common/EmptyState'
// import { useArticles } from '@/features/articles/hooks/useArticles'
// import { getUserFriendlyMessage } from '@/lib/errors'
// import type { Article } from '@/globals/types'

// // import { LikeButton } from '@/features/likes/components/common/LikeButton'

// function BlogCard({
//   article,
//   onOpen,
//   compact = false,
// }: {
//   article: Article
//   onOpen: (slug: string) => void
//   compact?: boolean
// }): React.ReactNode {
//   return (
//     <article
//       className={`vh-card vh-card-hover cursor-pointer overflow-hidden ${
//         compact ? 'flex flex-col xs:flex-row gap-3 p-3' : ''
//       }`}
//       onClick={() => onOpen(article.slug)}
//     >
//       <img
//         src={article.imageUrl}
//         alt={article.title}
//         loading="lazy"
//         className={
//           compact
//             ? 'h-32 xs:h-20 w-full xs:w-24 rounded-xl object-cover shrink-0'
//             : 'h-44 sm:h-48 w-full object-cover'
//         }
//       />
//       <div className={compact ? 'min-w-0 flex-1' : 'p-4 sm:p-5'}>
//         <div className="flex items-center justify-between gap-3">
//           <p
//             className="text-[10px] font-bold uppercase tracking-[0.1em] truncate"
//             style={{ color: article.categoryColor }}
//           >
//             {article.categoryLabel}
//           </p>
//           <div className="shrink-0">💖</div>
//         </div>
//         <h3
//           className={`font-serif font-bold text-ink leading-snug mt-1 ${
//             compact ? 'text-sm line-clamp-2' : 'text-base sm:text-lg line-clamp-2'
//           }`}
//         >
//           {article.title}
//         </h3>
//         <p className="mt-2 text-[11px] text-ink-4">
//           {article.author} · {article.date}
//         </p>
//       </div>
//     </article>
//   )
// }

// export function BlogsPage(): React.ReactNode {
//   const navigate = useNavigate()
//   const { data: articles, isLoading, isError, error, refetch } = useArticles()
//   const [search, setSearch] = useState('')
//   const deferredSearch = useDeferredValue(search)
//   const isSearching = search !== deferredSearch

//   const filteredArticles = useMemo(() => {
//     if (!articles) return []
//     const query = deferredSearch.trim().toLowerCase()
//     if (!query) return articles
//     return articles.filter((article) => {
//       return (
//         article.title.toLowerCase().includes(query) ||
//         article.excerpt.toLowerCase().includes(query) ||
//         article.categoryLabel.toLowerCase().includes(query) ||
//         article.author.toLowerCase().includes(query) ||
//         article.tags?.some((tag) => tag.toLowerCase().includes(query))
//       )
//     })
//   }, [articles, deferredSearch])

//   const categories = useMemo(() => {
//     return Array.from(new Set(filteredArticles.map((a) => a.categoryLabel)))
//   }, [filteredArticles])

//   const featured = useMemo(() => filteredArticles.slice(0, 1), [filteredArticles])
//   const latest = useMemo(() => filteredArticles.slice(1, 5), [filteredArticles])
//   const popular = useMemo(() => filteredArticles.slice(5, 9), [filteredArticles])

//   const openBlog = (slug: string) => navigate(`/blogs/${slug}`)

//   return (
//     <main id="main-content">
//       <section className="bg-gradient-to-br from-ink to-green-700 py-12 sm:py-16 text-white">
//         <div className="vh-container text-center">
//           <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-green-300">
//             Healthcare Blogs
//           </p>
//           <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-black tracking-tight text-white">
//             Vitalize Blog
//           </h1>
//           <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
//             Explore expert-backed healthcare articles, practical wellness guides, and science-first insights.
//           </p>
//           <div className="mx-auto mt-6 max-w-md">
//             <label htmlFor="blog-search" className="sr-only">
//               Search blogs
//             </label>
//             <div className="relative">
//               <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-white/70">
//                 🔍
//               </span>
//               <input
//                 id="blog-search"
//                 value={search}
//                 onChange={(e) => setSearch(e.target.value)}
//                 placeholder="Search blogs by title, keyword, author..."
//                 className="w-full rounded-full border border-white/20 bg-white/10 py-2.5 pl-9 pr-4 text-sm text-white placeholder:text-white/60 outline-none transition-all focus:border-green-300 focus:bg-white/15"
//               />
//             </div>
//           </div>
//         </div>
//       </section>

//       <div className="vh-container py-10 sm:py-12">
//         {isLoading || isSearching ? (
//           <ArticleCardSkeleton count={6} />
//         ) : isError ? (
//           <ErrorMessage message={getUserFriendlyMessage(error)} onRetry={() => void refetch()} />
//         ) : !articles || articles.length === 0 ? (
//           <EmptyState message="No blog posts available yet." icon="📝" />
//         ) : filteredArticles.length === 0 ? (
//           <EmptyState message="No blogs match your search." icon="🔎" />
//         ) : (
//           <>
//             <SectionHeader eyebrow="Top Pick" title="Featured" titleAccent="Blog" />
//             {featured[0] && (
//               <article
//                 className="vh-card vh-card-hover mb-10 cursor-pointer overflow-hidden"
//                 onClick={() => openBlog(featured[0].slug)}
//               >
//                 <img
//                   src={featured[0].imageUrl}
//                   alt={featured[0].title}
//                   className="h-56 sm:h-72 lg:h-80 w-full object-cover"
//                 />
//                 <div className="p-5 sm:p-6">
//                   <div className="flex items-center justify-between gap-3 mb-3">
//                     <p
//                       className="text-[10px] font-bold uppercase tracking-[0.12em]"
//                       style={{ color: featured[0].categoryColor }}
//                     >
//                       {featured[0].categoryLabel}
//                     </p>
//                     <p className="shrink-0 text-lg leading-none">💖</p>
//                   </div>
//                   <h2 className="font-serif text-xl sm:text-2xl lg:text-3xl font-black text-ink leading-snug">
//                     {featured[0].title}
//                   </h2>
//                   <p className="mt-2 text-sm leading-relaxed text-ink-3 line-clamp-3">
//                     {featured[0].excerpt}
//                   </p>
//                   <p className="mt-4 text-xs font-medium text-ink-4">
//                     {featured[0].author} · {featured[0].date}
//                   </p>
//                 </div>
//               </article>
//             )}

//             <SectionHeader eyebrow="Fresh Reads" title="Latest" titleAccent="Blogs" />
//             <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {latest.map((article) => (
//                 <BlogCard key={article.id} article={article} onOpen={openBlog} />
//               ))}
//             </div>

//             <SectionHeader eyebrow="Reader Favorites" title="Popular" titleAccent="Blogs" />
//             <div className="mb-10 grid grid-cols-1 sm:grid-cols-2 gap-4">
//               {popular.map((article) => (
//                 <BlogCard key={article.id} article={article} onOpen={openBlog} compact />
//               ))}
//             </div>

//             <SectionHeader eyebrow="Discover Topics" title="Blog" titleAccent="Categories" />
//             <div className="flex flex-wrap gap-2">
//               {categories.map((category) => (
//                 <span
//                   key={category}
//                   className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
//                 >
//                   {category}
//                 </span>
//               ))}
//             </div>
//           </>
//         )}
//       </div>
//     </main>
//   )
// }




import React, { useState, useMemo, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Blog } from './blogs'
import { fetchBlogs, uploadBlogDocument } from './blog'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ChevronRight, ChevronLeft, User, Clock, Calendar, MessageCircle, Upload, Search } from 'lucide-react'
import { LikeButton } from '@/features/likes/components/common/LikeButton'

const PER_PAGE = 10

export function BlogsPage(): React.ReactNode {
  const navigate = useNavigate()

  // ── State ──────────────────────────────────────────────
  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [page, setPage] = useState(1)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Fetch blogs on mount ────────────────────────────────
  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

  // ── Derived ─────────────────────────────────────────────
  const CATEGORIES = useMemo(
    () => ['All', ...Array.from(new Set(blogs.map((b) => b.cat)))],
    [blogs]
  )

  const featuredBlog = useMemo(
    () => (!search && activeCat === 'All' ? blogs.find((b) => b.featured) : null),
    [blogs, search, activeCat]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return blogs
      .filter((b) => {
        const matchCat = activeCat === 'All' || b.cat === activeCat
        const matchSearch =
          b.title.toLowerCase().includes(q) ||
          b.desc.toLowerCase().includes(q) ||
          b.cat.toLowerCase().includes(q)
        return matchCat && matchSearch
      })
      .filter((b) => !(featuredBlog && b.id === featuredBlog.id))
  }, [blogs, search, activeCat, featuredBlog])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  // ── Handlers ────────────────────────────────────────────
  const handleCat = (cat: string) => { setActiveCat(cat); setPage(1) }

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    setUploadError(null)
    const formData = new FormData()
    formData.append('document', file)
    formData.append('cat', 'General')
    formData.append('authorName', 'Vitalize Team')
    formData.append('specialist', 'Health Writer')
    try {
      const newBlog = await uploadBlogDocument(formData)
      setBlogs((prev) => [newBlog, ...prev])
    } catch (err) {
      setUploadError(err instanceof Error ? err.message : 'Upload failed')
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  // ── Render ──────────────────────────────────────────────
  return (
    <main id="main-content">
      {/* ── Sticky category tabs (same style as ArticlesPage) ── */}
      <div className="bg-white/95 backdrop-blur-md border-b border-border py-3 sticky top-14 sm:top-16 z-[98]">
        <div className="vh-container flex justify-center gap-2 overflow-x-auto scroll-x-clean pb-1 -mb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCat(cat)}
              className={`text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border-[1.5px] shrink-0 transition-all duration-200 ${
                activeCat === cat
                  ? 'bg-green-600 text-white border-green-600 shadow-soft'
                  : 'border-border text-ink-3 bg-white hover:border-green-200 hover:text-green-600 hover:bg-green-50'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="vh-container py-8 sm:py-10">
        {/* Header row: title left, upload + search right */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
          <SectionHeader eyebrow="Healthcare Blogs" title="Vitalize" titleAccent="Blog" />

          <div className="flex flex-col sm:flex-row sm:items-start gap-3 shrink-0 w-full sm:w-auto">
            {/* Upload button + supports text */}
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.docx,.xlsx,.txt"
              className="hidden"
              onChange={handleUpload}
            />
            <div className="flex flex-col items-start gap-1 shrink-0">
              <button style={{ width: '100%' }}
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-xs font-semibold text-white bg-green-600 hover:bg-green-700 border border-green-600 transition-colors disabled:opacity-60 disabled:cursor-not-allowed w-full sm:w-auto"
              >
                {uploading ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Parsing document…</span>
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4" />
                    <span>Upload</span>
                  </>
                )}
              </button>
              <p className="text-[10px] text-ink-4 font-medium tracking-wide">
                {/* Supports: PDF, DOCX, XLSX, TXT */}
                Supports: DOCX, TXT
              </p>
            </div>

            {/* Search */}
            <div className="relative w-full sm:w-64 shrink-0">
              <label htmlFor="blog-search" className="sr-only">Search blogs</label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40" aria-hidden="true">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="blog-search"
                value={search}
                onChange={(e) => { setSearch(e.target.value); setPage(1) }}
                placeholder="Search blogs…"
                className="bg-white border border-border rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>
        </div>

        {/* Upload error */}
        {uploadError && (
          <div
            role="alert"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 mb-6 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[11px] font-medium text-red-600">{uploadError}</p>
          </div>
        )}

        {/* Featured blog */}
        {featuredBlog && (
          <div
            className="grid grid-cols-1 md:grid-cols-2 border border-gray-100 rounded-2xl overflow-hidden mb-6 cursor-pointer hover:shadow-lg hover:border-gray-200 transition-all duration-300 group"
            onClick={() => navigate(`/blogs/${featuredBlog.id}`)}
          >
            <div
              className="relative flex flex-col justify-between min-h-[260px] overflow-hidden"
              style={{ background: featuredBlog.color }}
            >
              <div className="relative h-[160px] w-full overflow-hidden">
                <img src={featuredBlog.imageUrl} className="w-full h-full object-cover" />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full backdrop-blur-sm"
                  style={{ color: featuredBlog.textColor, background: 'rgba(255,255,255,0.9)', border: `1px solid ${featuredBlog.textColor}30` }}
                >
                  {featuredBlog.cat}
                </span>
              </div>
              <div className="flex flex-col gap-3 p-3">
                <h2 className="text-base font-semibold text-white leading-snug">{featuredBlog.title}</h2>
                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-white">{featuredBlog.authorName}</p>
                    <p className="text-[11px] text-white/60">{featuredBlog.specialist}</p>
                  </div>
                </div>
              </div>
            </div>          
          </div>
        )}



        {/* ── Blog grid / skeleton / empty ── */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden border border-gray-100 bg-white">
                <div className="h-[160px] bg-gray-100 animate-pulse" />
                <div className="p-4 space-y-2">
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-1/3" />
                  <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginated.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blogs/${blog.id}`)}
                className="group border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-300 bg-white flex flex-col"
              >
                {/* Thumbnail */}
                <div className="relative h-[160px] overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{ color: blog.textColor, background: 'rgba(255,255,255,0.9)', border: `1px solid ${blog.textColor}30` }}
                  >
                    {blog.cat}
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-col flex-1 p-4 gap-2">
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 truncate">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {blog.desc}
                  </p>

                  {/* Author + meta */}
                  <div className="border-t border-gray-100 mt-1 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0" style={{ background: blog.color }}>
                        <User size={13} style={{ color: blog.textColor }} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-700 leading-none">{blog.authorName}</p>
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5">{blog.specialist}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-gray-400"><Clock size={10} /> {blog.read}</span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400"><Calendar size={10} /> {blog.date}</span>
                    </div>
                  </div>

                  {/* Like / Comment / Share */}
                  <div className="border-t border-[#cccccc85] pt-[10px] flex items-center justify-between">
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[13px] text-black/60 hover:text-emerald-600 transition-colors"
                    >
                      <LikeButton contentType="blog" contentId={blog.id} /> Like
                       
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[13px] text-black/60 hover:text-emerald-600 transition-colors"
                    >
                      <MessageCircle className="w-4 h-4" /> Comment
                    </button>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="flex items-center gap-1 text-[13px] text-black/60 hover:text-emerald-600 transition-colors"
                    >
                      <i className="fa-solid fa-share text-[14px]" /> Share
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-md">
            No blogs found. Try a different search or category.
          </div>
        )}

        <div className="flex items-center justify-between"> 
              {/* Count label */}
        {!loading && filtered.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} articles
          </p>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-gray-300 flex items-center justify-center"
            >
              <ChevronLeft size={16} />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${p === page ? 'bg-emerald-600 text-white border-emerald-600' : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-gray-300 flex items-center justify-center"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        )}
        </div>
      </div>
    </main>
  )
}