import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById } from './blog'
import type { Blog } from './blogs'
import { ChevronLeft, Clock, Calendar, User, } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'

export function BlogDetailPage(): React.ReactNode {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()

  const [blog, setBlog] = useState<Blog | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    fetchBlogById(Number(id))
      .then(setBlog)
      .catch(() => setError(true))
      .finally(() => setLoading(false))
  }, [id])

  if (loading) {
    return (
      <>
        <div className="h-[280px] bg-gray-100 animate-pulse" />
        <div className="max-w-3xl mx-auto px-4 py-10 space-y-4">
          <div className="h-4 bg-gray-100 rounded animate-pulse w-1/4" />
          <div className="h-6 bg-gray-100 rounded animate-pulse w-3/4" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-full" />
          <div className="h-4 bg-gray-100 rounded animate-pulse w-2/3" />
        </div>
      </>
    )
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🌿</p>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Blog not found</h1>
        <p className="text-sm text-gray-500 mb-6">
          This article does not exist or may have been moved.
        </p>
        <button
          onClick={() => navigate('/blogs')}
          className="text-sm text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Back to all blogs
        </button>
      </div>
    )
  }

  if (!blog.sections || blog.sections.length === 0) {
    return (
      <>
        {/* Hero */}
        <section className="py-12 sm:py-16" style={{ background: blog.color }}>
          <div className="max-w-3xl mx-auto px-4">
            <button
              onClick={() => navigate('/blogs')}
              className="flex items-center gap-1 text-xs mb-6 opacity-70 hover:opacity-100 transition-opacity"
              style={{ color: blog.textColor }}
            >
              <ChevronLeft size={14} /> Back to blogs
            </button>
            <span
              className="inline-block text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-4"
              style={{ background: 'rgba(255,255,255,0.15)', color: blog.textColor }}
            >
              {blog.cat.toUpperCase()}
            </span>
            <h1
              className="text-3xl sm:text-4xl font-medium leading-snug mb-4 text-white"
            >
              {blog.title}
            </h1>
            <p className="text-sm leading-relaxed mb-6 max-w-xl opacity-80 text-white/70">
              {blog.desc}
            </p>
            <div className="flex gap-4 text-xs text-white/60">
              <span className="flex items-center gap-1"><Clock size={12} /> {blog.read}</span>
              <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
              <span className="flex items-center gap-1"><User size={12} /> {blog.authorName}</span>
            </div>
          </div>
        </section>

        <div className="min-h-[40vh] flex flex-col items-center justify-center text-center px-4">
          <p className="text-4xl mb-4">✍️</p>
          <h2 className="text-xl font-medium text-gray-900 mb-2">Full article coming soon</h2>
          <p className="text-sm text-gray-500 mb-6">
            This blog was uploaded as a document. Full content will appear here shortly.
          </p>
          <button
            onClick={() => navigate('/blogs')}
            className="text-sm text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Back to all blogs
          </button>
        </div>
      </>
    )
  }

  return (
    <>
      <section className="py-12 sm:py-16" style={{ background: blog.color }}>
        <div className="max-w-3xl mx-auto px-4">
          <span
            className="inline-block text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-4"
            style={{ background: 'rgba(255,255,255,0.15)', color: blog.textColor }}
          >
            {blog.cat.toUpperCase()}
          </span>

          <h1
            className="text-3xl sm:text-4xl font-medium leading-snug mb-4"
            style={{ color: blog.color === '#04342C' ? '#E1F5EE' : '#1a1a1a' }}
          >
            {blog.title}
          </h1>

          <p
            className="text-sm leading-relaxed mb-6 max-w-xl opacity-80"
            style={{ color: blog.color === '#04342C' ? '#9FE1CB' : '#555' }}
          >
            {blog.desc}
          </p>

          {/* Author + meta */}
          <div className="flex items-center gap-3 mb-4 ">
            <div
              className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
              style={{ background: 'rgba(35, 180, 100, 0.15)' }}
            >
              <User size={16} className="text-black" />
            </div>
            <div>
              <p className="text-sm font-medium text-black">{blog.authorName}</p>
              <p className="text-xs text-black/60">{blog.specialist}</p>
            </div>

             <div className="flex gap-0 text-xs text-black/60 flex-col ml-4">
            <span className="flex items-center gap-1"><Clock size={12} /> {blog.read}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
          </div>

          </div>

         
        </div>
      </section>

      <div className="max-w-3xl mx-auto px-4 py-10">

        {blog.imageUrl && (
          <img
            src={`${API}${blog.imageUrl}`}
            className="w-full h-[260px] object-cover rounded-2xl mb-8"
          />
        )}

        {blog.sections.map((section, idx) => (
          <div key={idx} className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
              {section.heading}
            </h2>
            <ul className="space-y-3">
              {section.items.map((item, i) => (
                <li key={i} className="flex gap-3 items-start">
                  <span
                    className="mt-2 w-1.5 h-1.5 rounded-full flex-shrink-0 bg-green-500"
                  />
                  <p className="text-sm text-gray-600 leading-relaxed">{item}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </>
  )
}