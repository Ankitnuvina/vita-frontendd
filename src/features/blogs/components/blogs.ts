export interface Blog {
  id: number
  title: string
  desc: string
  cat: string
  read: string
  date: string
  featured: boolean
  color: string
  textColor: string
  authorName: string      // ← add
  specialist: string      // ← add
  imageUrl: string        // ← add
  sections?: Array<{ heading: string; items: string[] }>  // ← add
  createdAt?: string      // ← add
}