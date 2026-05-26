// import type { BlogSection } from './sectionTypes'
// export type { BlogSection }
// export type { SectionItem, BulletItem, ParagraphItem, TableItem } from './sectionTypes'

import type { BlogSection } from "./sectionTypes"

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
  sections?: BlogSection[]
  createdAt?: string
}