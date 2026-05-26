import React, { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import type { Blog } from './blogs'
import { fetchBlogs } from './blog'
import { SectionHeader } from '@/components/common/SectionHeader'
import { ChevronRight, ChevronLeft, User, Clock, Calendar, MessageCircle, Search } from 'lucide-react'
import { LikeButton } from '@/features/likes/components/common/LikeButton'

const PER_PAGE = 10
const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'
const getImageUrl = (imageUrl: string) => imageUrl ? `${API}${imageUrl}` : 'https://vitalizemed.com/cdn/shop/files/Vitalize-R-logo_1.png?height=628&pad_color=ffffff&v=1702443605&width=1200'

export function BlogsPage(): React.ReactNode {
  const navigate = useNavigate()

  const [blogs, setBlogs] = useState<Blog[]>([])
  const [loading, setLoading] = useState(true)
  // const [uploading, setUploading] = useState(false)
  // const [uploadError, setUploadError] = useState<string | null>(null)
  const [search, setSearch] = useState('')
  const [activeCat, setActiveCat] = useState('All')
  const [page, setPage] = useState(1)
  // const fileInputRef = useRef<HTMLInputElement>(null)

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

  // const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if (!file) return
  //   setUploading(true)
  //   setUploadError(null)
  //   const formData = new FormData()
  //   formData.append('document', file)
  //   formData.append('cat', 'General')
  //   formData.append('authorName', 'Vitalize Team')
  //   formData.append('specialist', 'Health Writer')
  //   try {
  //     const newBlog = await uploadBlogDocument(formData)
  //     setBlogs((prev) => [newBlog, ...prev])
  //   } catch (err) {
  //     setUploadError(err instanceof Error ? err.message : 'Upload failed')
  //   } finally {
  //     setUploading(false)
  //     if (fileInputRef.current) fileInputRef.current.value = ''
  //   }
  // }

  return (
    <main id="main-content">
      <div className="bg-white/95 backdrop-blur-md border-b border-border py-3 sticky top-14 sm:top-16 z-[98]">
        <div className="vh-container flex justify-center gap-2 overflow-x-auto scroll-x-clean pb-1 -mb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => handleCat(cat)}
              className={`text-[11px] sm:text-xs font-semibold px-3 sm:px-4 py-1.5 rounded-full border-[1.5px] shrink-0 transition-all duration-200 ${activeCat === cat
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

        {/* <div className="flex flex-col sm:flex-row sm:items-start gap-3 shrink-0 w-full sm:w-auto">
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
                Supports: PDF, DOCX, TXT
              </p>
            </div>

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
          </div> */}


        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between mb-6 gap-4">
          <SectionHeader eyebrow="Healthcare Blogs" title="Vitalize" titleAccent="Blog" />
          <div className="relative w-full sm:w-64 shrink-0">
            <label htmlFor="article-search" className="sr-only"> Search blogs</label>
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm opacity-40" aria-hidden="true">
              <Search className='w-4 h-4' />
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

        {/* {uploadError && (
          <div
            role="alert"
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-50 border border-red-200 mb-6 w-fit"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
            <p className="text-[11px] font-medium text-red-600">{uploadError}</p>
          </div>
        )} */}

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
                  <h3 className="text-sm font-semibold text-gray-900 leading-snug group-hover:text-emerald-700 transition-colors duration-200 truncate">
                    {blog.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 flex-1">
                    {blog.desc}
                  </p>

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
    </main>
  )
}