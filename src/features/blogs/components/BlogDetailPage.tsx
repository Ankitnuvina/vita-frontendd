// import React, { useMemo } from 'react'
// import { useNavigate, useParams } from 'react-router-dom'
// import { ArticleCardSkeleton } from '@/components/common/ArticleCardSkeleton'
// import { ErrorMessage } from '@/components/common/ErrorMessage'
// import { EmptyState } from '@/components/common/EmptyState'
// import { useArticles } from '@/features/articles/hooks/useArticles'
// import { getUserFriendlyMessage } from '@/lib/errors'

// function buildShareUrl(platform: 'facebook' | 'twitter' | 'linkedin', href: string): string {
//   const encodedHref = encodeURIComponent(href)
//   if (platform === 'facebook') return `https://www.facebook.com/sharer/sharer.php?u=${encodedHref}`
//   if (platform === 'twitter') return `https://twitter.com/intent/tweet?url=${encodedHref}`
//   return `https://www.linkedin.com/sharing/share-offsite/?url=${encodedHref}`
// }

// export function BlogDetailPage(): React.ReactNode {
//   const { slug } = useParams<{ slug: string }>()
//   const navigate = useNavigate()
//   const { data: articles, isLoading, isError, error, refetch } = useArticles()

//   const blog = useMemo(() => articles?.find((article) => article.slug === slug) ?? null, [articles, slug])

//   const onShare = async (platform?: 'facebook' | 'twitter' | 'linkedin') => {
//     const currentUrl = window.location.href
//     if (!platform && navigator.share && blog) {
//       await navigator.share({ title: blog.title, text: blog.excerpt, url: currentUrl })
//       return
//     }
//     if (!platform) return
//     window.open(buildShareUrl(platform, currentUrl), '_blank', 'noopener,noreferrer')
//   }

//   if (isLoading) {
//     return (
//       <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
//         <ArticleCardSkeleton count={3} />
//       </main>
//     )
//   }

//   if (isError) {
//     return (
//       <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
//         <ErrorMessage message={getUserFriendlyMessage(error)} onRetry={() => void refetch()} />
//       </main>
//     )
//   }

//   if (!blog) {
//     return (
//       <main id="main-content" className="mx-auto max-w-[1100px] px-5 py-10">
//         <EmptyState message="Blog not found." icon="📄" />
//       </main>
//     )
//   }

//   return (
//     <main id="main-content">
//       <div className="mx-auto max-w-[1100px] px-5 py-8">
//         <button
//           type="button"
//           onClick={() => navigate('/blogs')}
//           className="mb-4 rounded-full border border-border px-4 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
//         >
//           ← Back to Blogs
//         </button>

//         <div className="overflow-hidden rounded-2xl border border-border bg-white">
//           <img src={blog.imageUrl} alt={blog.title} className="h-[340px] w-full object-cover" />
//           <div className="p-6">
//             <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.1em]" style={{ color: blog.categoryColor }}>
//               {blog.categoryLabel}
//             </p>
//             <h1 className="font-serif text-[clamp(28px,4vw,42px)] font-black leading-tight text-ink">{blog.title}</h1>

//             <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-ink-4">
//               <span className="font-semibold text-ink-2">{blog.author}</span>
//               <span>•</span>
//               <span>{blog.date}</span>
//               <span>•</span>
//               <span>{blog.readTime}</span>
//             </div>

//             <p className="mt-5 text-base leading-relaxed text-ink-3">{blog.excerpt}</p>

//             <div className="mt-6 border-t border-border pt-4">
//               <p className="mb-2 text-xs font-bold uppercase tracking-[0.08em] text-ink-4">Share this blog</p>
//               <div className="flex flex-wrap gap-2">
//                 <button
//                   type="button"
//                   onClick={() => void onShare()}
//                   className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
//                 >
//                   Native Share
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => void onShare('facebook')}
//                   className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
//                 >
//                   Facebook
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => void onShare('twitter')}
//                   className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
//                 >
//                   X / Twitter
//                 </button>
//                 <button
//                   type="button"
//                   onClick={() => void onShare('linkedin')}
//                   className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ink-3 hover:border-green-300 hover:text-green-600"
//                 >
//                   LinkedIn
//                 </button>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//     </main>
//   )
// }



// import React from 'react'
// import { useParams, useNavigate } from 'react-router-dom'
// import { BLOGS } from './blog'
// import type { BlogSection } from './blog'
// import { ChevronLeft, Clock, Calendar, User, ArrowRight } from 'lucide-react'

// function renderSection(section: BlogSection, idx: number) {
//   switch (section.type) {

//     case 'keybox':
//       return (
//         <div key={idx} className="bg-[#04342C] rounded-xl p-6 mb-6">
//           <p className="text-xs font-semibold tracking-widest text-[#5DCAA5] mb-4">
//             KEY TAKEAWAYS
//           </p>
//           <ul className="space-y-3">
//             {section.items?.map((item, i) => (
//               <li key={i} className="flex gap-3 items-start">
//                 <span className="mt-1 w-4 h-4 rounded-full bg-[#1D9E75] flex items-center justify-center flex-shrink-0">
//                   <svg width="8" height="8" viewBox="0 0 8 8" fill="none">
//                     <path d="M1.5 4L3 5.5L6.5 2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
//                   </svg>
//                 </span>
//                 <span className="text-sm text-[#9FE1CB] leading-relaxed">{item}</span>
//               </li>
//             ))}
//           </ul>
//         </div>
//       )

//     case 'intro':
//       return (
//         <p key={idx} className="text-base text-gray-600 leading-relaxed mb-6 font-medium">
//           {section.text}
//         </p>
//       )

//     case 'heading':
//       return (
//         <h2 key={idx} className="text-xl font-medium text-gray-900 mt-8 mb-3">
//           {section.text}
//         </h2>
//       )

//     case 'para':
//       return (
//         <p key={idx} className="text-sm text-gray-600 leading-relaxed mb-4">
//           {section.text}
//         </p>
//       )

//     case 'list':
//       return (
//         <ul key={idx} className="space-y-3 mb-6">
//           {section.items?.map((item, i) => {
//             const [bold, ...rest] = item.split(' — ')
//             return (
//               <li key={i} className="flex gap-3 items-start">
//                 <span className="mt-2 w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0" />
//                 <span className="text-sm text-gray-600 leading-relaxed">
//                   {rest.length > 0 ? (
//                     <><span className="font-medium text-gray-900">{bold} — </span>{rest.join(' — ')}</>
//                   ) : item}
//                 </span>
//               </li>
//             )
//           })}
//         </ul>
//       )

//     case 'table':
//       return (
//         <div key={idx} className="border border-gray-100 rounded-xl overflow-hidden mb-6">
//           <table className="w-full text-sm">
//             <tbody>
//               {section.rows?.map((row, i) => (
//                 <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
//                   <td className="px-4 py-3 text-gray-900 font-medium w-1/2">{row.label}</td>
//                   <td className="px-4 py-3 text-emerald-700 font-medium">{row.value}</td>
//                   <td className="px-4 py-3 text-right">
//                     <span className={`text-xs px-2 py-0.5 rounded-full ${row.note === 'Must-do' ? 'bg-emerald-50 text-emerald-700' :
//                       row.note === 'High priority' ? 'bg-blue-50 text-blue-700' :
//                         row.note?.includes('toxic') ? 'bg-red-50 text-red-700' :
//                           'bg-gray-100 text-gray-600'
//                       }`}>
//                       {row.note}
//                     </span>
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )

//     case 'tip':
//       return (
//         <div key={idx} className="flex gap-3 bg-amber-50 border border-amber-100 rounded-xl p-4 mb-6">
//           <span className="text-amber-500 text-lg flex-shrink-0">💡</span>
//           <p className="text-sm text-amber-900 leading-relaxed">{section.text}</p>
//         </div>
//       )

//     default:
//       return null
//   }
// }

// export function BlogDetailPage(): React.ReactNode {
//   const { id } = useParams<{ id: string }>()
//   const navigate = useNavigate()
//   const blog = BLOGS.find((b) => b.id === Number(id))

//   // 404 — blog nahi mila
//   if (!blog) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
//         <p className="text-5xl mb-4">🌿</p>
//         <h1 className="text-2xl font-medium text-gray-900 mb-2">Blog not found</h1>
//         <p className="text-sm text-gray-500 mb-6">
//           This article doesn't exist or may have been moved.
//         </p>
//         <button
//           onClick={() => navigate('/blogs')}
//           className="text-sm text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
//         >
//           Back to all blogs
//         </button>
//       </div>
//     )
//   }

//   // Content nahi hai abhi tak
//   if (!blog.content || blog.content.length === 0) {
//     return (
//       <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
//         <p className="text-5xl mb-4">✍️</p>
//         <h1 className="text-2xl font-medium text-gray-900 mb-2">Coming soon</h1>
//         <p className="text-sm text-gray-500 mb-6">
//           This article is being written. Check back soon!
//         </p>
//         <button
//           onClick={() => navigate('/blogs')}
//           className="text-sm text-emerald-600 border border-emerald-200 px-4 py-2 rounded-lg hover:bg-emerald-50 transition-colors"
//         >
//           Back to all blogs
//         </button>
//       </div>
//     )
//   }

//   const relatedBlogs = BLOGS.filter(
//     (b) => b.id !== blog.id && (b.cat === blog.cat || b.featured)
//   ).slice(0, 3)

//   return (
//     <>
//       {/* Hero */}
//       <section
//         className="py-12 sm:py-16"
//       >
//         <div className="max-w-3xl mx-auto px-4">
//           <button
//             onClick={() => navigate('/blogs')}
//             className="flex items-center gap-1 text-xs mb-6 opacity-70 hover:opacity-100 transition-opacity"

//           >
//             <ChevronLeft size={14} /> Back
//           </button>
//           <span
//             className="inline-block text-xl font-semibold tracking-widest px-3 py-1 rounded-full mb-4"
//           >
//             {blog.cat}
//           </span>
//           <h1
//             className="text-3xl sm:text-4xl font-medium leading-snug mb-4"
//             style={{ color: blog.color === '#04342C' ? '#E1F5EE' : '#1a1a1a' }}
//           >
//             {blog.title}
//           </h1>
//           <p
//             className="text-sm leading-relaxed mb-6 max-w-xl opacity-80"
//             style={{ color: blog.color === '#04342C' ? '#9FE1CB' : '#444' }}
//           >
//             {blog.desc}
//           </p>
//           <div className="flex gap-4 text-xs opacity-70" style={{ color: blog.textColor }}>
//             <span className="flex items-center gap-1"><Clock size={12} /> {blog.read}</span>
//             <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
//             <span className="flex items-center gap-1"><User size={12} /> Reviewed by MSc Nutrition</span>
//           </div>
//         </div>
//       </section>

//       {/* Article body */}
//       <div className="max-w-3xl mx-auto px-4 py-10">
//         {blog.content.map((section, idx) => renderSection(section, idx))}

//         {/* Related blogs */}
//         {relatedBlogs.length > 0 && (
//           <div className="mt-12 pt-8 border-t border-gray-100">
//             <h3 className="text-base font-medium text-gray-900 mb-4">Related articles</h3>
//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               {relatedBlogs.map((b) => (
//                 <div
//                   key={b.id}
//                   onClick={() => navigate(`/blogs/${b.id}`)}
//                   className="border border-gray-100 rounded-xl overflow-hidden cursor-pointer hover:border-gray-200 transition-colors"
//                 >
//                   <div className="h-16 flex items-end px-3 py-2" style={{ background: b.color }}>
//                     <span className="text-[9px] font-semibold tracking-widest" style={{ color: b.textColor }}>
//                       {b.cat.toUpperCase()}
//                     </span>
//                   </div>
//                   <div className="p-3">
//                     <p className="text-xs font-medium text-gray-900 leading-snug mb-1">{b.title}</p>
//                     <span className="flex items-center gap-1 text-[11px] text-emerald-600 font-medium mt-2">
//                       Read <ArrowRight size={10} />
//                     </span>
//                   </div>
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     </>
//   )
// }


import React, { useEffect, useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { fetchBlogById } from './blog'
import type { Blog } from './blogs'
import { ChevronLeft, Clock, Calendar, User,  } from 'lucide-react'

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

  // ── Loading skeleton ──
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

  // ── 404 ──
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

  // ── No content yet ──
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

  // ── Full article ──
  return (
    <>
      {/* Hero */}
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
          <div className="flex items-center gap-3 mb-4">
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
          </div>

          <div className="flex gap-4 text-xs text-black/60">
            <span className="flex items-center gap-1"><Clock size={12} /> {blog.read}</span>
            <span className="flex items-center gap-1"><Calendar size={12} /> {blog.date}</span>
          </div>
        </div>
      </section>

      {/* Article body */}
      <div className="max-w-3xl mx-auto px-4 py-10">

        {/* Cover image */}
        {blog.imageUrl && (
          <img
            src={blog.imageUrl}
            className="w-full h-[260px] object-cover rounded-2xl mb-8"
          />
        )}

        {/* Sections */}
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