import type { Blog } from './blogs' 
const BASE = `${import.meta.env.VITE_API_BASE_URL || 'http://localhost:3005'}/api`

export async function fetchBlogs(): Promise<Blog[]> {
  const res = await fetch(`${BASE}/blogs`)       
  if (!res.ok) throw new Error('Failed to fetch blogs')
  return res.json()
}

export async function uploadBlogDocument(formData: FormData): Promise<Blog> {
  const res = await fetch(`${BASE}/blogs/upload`, 
    {
      method: 'POST',
      body: formData,
    }
  )
  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error((err as { error?: string }).error || 'Upload failed')
  }
  return res.json()
}

export async function fetchBlogById(id: number): Promise<Blog> {
  const res = await fetch(`${BASE}/blogs/${id}`)
  if (!res.ok) throw new Error('Blog not found')
  return res.json()
}