import React, { useRef, useState } from 'react'
import { uploadBlogDocument } from '@/features/blogs/components/blog'
import type { Blog } from '@/features/blogs/components/blogs'
import { Upload, FileText, CheckCircle2, AlertCircle, X, FileImage, File } from 'lucide-react'
import { useToastStore } from '@/store/toast.store'

// ── File type helper ──────────────────────────────────────────────────────────
function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return <File className="w-5 h-5 text-red-500" />
  if (ext === 'docx') return <FileText className="w-5 h-5 text-blue-500" />
  if (ext === 'txt') return <FileText className="w-5 h-5 text-gray-500" />
  return <FileImage className="w-5 h-5 text-purple-500" />
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function AdminUploadsBlogsPage(): React.ReactNode {
  const [uploading, setUploading] = useState(false)
  const [uploadError, setUploadError] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [createdBlogs, setCreatedBlogs] = useState<Blog[]>([])
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const addToast = useToastStore((s) => s.addToast)

  const uploadSuccess = createdBlogs.length > 0

  const processFile = async (file: File) => {
    setSelectedFile(file)
    setUploadError(null)
    setCreatedBlogs([])
    setUploading(true)

    const formData = new FormData()
    formData.append('document', file)
    formData.append('cat', 'General')
    formData.append('authorName', 'Vitalize Team')
    formData.append('specialist', 'Health Writer')

    try {
      const blogs = await uploadBlogDocument(formData) // Blog[]
      setCreatedBlogs(blogs)
      addToast({
        type: 'success',
        message:
          blogs.length === 1
            ? `"${blogs[0].title}" uploaded successfully`
            : `${blogs.length} blogs uploaded successfully from "${file.name}"`,
      })
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Upload failed'
      setUploadError(msg)
      addToast({ type: 'error', message: msg })
    } finally {
      setUploading(false)
      if (fileInputRef.current) fileInputRef.current.value = ''
    }
  }

  const handleInputChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) await processFile(file)
  }

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    if (file) await processFile(file)
  }

  const handleReset = () => {
    setSelectedFile(null)
    setUploadError(null)
    setCreatedBlogs([])
  }

  return (
    <div className="max-w-2xl mx-auto py-10 px-4">

      {/* Page header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-ink">Upload Blog</h1>
        <p className="text-sm text-ink-3 mt-1">
          Upload a document to automatically parse and publish it as one or more blog posts.
        </p>
      </div>

      {/* Drop zone */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true) }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        onClick={() => !uploading && fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-10 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200 ${isDragging
            ? 'border-green-500 bg-green-50 scale-[1.01]'
            : uploadSuccess
              ? 'border-green-400 bg-green-50/50'
              : uploadError
                ? 'border-red-300 bg-red-50/50'
                : 'border-border bg-paper hover:border-green-400 hover:bg-green-50/30'
          } ${uploading ? 'pointer-events-none' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,.docx,.txt"
          className="hidden"
          onChange={handleInputChange}
        />

        {/* Icon */}
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-4 transition-colors ${uploadSuccess ? 'bg-green-100' : uploadError ? 'bg-red-100' : 'bg-white border border-border shadow-soft'
          }`}>
          {uploading ? (
            <span className="w-7 h-7 border-[3px] border-green-200 border-t-green-600 rounded-full animate-spin" />
          ) : uploadSuccess ? (
            <CheckCircle2 className="w-8 h-8 text-green-600" />
          ) : uploadError ? (
            <AlertCircle className="w-8 h-8 text-red-500" />
          ) : (
            <Upload className="w-7 h-7 text-ink-3" />
          )}
        </div>

        {/* Status text */}
        {uploading ? (
          <>
            <p className="text-sm font-semibold text-ink mb-1">Parsing document…</p>
            <p className="text-xs text-ink-3">Extracting blogs, please wait</p>
          </>
        ) : uploadSuccess ? (
          <>
            <p className="text-sm font-semibold text-green-700 mb-1">
              {createdBlogs.length === 1
                ? 'Blog uploaded successfully!'
                : `${createdBlogs.length} blogs uploaded successfully!`}
            </p>
            <p className="text-xs text-ink-3">
              {createdBlogs.length === 1
                ? 'Blog is now live'
                : 'All blogs are now live'}
            </p>
          </>
        ) : uploadError ? (
          <>
            <p className="text-sm font-semibold text-red-600 mb-1">Upload failed</p>
            <p className="text-xs text-red-400">{uploadError}</p>
          </>
        ) : (
          <>
            <p className="text-sm font-semibold text-ink mb-1">
              Drop your file here, or <span className="text-green-600">browse</span>
            </p>
            <p className="text-xs text-ink-3">Supports PDF, DOCX, TXT · Multiple blogs per file</p>
          </>
        )}
      </div>

      {/* Selected file preview */}
      {selectedFile && (
        <div className={`mt-4 flex items-center gap-3 px-4 py-3 rounded-xl border transition-colors ${uploadSuccess
            ? 'bg-green-50 border-green-200'
            : uploadError
              ? 'bg-red-50 border-red-200'
              : 'bg-paper border-border'
          }`}>
          <div className="w-10 h-10 rounded-lg bg-white border border-border flex items-center justify-center flex-shrink-0">
            {getFileIcon(selectedFile.name)}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[13px] font-semibold text-ink truncate">{selectedFile.name}</p>
            <p className="text-[11px] text-ink-3">{formatBytes(selectedFile.size)}</p>
          </div>
          {/* Status badge */}
          {uploading && (
            <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full">
              Processing…
            </span>
          )}
          {uploadSuccess && (
            <span className="text-[11px] font-semibold text-green-600 bg-green-50 border border-green-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {createdBlogs.length === 1 ? 'Done' : `${createdBlogs.length} blogs`}
            </span>
          )}
          {uploadError && (
            <span className="text-[11px] font-semibold text-red-500 bg-red-50 border border-red-200 px-2.5 py-1 rounded-full flex items-center gap-1">
              <AlertCircle className="w-3 h-3" /> Failed
            </span>
          )}
          {/* Reset */}
          {!uploading && (
            <button
              onClick={(e) => { e.stopPropagation(); handleReset() }}
              className="w-7 h-7 rounded-lg flex items-center justify-center text-ink-4 hover:bg-border hover:text-ink transition-colors flex-shrink-0"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      )}

      {/* Created blogs list — shown after successful multi-blog upload */}
      {uploadSuccess && createdBlogs.length > 1 && (
        <div className="mt-4 rounded-xl border border-green-200 bg-green-50/50 overflow-hidden">
          <p className="text-[11px] font-bold text-green-700 tracking-wide uppercase px-4 pt-3 pb-2">
            Blogs created
          </p>
          <ul className="divide-y divide-green-100">
            {createdBlogs.map((blog, i) => (
              <li key={blog.id} className="flex items-center gap-3 px-4 py-2.5">
                <span className="w-5 h-5 rounded-full bg-green-600 text-white text-[10px] font-bold flex items-center justify-center flex-shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-ink truncate">{blog.title}</p>
                  <p className="text-[10px] text-ink-3">{blog.authorName} · {blog.read} · {blog.cat}</p>
                </div>
                <CheckCircle2 className="w-4 h-4 text-green-500 flex-shrink-0" />
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Upload another button */}
      {uploadSuccess && (
        <button
          onClick={handleReset}
          className="bg-green-500 mt-4 w-full py-2.5 rounded-xl border border-green-300 text-white text-md font-semibold"
        >
          Upload another document
        </button>
      )}

      {/* Format guide */}
      <div className="mt-6 grid grid-cols-3 gap-3">
        {[
          { icon: '📄', label: 'PDF', desc: 'Exported reports & guides' },
          { icon: '📝', label: 'DOCX', desc: 'Word docs — multiple blogs per file' },
          { icon: '🗒️', label: 'TXT', desc: 'Plain text articles' },
        ].map((f) => (
          <div key={f.label} className="flex flex-col items-center text-center p-3 rounded-xl bg-paper border border-border">
            <span className="text-2xl mb-1.5">{f.icon}</span>
            <p className="text-[12px] font-bold text-ink">{f.label}</p>
            <p className="text-[10px] text-ink-3 leading-snug mt-0.5">{f.desc}</p>
          </div>
        ))}
      </div>

    </div>
  )
}
