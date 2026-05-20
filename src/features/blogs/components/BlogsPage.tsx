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


import React, { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { BLOGS } from './blogs'
import { ChevronRight, ChevronLeft, User, Clock, Calendar, ArrowRight, ThumbsUp, MessageCircle } from 'lucide-react'

const CATEGORIES = ['All', ...Array.from(new Set(BLOGS.map((b) => b.cat)))]
const PER_PAGE = 10

export function BlogsPage(): React.ReactNode {
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [page, setPage] = useState(1)

  const featuredBlog = useMemo(
    () => (!search && activeCat === 'All' ? BLOGS.find((b) => b.featured) : null),
    [search, activeCat]
  )

  const filtered = useMemo(() => {
    const q = search.toLowerCase()
    return BLOGS.filter((b) => {
      const matchCat = activeCat === 'All' || b.cat === activeCat
      const matchSearch =
        b.title.toLowerCase().includes(q) ||
        b.desc.toLowerCase().includes(q) ||
        b.cat.toLowerCase().includes(q)
      return matchCat && matchSearch
    }).filter((b) => !(featuredBlog && b.id === featuredBlog.id))
  }, [search, activeCat, featuredBlog])

  const totalPages = Math.ceil(filtered.length / PER_PAGE)
  const paginated = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  const handleCat = (cat: string) => {
    setActiveCat(cat)
    setPage(1)
  }

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value)
    setPage(1)
  }

  return (
    <>
      <section className="bg-gradient-to-br from-ink to-green-700 py-12 sm:py-16 text-white">
        <div className="vh-container text-center">
          <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-green-300">
            Healthcare Blogs
          </p>
          <h1 className="font-serif text-[clamp(28px,5vw,48px)] font-black tracking-tight text-white">
            Vitalize Blog
          </h1>
          <p className="mx-auto mt-3 max-w-xl text-sm sm:text-base text-white/70 leading-relaxed">
            Explore expert-backed healthcare articles, practical wellness guides, and science-first insights.
          </p>
          <div className="flex justify-center w-full pt-4">
            <div className="relative w-full sm:w-64 mx-auto">
              <span
                className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40"
                aria-hidden="true"
              >
                🔍
              </span>

              <input
                id="blog-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="bg-white border border-border rounded-full pl-8 pr-4 py-2 text-xs text-ink w-full outline-none focus:border-green-400 transition-colors"
              />
            </div>
          </div>
        </div>

      </section>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex gap-2 flex-wrap mb-6">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCat(cat)}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${activeCat === cat
                ? 'bg-emerald-600 text-white border-emerald-600'
                : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>

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
                <img
                  src={featuredBlog.imageUrl}
                  className="w-full h-full object-cover"
                />
                <span
                  className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-3 py-1 rounded-full backdrop-blur-sm"
                  style={{
                    color: featuredBlog.textColor,
                    background: 'rgba(255,255,255,0.9)',
                    border: `1px solid ${featuredBlog.textColor}30`,
                  }}
                >
                  {featuredBlog.cat}
                </span>
              </div>

              <div className="flex flex-col gap-3 p-3">
                <h2 className="text-base font-semibold text-white leading-snug">
                  {featuredBlog.title}
                </h2>

                <div className="flex items-center gap-2">
                  <div className="w-11 h-11 rounded-full bg-white/15 flex items-center justify-center backdrop-blur-md">
                    <User className="w-5 h-5 text-white" />
                  </div>
                  <div className=" items-center gap-1.5">
                    <p className="text-xs font-medium text-white">{featuredBlog.authorName}</p>
                    <p className="text-[11px] text-white/60">{featuredBlog.specialist}</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 bg-white flex flex-col justify-between">
              <div>
                <span className="inline-block text-[10px] font-semibold tracking-wide uppercase px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 mb-4">
                  ✦ Supplements
                </span>
                <h3 className="text-base font-semibold text-gray-900 mb-3 leading-snug group-hover:text-emerald-700 transition-colors duration-200">
                  {featuredBlog.title}
                </h3>
                <p className="text-sm text-gray-500 leading-relaxed line-clamp-3">
                  {featuredBlog.desc}
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-gray-100 flex items-center justify-between">
                <div className="flex items-center gap-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1"><Clock size={11} /> {featuredBlog.read}</span>
                  <span className="flex items-center gap-1"><Calendar size={11} /> {featuredBlog.date}</span>
                </div>
                <span className="flex items-center gap-1 text-xs font-medium text-emerald-600 group-hover:gap-2 transition-all duration-200">
                  Read <ArrowRight size={12} />
                </span>
              </div>
            </div>
          </div>
        )}

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 mb-4">
            Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
            {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} articles
          </p>
        )}
        {paginated.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {paginated.map((blog) => (
              <div
                key={blog.id}
                onClick={() => navigate(`/blogs/${blog.id}`)}
                className="group border border-gray-100 rounded-2xl overflow-hidden cursor-pointer hover:shadow-md hover:border-gray-200 transition-all duration-300 bg-white flex flex-col"
              >
                <div className="relative h-[160px] overflow-hidden">
                  <img
                    src={blog.imageUrl}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{
                      color: blog.textColor,
                      background: 'rgba(255,255,255,0.9)',
                      border: `1px solid ${blog.textColor}30`,
                    }}
                  >
                    {blog.cat}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2">

                  <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 truncate">
                    {blog.title}
                  </h3>

                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {blog.desc}
                  </p>

                  <div className="border-t border-gray-100 mt-1 pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                        style={{ background: blog.color }}
                      >
                        <User size={13} style={{ color: blog.textColor }} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-700 leading-none">
                          {blog.authorName}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5">
                          {blog.specialist}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-col items-end gap-0.5">
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Clock size={10} /> {blog.read}
                      </span>
                      <span className="flex items-center gap-1 text-[10px] text-gray-400">
                        <Calendar size={10} /> {blog.date}
                      </span>
                    </div>
                  </div>
                  <div className="border-t border-[#cccccc85] pt-[10px] flex items-center justify-between">
                    <span><a href="#" className="flex items-center gap-1 text-[14px] text-black/60"><ThumbsUp className="w-4 h-4 text-black/60" />Like</a></span>
                    <span><a href="#" className="flex items-center gap-1 text-[14px] text-black/60"><MessageCircle className="w-4 h-4 text-black/60" />Comment</a></span>
                    <span><a href="#" className="flex items-center gap-1 text-[14px] text-black/60"><i className="fa-solid fa-share text-[16px]"></i>Share</a></span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-gray-400 text-sm">
            No blogs found. Try a different search or category.
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 1}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-gray-300 text-sm"
            >
              <ChevronLeft />
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setPage(p)}
                className={`w-8 h-8 rounded-lg border text-xs font-medium transition-all ${p === page
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : 'border-gray-200 text-gray-500 hover:border-gray-300'
                  }`}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages}
              className="w-8 h-8 rounded-lg border border-gray-200 text-gray-400 disabled:opacity-30 hover:border-gray-300 text-sm"
            >
              <ChevronRight />
            </button>
          </div>
        )}
      </div>
    </>
  )
}