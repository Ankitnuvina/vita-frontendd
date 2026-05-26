import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById } from './blog'
import type { Blog } from './blogs'
// import type { SectionItem } from './sectionTypes'
// import type { SectionItem } from './sectionTypes'
import type { SectionItem } from './sectionTypes'
import { ChevronLeft, Clock, Calendar, User } from 'lucide-react'

const API = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'

function RenderItem({ item }: { item: SectionItem }) {
  if (item.type === 'bullet') {
    return (
      <li className="flex gap-3 items-start">
        <span className="mt-[7px] w-1.5 h-1.5 rounded-full flex-shrink-0 bg-emerald-500" />
        <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
      </li>
    )
  }

  if (item.type === 'paragraph') {
    return (
      <p className="text-sm text-gray-600 leading-relaxed">{item.text}</p>
    )
  }

  if (item.type === 'heading') {
    const sizeByLevel: Record<number, string> = {
      2: 'text-lg sm:text-xl',
      3: 'text-base sm:text-lg',
      4: 'text-sm sm:text-base',
      5: 'text-sm',
      6: 'text-xs',
    }
    const cls = sizeByLevel[item.level] ?? 'text-base'
    return (
      <h3 className={`${cls} font-semibold text-gray-900 mt-3 mb-1`}>
        {item.text}
      </h3>
    )
  }

  if (item.type === 'table') {
    return (
      <div className="overflow-x-auto rounded-xl border border-gray-100 my-2">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="bg-emerald-50">
              {item.headers.map((h, i) => (
                <th
                  key={i}
                  className="text-left px-4 py-2.5 text-xs font-semibold text-emerald-800 border-b border-gray-200 whitespace-nowrap"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {item.rows.map((row, ri) => (
              <tr key={ri} className={ri % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                {row.map((cell, ci) => (
                  <td key={ci} className="px-4 py-2.5 text-gray-600 border-b border-gray-100 text-sm">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    )
  }

  return null
}

function RenderSection({ items }: { items: SectionItem[] }) {
  const blocks: React.ReactNode[] = []
  let bulletBuffer: SectionItem[] = []
  let key = 0

  const flushBullets = () => {
    if (bulletBuffer.length === 0) return
    blocks.push(
      <ul key={key++} className="space-y-2 my-1">
        {bulletBuffer.map((item, i) => (
          <RenderItem key={i} item={item} />
        ))}
      </ul>
    )
    bulletBuffer = []
  }

  for (const item of items) {
    if (item.type === 'bullet') {
      bulletBuffer.push(item)
    } else {
      flushBullets()
      blocks.push(<RenderItem key={key++} item={item} />)
    }
  }
  flushBullets()

  return <div className="space-y-3">{blocks}</div>
}

function Skeleton() {
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

  if (loading) return <Skeleton />

  if (error || !blog) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
        <p className="text-5xl mb-4">🌿</p>
        <h1 className="text-2xl font-medium text-gray-900 mb-2">Blog not found</h1>
        <p className="text-sm text-gray-500 mb-6">This article does not exist or may have been moved.</p>
        <button
          onClick={() => navigate('/blogs')}
          className="text-sm text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
        >
          Back to all blogs
        </button>
      </div>
    )
  }

  const heroSection = (
    <section className="py-12 sm:py-16" style={{ background: blog.color }}>
      <div className="max-w-3xl mx-auto px-4">
        <button
          onClick={() => navigate('/blogs')}
          className="flex items-center gap-1.5 text-xs mb-6 opacity-70 hover:opacity-100 transition-opacity"
          style={{ color: blog.textColor }}
        >
          <ChevronLeft size={14} /> Back to blogs
        </button>

        <span
          className="inline-block text-xs font-semibold tracking-widest px-3 py-1 rounded-full mb-4"
          style={{ background: 'rgba(255,255,255,0.18)', color: blog.textColor }}
        >
          {blog.cat.toUpperCase()}
        </span>

        <h1 className="text-3xl sm:text-4xl font-semibold leading-snug mb-3 text-gray-900">
          {blog.title}
        </h1>

        {blog.desc && (
          <p className="text-sm leading-relaxed mb-6 max-w-xl text-gray-600 opacity-80">
            {blog.desc}
          </p>
        )}

        <div className="flex items-center gap-3">
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0"
            style={{ background: 'rgba(35,180,100,0.15)' }}
          >
            <User size={16} className="text-gray-700" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-800">{blog.authorName}</p>
            <p className="text-xs text-gray-500">{blog.specialist}</p>
          </div>
          <div className="flex flex-col gap-0.5 ml-4 text-xs text-gray-500">
            <span className="flex items-center gap-1"><Clock size={11} /> {blog.read}</span>
            <span className="flex items-center gap-1"><Calendar size={11} /> {blog.date}</span>
          </div>
        </div>
      </div>
    </section>
  )

  if (!blog.sections || blog.sections.length === 0) {
    return <>{heroSection}</>
  }

  return (
    <>
      {heroSection}

      <div className="max-w-3xl mx-auto px-4 py-10">
        {blog.imageUrl && (
          <img
            src={`${API}${blog.imageUrl}`}
            alt={blog.title}
            className="w-full h-[260px] object-cover rounded-2xl mb-10 shadow-sm"
          />
        )}

        {blog.sections.map((section, idx) => {
          const isAutoOverview = section.heading === 'Overview'
          const matchesTitle =
            section.heading.trim().toLowerCase() === blog.title.trim().toLowerCase()
          const hideHeading = isAutoOverview || matchesTitle
          return (
            <div key={idx} className="mb-10">
              {!hideHeading && (
                <h2 className="text-xl font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
                  {section.heading}
                </h2>
              )}
              <RenderSection items={section.items} />
            </div>
          )
        })}
      </div>
    </>
  )
}