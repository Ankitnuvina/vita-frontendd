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
  authorName: string 
  specialist: string
  imageUrl: string 
  sections?: Array<{ heading: string; items: string[] }> 
  createdAt?: string
}