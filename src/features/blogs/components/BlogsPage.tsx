import React, { useState, useMemo, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Blog } from './blogs'
import { fetchBlogs } from './blog'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ChevronRight, ChevronLeft, User, Clock, Calendar, Search, Send, Filter, ChevronDown } from 'lucide-react'
import { LikeButton } from '@/features/likes/components/common/LikeButton'
import { CommentButton } from '@/features/comments/components/CommentButton'
import { CommentModal } from '@/features/comments/components/CommentModal'

const PER_PAGE = 10
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'
const getImageUrl = (imageUrl: string) => imageUrl ? `${API}${imageUrl}` : 'https://vitalizemed.com/cdn/shop/files/Vitalize-R-logo_1.png?height=628&pad_color=ffffff&v=1702443605&width=1200'

export function BlogsPage(): React.ReactNode {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [page, setPage] = useState(1)

  useEffect(() => {
    fetchBlogs()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setLoading(false))
  }, [])

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

  const handleCat = (cat: string) => { setActiveCat(cat); setPage(1) }


  const [openComments, setOpenComments] = useState(false)
  const [selectedBlogId, setSelectedBlogId] = useState<string | number | null>(null)

  const [showCategories, setShowCategories] = useState(false)
  const filterRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        filterRef.current &&
        !filterRef.current.contains(event.target as Node)
      ) {
        setShowCategories(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <main id="main-content">
      <div className="vh-container py-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-8 gap-4">
          <SectionHeader
            eyebrow="Healthcare Blogs"
            title="Vitalize"
            titleAccent="Blog"
          />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <label htmlFor="article-search" className="sr-only">
                Search blogs
              </label>
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                <Search className="w-4 h-4" />
              </span>
              <input
                id="blog-search"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search blogs..."
                className="w-full bg-white border border-slate-200 rounded-xl pl-10 pr-4 py-2.5 text-sm outline-none shadow-sm transition-all focus:border-green-500 focus:ring-4
                focus:ring-green-100"/>
            </div>
            <div ref={filterRef} className="relative">
              <button
                onClick={() => setShowCategories(!showCategories)}
                className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl shadow-sm hover:border-green-300 hover:bg-green-50 transition-all">
                <Filter className="w-4 h-4" />
                <span className="text-sm font-medium">
                  {activeCat}
                </span>
                <ChevronDown
                  className={`w-4 h-4 transition-transform duration-200 ${showCategories ? 'rotate-180' : ''
                    }`}
                />
              </button>

              {showCategories && (
                <div
                  className="absolute right-0 mt-2 w-56 bg-white border border-slate-200 rounded-2xl shadow-xl overflow-hidden z-50">
                  <div className="px-4 py-3 border-b bg-slate-50">
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
                      Categories
                    </p>
                  </div>
                  {CATEGORIES.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        handleCat(cat)
                        setShowCategories(false)
                      }}
                      className={`
                  w-full
                  flex items-center justify-between
                  px-4 py-3
                  text-sm
                  transition-colors
                  text-green-500 font-semibold
                 ${activeCat === cat
                        ? 'text-green-500 font-semibold'
                        : 'hover:bg-slate-50 text-slate-700'
                        }
              `}>
                      <span>{cat}</span>
                      {activeCat === cat && (
                        <span className="w-2 h-2 rounded-full bg-green-500 " />
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
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

                <div className="relative h-[160px] overflow-hidden bg-gray-100">
                  {blog.imageUrl ? (
                    <img
                      src={getImageUrl(blog.imageUrl)}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div
                      className="w-full h-full flex items-center justify-center"
                      style={{ background: `linear-gradient(135deg, ${blog.color}99, ${blog.color})` }}
                    >
                      <img
                        src={getImageUrl(blog.imageUrl)}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                  <span
                    className="absolute top-3 left-3 text-[10px] font-bold tracking-[0.12em] uppercase px-2.5 py-1 rounded-full backdrop-blur-sm"
                    style={{ color: blog.textColor, background: 'rgba(255,255,255,0.9)', border: `1px solid ${blog.textColor}30` }}
                  >
                    {blog.cat}
                  </span>
                </div>

                <div className="flex flex-col flex-1 p-4 gap-2">
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 line-clamp-2 flex-1">
                      {blog.title}
                    </h3>
                    <div className="flex items-center gap-3 shrink-0 pt-0.5" onClick={(e) => e.stopPropagation()}>
                      <LikeButton contentType="blog" contentId={blog.id} />
                      <CommentButton
                        contentType="blog"
                        contentId={blog.id}
                        onClick={() => {
                          setSelectedBlogId(blog.id)
                          setOpenComments(true)
                        }}
                      />
                      <button className="flex items-center text-gray-400 hover:text-emerald-600 transition-colors">
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                    {blog.desc}
                  </p>
                  <div className="border-t border-gray-100 mt-auto pt-3 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{ background: blog.color }}
                      >
                        <User size={12} style={{ color: blog.textColor }} />
                      </div>
                      <div>
                        <p className="text-[11px] font-medium text-gray-700 leading-none truncate max-w-[140px]">
                          {blog.authorName}
                        </p>
                        <p className="text-[10px] text-gray-400 leading-none mt-0.5 truncate max-w-[140px]">
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
          {!loading && filtered.length > 0 && (
            <p className="text-xs text-gray-400 mb-4">
              Showing {Math.min((page - 1) * PER_PAGE + 1, filtered.length)}–
              {Math.min(page * PER_PAGE, filtered.length)} of {filtered.length} articles
            </p>
          )}

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

      {openComments && selectedBlogId && (
        <div
          className="border-t border-border bg-neutral-50 p-4"
          onClick={(e) => e.stopPropagation()}
        >
          <CommentModal
            contentType="blog"
            contentId={selectedBlogId}
            total={0}
            onClose={() => {
              setOpenComments(false)
              setSelectedBlogId(null)
            }}
          />
        </div>
      )}
    </main>
  )
}