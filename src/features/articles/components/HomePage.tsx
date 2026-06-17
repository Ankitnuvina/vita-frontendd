import React, { useEffect, useRef, useState } from 'react'
import './HomeePage.css'
import { LoginDialog } from '@/features/auth/components/LoginDialog'
import { usePodcasts } from '@/features/podcasts/hooks/usePodcasts'
import { useExperts } from '@/features/experts/hooks/useExperts'
import { useAuthStore } from '@/store/auth.store'
import { TypeAnimation } from "react-type-animation";

/* ============================================================
   STATIC DATA
   ============================================================ */

const TICKER_ITEMS = [
  'Drink 500ml water before coffee — boosts metabolism by 30%',
  '10 min morning sun resets your circadian rhythm better than supplements',
  'Walk 10 min after meals — lowers blood glucose by 22%',
  'Magnesium glycinate 200mg before bed deepens sleep architecture measurably',
  'Box breathing 4-4-4-4 activates parasympathetic system in 90 seconds',
  'Nasal breathing during exercise increases oxygen uptake by 18%',
  'Eating curd rice is a probiotic powerhouse — Ayurveda got it right',
  'Zone 2 cardio — you can still hold a conversation — is where longevity happens',
]

type TabKey = 'mind' | 'body' | 'nutrition' | 'sleep' | 'longevity' | 'india'

interface TabDef {
  key: TabKey
  name: string
  sub: string
  icon: string
  iconColor: string
  iconBg: string
}

const TABS: TabDef[] = [
  { key: 'mind', name: 'Mind', sub: 'Mental well-being', icon: 'ti-brain', iconColor: '#1E6E3A', iconBg: '#F0FAF4' },
  { key: 'body', name: 'Body', sub: 'Fitness & strength', icon: 'ti-run', iconColor: '#F43F5E', iconBg: '#FFF1F2' },
  { key: 'nutrition', name: 'Nutrition', sub: 'Eat smart', icon: 'ti-leaf', iconColor: '#F59E0B', iconBg: '#FFFBEB' },
  { key: 'sleep', name: 'Sleep', sub: 'Rest & recharge', icon: 'ti-moon', iconColor: '#3B82F6', iconBg: '#EFF6FF' },
  { key: 'longevity', name: 'Longevity', sub: 'Live longer', icon: 'ti-dna-2', iconColor: '#14B8A6', iconBg: '#F0FDFA' },
  { key: 'india', name: 'India Roots', sub: 'Ayurveda + science', icon: 'ti-plant', iconColor: '#8B5CF6', iconBg: '#F5F3FF' },
]

interface ArticleCardData {
  imgClass: string
  icon: string
  iconColor: string
  tagClass: string
  tagLabel: string
  title: string
  authorInitials: string
  authorName: string
  readTime: string
}

interface TrendItemData {
  imgClass: string
  icon: string
  iconColor: string
  title: string
  readTime: string
}

interface TabContent {
  sectionTitle: string
  articles: ArticleCardData[]
  trending: TrendItemData[]
}

const TAB_CONTENT: Record<TabKey, TabContent> = {
  mind: {
    sectionTitle: 'Latest in Mind',
    articles: [
      { imgClass: 'ai-blue', icon: 'ti-brain', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Mind', title: '5 Morning Habits That Improve Mental Clarity', authorInitials: 'NV', authorName: 'Dr. Neha Verma', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Nutrition', title: 'High Protein Breakfast Ideas for Busy Mornings', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '6 min' },
      { imgClass: 'ai-grn', icon: 'ti-moon', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Sleep', title: 'Why You Feel Tired Even After 8 Hours of Sleep', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '8 min' },
      { imgClass: 'ai-coral', icon: 'ti-run', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Body', title: 'Desk Job Problems and Simple Posture Fixes', authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-dna-2', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Longevity', title: "What Your Weight Doesn't Tell You About Health", authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '7 min' },
      { imgClass: 'ai-purple', icon: 'ti-device-mobile', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Lifestyle', title: 'Digital Detox: Reclaim Your Focus and Energy', authorInitials: 'AK', authorName: 'Aarav Khanna', readTime: '5 min' },
    ],
    trending: [
      { imgClass: 'ai-grn', icon: 'ti-sun', iconColor: '#1E6E3A', title: "Signs of Vitamin D Deficiency You Shouldn't Ignore", readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-clock', iconColor: '#F59E0B', title: 'Is Intermittent Fasting Safe for Everyone?', readTime: '7 min read' },
      { imgClass: 'ai-coral', icon: 'ti-sparkles', iconColor: '#F43F5E', title: 'Best Foods for Healthy Skin', readTime: '5 min read' },
      { imgClass: 'ai-purple', icon: 'ti-brain', iconColor: '#8B5CF6', title: 'How Stress Affects Your Gut Health', readTime: '8 min read' },
      { imgClass: 'ai-teal', icon: 'ti-shield', iconColor: '#14B8A6', title: '10 Simple Ways to Boost Immunity', readTime: '6 min read' },
    ],
  },
  body: {
    sectionTitle: 'Latest in Body',
    articles: [
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Body', title: 'Strength Training Basics Every Beginner Should Know', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '8 min' },
      { imgClass: 'ai-amber', icon: 'ti-stretching', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Mobility', title: 'The Truth About Daily Stretching for Flexibility', authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '6 min' },
      { imgClass: 'ai-blue', icon: 'ti-run', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Cardio', title: 'How to Build Endurance Without Cardio Burnout', authorInitials: 'RK', authorName: 'Coach Rahul K.', readTime: '7 min' },
      { imgClass: 'ai-grn', icon: 'ti-heart-rate-monitor', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Recovery', title: 'Recovery Routines That Actually Work for Athletes', authorInitials: 'SM', authorName: 'Dr. Suresh M.', readTime: '9 min' },
      { imgClass: 'ai-purple', icon: 'ti-yoga', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Flexibility', title: "Mobility vs Flexibility — What's the Difference?", authorInitials: 'PR', authorName: 'Physio Rohit', readTime: '5 min' },
      { imgClass: 'ai-teal', icon: 'ti-shoe', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Running', title: 'Why Your Knees Hurt After Running (And How to Fix It)', authorInitials: 'KS', authorName: 'Dr. Kavya S.', readTime: '7 min' },
    ],
    trending: [
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', title: 'The 7 Best Exercises for Better Posture', readTime: '6 min read' },
      { imgClass: 'ai-grn', icon: 'ti-walk', iconColor: '#1E6E3A', title: 'How Many Steps Should You Really Walk Daily?', readTime: '5 min read' },
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', title: 'Pre vs Post Workout Nutrition: What Matters More', readTime: '7 min read' },
      { imgClass: 'ai-blue', icon: 'ti-heart-rate-monitor', iconColor: '#3B82F6', title: 'The Science of Muscle Soreness Explained', readTime: '6 min read' },
      { imgClass: 'ai-purple', icon: 'ti-run', iconColor: '#8B5CF6', title: "Functional Training: A Complete Beginner's Guide", readTime: '8 min read' },
    ],
  },
  nutrition: {
    sectionTitle: 'Latest in Nutrition',
    articles: [
      { imgClass: 'ai-amber', icon: 'ti-salad', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Diet', title: "Mediterranean Diet: Why It's Backed by Science", authorInitials: 'AS', authorName: 'Dr. Ananya Sharma', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-meat', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Protein', title: 'The Truth About Protein Powders in 2026', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '7 min' },
      { imgClass: 'ai-grn', icon: 'ti-candy', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Sugar', title: 'Hidden Sugars in "Healthy" Foods You Buy Daily', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-bacteria', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Gut', title: 'How Fiber Transforms Your Gut Microbiome', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '8 min' },
      { imgClass: 'ai-purple', icon: 'ti-plant', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'India', title: 'Indian Superfoods That Beat Imported Trends', authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '7 min' },
      { imgClass: 'ai-blue', icon: 'ti-tools-kitchen-2', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Planning', title: 'Meal Prep Sunday: A 4-Hour Weekly System', authorInitials: 'AK', authorName: 'Aarav Khanna', readTime: '6 min' },
    ],
    trending: [
      { imgClass: 'ai-coral', icon: 'ti-coffee', iconColor: '#F43F5E', title: 'Is Coffee Actually Bad for Your Heart?', readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-bread', iconColor: '#F59E0B', title: 'The Best Time to Eat Carbs for Energy', readTime: '5 min read' },
      { imgClass: 'ai-grn', icon: 'ti-pepper', iconColor: '#1E6E3A', title: 'Top 10 Anti-Inflammatory Foods', readTime: '7 min read' },
      { imgClass: 'ai-teal', icon: 'ti-bacteria', iconColor: '#14B8A6', title: 'Probiotics vs Prebiotics: Which Matters More?', readTime: '8 min read' },
      { imgClass: 'ai-purple', icon: 'ti-plant', iconColor: '#8B5CF6', title: 'Why Indian Spices Are the Original Functional Foods', readTime: '6 min read' },
    ],
  },
  sleep: {
    sectionTitle: 'Latest in Sleep',
    articles: [
      { imgClass: 'ai-blue', icon: 'ti-moon', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Sleep', title: 'The Perfect Sleep Schedule for Your Chronotype', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '8 min' },
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Supplements', title: 'Why Magnesium is the King of Sleep Supplements', authorInitials: 'RM', authorName: 'Dr. Riya Menon', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-sun', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Light', title: 'How Light Exposure Controls Your Sleep Quality', authorInitials: 'NR', authorName: 'Dr. Nandini R.', readTime: '6 min' },
      { imgClass: 'ai-grn', icon: 'ti-device-watch', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Tracking', title: 'Sleep Tracking: What the Data Really Means', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-zzz', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Insomnia', title: 'Insomnia Protocols From a Sleep Doctor', authorInitials: 'KS', authorName: 'Dr. Kabir Singh', readTime: '10 min' },
      { imgClass: 'ai-teal', icon: 'ti-clock', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Science', title: 'The 90-Minute Sleep Cycle Theory Explained', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '7 min' },
    ],
    trending: [
      { imgClass: 'ai-blue', icon: 'ti-bed', iconColor: '#3B82F6', title: 'Should You Nap During the Day?', readTime: '5 min read' },
      { imgClass: 'ai-grn', icon: 'ti-temperature', iconColor: '#1E6E3A', title: 'Cooling Mattresses: Worth the Hype?', readTime: '6 min read' },
      { imgClass: 'ai-coral', icon: 'ti-glass-full', iconColor: '#F43F5E', title: 'How Alcohol Wrecks Your Deep Sleep', readTime: '7 min read' },
      { imgClass: 'ai-amber', icon: 'ti-body-scan', iconColor: '#F59E0B', title: 'The Best Sleep Position for Back Pain', readTime: '6 min read' },
      { imgClass: 'ai-purple', icon: 'ti-leaf', iconColor: '#8B5CF6', title: 'CBD for Sleep: What Science Says', readTime: '8 min read' },
    ],
  },
  longevity: {
    sectionTitle: 'Latest in Longevity',
    articles: [
      { imgClass: 'ai-teal', icon: 'ti-world', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Lifestyle', title: "Blue Zones: 5 Habits of the World's Oldest People", authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '9 min' },
      { imgClass: 'ai-grn', icon: 'ti-dna-2', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Cellular', title: 'Cellular Aging: Can You Actually Reverse It?', authorInitials: 'VT', authorName: 'Dr. Vikram Tiwari', readTime: '10 min' },
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Supplements', title: 'The NMN Supplement Debate Settled', authorInitials: 'RM', authorName: 'Dr. Riya Menon', readTime: '8 min' },
      { imgClass: 'ai-blue', icon: 'ti-heart-rate-monitor', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Cardio', title: 'Why Zone 2 Cardio is the Longevity King', authorInitials: 'AS', authorName: 'Arjun Shah', readTime: '7 min' },
      { imgClass: 'ai-coral', icon: 'ti-flame', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Heat', title: 'Sauna Use & Cardiovascular Health Evidence', authorInitials: 'SM', authorName: 'Dr. Suresh M.', readTime: '8 min' },
      { imgClass: 'ai-amber', icon: 'ti-chart-line', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Biomarkers', title: 'Telomere Length and Your Real Biological Age', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '9 min' },
    ],
    trending: [
      { imgClass: 'ai-teal', icon: 'ti-test-pipe', iconColor: '#14B8A6', title: 'The Best Longevity Tests You Can Do at Home', readTime: '7 min read' },
      { imgClass: 'ai-amber', icon: 'ti-clock', iconColor: '#F59E0B', title: 'Fasting Mimicking Diet — Worth the Effort?', readTime: '6 min read' },
      { imgClass: 'ai-coral', icon: 'ti-barbell', iconColor: '#F43F5E', title: 'Why Resistance Training Beats Cardio After 40', readTime: '8 min read' },
      { imgClass: 'ai-grn', icon: 'ti-pill', iconColor: '#1E6E3A', title: 'Supplements That Actually Extend Lifespan', readTime: '9 min read' },
      { imgClass: 'ai-purple', icon: 'ti-microscope', iconColor: '#8B5CF6', title: 'The Hayflick Limit and Why It Matters', readTime: '7 min read' },
    ],
  },
  india: {
    sectionTitle: 'Latest in India Roots',
    articles: [
      { imgClass: 'ai-purple', icon: 'ti-apple', iconColor: '#8B5CF6', tagClass: 'tp-purple', tagLabel: 'Ayurveda', title: 'Triphala: The 3-Fruit Wonder Backed by Science', authorInitials: 'MI', authorName: 'Dr. Meera Iyer', readTime: '8 min' },
      { imgClass: 'ai-grn', icon: 'ti-yoga', iconColor: '#1E6E3A', tagClass: 'tp-grn', tagLabel: 'Yoga', title: 'Yoga vs Modern Exercise — Which Works Better?', authorInitials: 'NR', authorName: 'Dr. Nandini Rao', readTime: '7 min' },
      { imgClass: 'ai-amber', icon: 'ti-droplet', iconColor: '#F59E0B', tagClass: 'tp-amber', tagLabel: 'Food', title: 'Ghee Reconsidered: The Ayurvedic Superfat', authorInitials: 'AS', authorName: 'Dr. Ananya Sharma', readTime: '6 min' },
      { imgClass: 'ai-teal', icon: 'ti-massage', iconColor: '#14B8A6', tagClass: 'tp-teal', tagLabel: 'Detox', title: 'How Panchakarma Detoxes Actually Work', authorInitials: 'VT', authorName: 'Dr. Vikram T.', readTime: '9 min' },
      { imgClass: 'ai-coral', icon: 'ti-plant-2', iconColor: '#F43F5E', tagClass: 'tp-coral', tagLabel: 'Herbs', title: 'Tulsi: Adaptogen of the Subcontinent', authorInitials: 'PJ', authorName: 'Dr. Priya Joshi', readTime: '7 min' },
      { imgClass: 'ai-blue', icon: 'ti-glass-cocktail', iconColor: '#3B82F6', tagClass: 'tp-blue', tagLabel: 'Tradition', title: 'Why Indian Mothers Always Insisted on Haldi Doodh', authorInitials: 'RM', authorName: 'Riya Mehta', readTime: '5 min' },
    ],
    trending: [
      { imgClass: 'ai-purple', icon: 'ti-capsule', iconColor: '#8B5CF6', title: 'Ashwagandha Doses That Actually Work', readTime: '7 min read' },
      { imgClass: 'ai-grn', icon: 'ti-user-circle', iconColor: '#1E6E3A', title: 'The Ayurvedic Body Types Explained', readTime: '6 min read' },
      { imgClass: 'ai-amber', icon: 'ti-droplet', iconColor: '#F59E0B', title: 'Why Mustard Oil is Making a Comeback', readTime: '5 min read' },
      { imgClass: 'ai-coral', icon: 'ti-wind', iconColor: '#F43F5E', title: 'Pranayama: The Original Box Breathing', readTime: '8 min read' },
      { imgClass: 'ai-teal', icon: 'ti-brain', iconColor: '#14B8A6', title: 'Brahmi for Memory: Evidence Review', readTime: '7 min read' },
    ],
  },
}


const VIDEOS = [
  { imageUrl: 'https://img.freepik.com/premium-photo/trx-lunges-bright-green-background-fitness-campaigns-exercise-marketing_171965-127104.jpg?semt=ais_hybrid&w=740&q=80', dur: '7:12', cat: 'Fitness', title: '7-Min Morning Mobility Flow for Stiff Joints', views: '48K views' },
  { imageUrl: 'https://aspirabody.com/wp-content/uploads/elementor/thumbs/Longevity-By-Aspira-Aesthetic-Center-Corp-in-FALL-RIVER-MA-1-qf3mmqufpzghgabxyk3vkfparc8mgbv9docbwy38ts.jpeg', dur: '6:10', cat: 'Longevity', title: "Autophagy: Your Body's Self-Clean Mode", views: '78k views' },
  { imageUrl: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&q=80', dur: '3:47', cat: 'Nutrition', title: '30 Plants a Week: What That Actually Means', views: '54k views' },
  { imageUrl: 'https://static.vecteezy.com/system/resources/thumbnails/026/748/423/small/illustration-of-thought-energy-head-of-person-and-neural-network-of-brain-with-a-problematic-areas-psychic-waves-concept-generative-ai-illustration-free-photo.jpg', dur: '2:55', cat: 'Mind', title: 'Box Breathing: The 90-Second Reset', views: '41k views' },
]

const VITAL_DIMS = [
  { label: 'Sleep', pct: 68, color: '#3B82F6' },
  { label: 'Stress', pct: 52, color: '#F43F5E' },
  { label: 'Nutrition', pct: 80, color: '#1E6E3A' },
  { label: 'Movement', pct: 74, color: '#14B8A6' },
  { label: 'Gut', pct: 88, color: '#1E6E3A' },
  { label: 'Mind', pct: 61, color: '#8B5CF6' },
]

const CLAIMS = [
  { type: 'myth', verdict: 'Myth', text: 'You need 8 glasses of water a day — the requirement depends on body weight, climate and activity level entirely.' },
  { type: 'fact', verdict: 'Fact', text: 'Cold showers do raise norepinephrine — even 30 seconds at the end of a hot shower produces the effect.' },
  { type: 'mixed', verdict: 'It depends', text: 'Eating after 8pm causes weight gain — total daily calories matter most, but late eating disrupts insulin sensitivity for some people.' },
]

const STATIC_PODCASTS = [
  {
    id: 0,
    ep: 'Ep 48 · Mind Architecture',
    title: 'The Neuroscience of Breaking Bad Habits',
    dur: '54 min',
    guest: 'Dr. Nandini Rao',
    thumbClass: 'pt-g',
    imageUrl: 'https://pimwp.s3-accelerate.amazonaws.com/2023/11/Untitled-design-2023-11-17T141623.983.png',
  },
  {
    id: 1,
    ep: 'Ep 47 · Longevity Lab',
    title: 'Metformin, NMN & The Longevity Stack',
    dur: '68 min',
    guest: 'Dr. Vikram Tiwari',
    thumbClass: 'pt-b',
    imageUrl: 'https://media.istockphoto.com/id/1396477581/photo/what-is-bothering-you.jpg?s=612x612&w=0&k=20&c=GfEffRLDE-DDObwTbriwCqPKT0yir9GX-Nmb-epgFng=',
  },
  {
    id: 2,
    ep: 'Ep 46 · Body Intel',
    title: 'HRV, VO2 Max & The Metrics That Actually Matter',
    dur: '41 min',
    guest: 'Arjun Shah',
    thumbClass: 'pt-p',
    imageUrl: 'https://blog-admin.siriusxm.com/wp-content/uploads/2026/01/HealthAndWellness-3002-3840x2160-4.jpeg',
  },
]

const STATIC_EXPERTS = [
  {
    id: 0, initials: 'AS', bg: '#F0FAF4', color: '#1E6E3A',
    name: 'Dr. Ananya Sharma', role: 'Clinical Nutritionist',
    credentials: 'PhD Nutrition · AIIMS Delhi',
    imageUrl: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSzvjtEpO2xRigInDboJp7hPiC2KBWLbjRA-w&s'
  },
  {
    id: 1, initials: 'KS', bg: '#EFF6FF', color: '#1E40AF',
    name: 'Dr. Kabir Singh', role: 'Sleep Specialist',
    credentials: 'MD Sleep Medicine · Stanford',
    imageUrl: 'https://www.shutterstock.com/image-photo/beautiful-young-woman-closed-her-260nw-2641134949.jpg'
  },
  {
    id: 2, initials: 'NV', bg: '#F5F3FF', color: '#4C1D95',
    name: 'Dr. Neha Verma', role: 'Psychologist',
    credentials: 'PhD Psychology · Delhi University',
    imageUrl: 'https://thumbs.dreamstime.com/b/male-psychologist-being-ready-to-take-notes-sitting-couch-31427459.jpg'
  },
  {
    id: 3, initials: 'PR', bg: '#FFF1F2', color: '#9F1239',
    name: 'Physio Rohit', role: 'Physiotherapist',
    credentials: 'MPT Sports · Mumbai University',
    imageUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&q=80'
  },
]

const INDIA_CARDS = [
  { tag: 'Ayurveda meets science', h: 'Ashwagandha: What 34 Clinical Trials Actually Show', body: 'KSM-66 extract at 300mg lowers cortisol by 27% and improves sleep onset. Dose and timing matter enormously.', link: 'Read the evidence review' },
  { tag: 'Regional wisdom', h: "Kerala's Healing Kitchen: The Science Behind Sadhya", body: 'The traditional feast hits near-perfect macronutrient balance, fiber targets and probiotic diversity in one meal.', link: 'Explore the tradition' },
  { tag: 'Monsoon wellness', h: "How India's Monsoon Rewires Your Immune System", body: "June–September raises gut permeability and inflammation. Ayurveda's response is surprisingly validated by modern immunology.", link: 'Prepare for monsoon' },
]

interface QuizQuestion {
  id: number
  q: string
  opts: { value: string; label: string }[]
}

const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    q: 'Which affects your daily life most right now?',
    opts: [
      { value: 'A', label: 'Chronic fatigue and low energy' },
      { value: 'B', label: 'Anxiety or mental overload' },
      { value: 'C', label: 'Weight or metabolic concerns' },
      { value: 'D', label: 'Poor sleep quality' },
    ],
  },
  {
    id: 2,
    q: 'How would you describe your sleep quality?',
    opts: [
      { value: 'A', label: 'Excellent — 7–9 hrs, wake refreshed' },
      { value: 'B', label: 'Good — mostly restful with rare disruptions' },
      { value: 'C', label: 'Average — restless or wake at night' },
      { value: 'D', label: 'Poor — struggle to fall or stay asleep' },
    ],
  },
  {
    id: 3,
    q: 'How often do you exercise each week?',
    opts: [
      { value: 'A', label: '5+ times a week' },
      { value: 'B', label: '3–4 times a week' },
      { value: 'C', label: '1–2 times a week' },
      { value: 'D', label: 'Rarely or never' },
    ],
  },
  {
    id: 4,
    q: 'How would you rate your stress levels?',
    opts: [
      { value: 'A', label: 'Low — feel mostly relaxed' },
      { value: 'B', label: 'Moderate — occasional stress spikes' },
      { value: 'C', label: 'High — frequent stress most days' },
      { value: 'D', label: 'Overwhelming — constant pressure' },
    ],
  },
  {
    id: 5,
    q: 'How balanced is your daily nutrition?',
    opts: [
      { value: 'A', label: 'Very balanced — whole foods, planned meals' },
      { value: 'B', label: 'Mostly balanced — some processed foods' },
      { value: 'C', label: 'Inconsistent — meals skipped or random' },
      { value: 'D', label: 'Mostly processed or fast food' },
    ],
  },
]

interface AiMessage {
  role: 'bot' | 'user'
  text: string
  cite?: string
}

const INITIAL_AI_MESSAGES: AiMessage[] = [
  { role: 'bot', text: "Hi! I'm Vita AI. Ask me about sleep, nutrition, fitness or Ayurveda — I cite every answer from peer-reviewed research." },
  { role: 'user', text: 'Is ashwagandha actually worth taking?' },
  { role: 'bot', text: 'Yes, but only KSM-66 extract at 300–600mg. 34 RCTs show it lowers cortisol by ~27% and improves sleep onset. Take it at night, not morning.', cite: '3 peer-reviewed sources' },
]

const AI_SUGGESTIONS = ['How to manage stress?', 'Best sleep tips', 'Gut health basics']

/* ============================================================
   COMPONENT
   ============================================================ */

export function HomePage(): React.ReactNode {

  const [loginOpen, setLoginOpen] = useState(false)
  const { data: allPodcasts } = usePodcasts()
  const latestPodcasts = allPodcasts?.slice(0, 3) ?? []

  const isLoggedIn = useAuthStore((s) => s.isAuthenticated)
  const expertsQuery = useExperts()
  const realExperts = (expertsQuery.data ?? []).slice(0, 4)
  /* Tabs */
  const [activeTab, setActiveTab] = useState<TabKey>('mind')

  /* Quiz */
  const [currentQ, setCurrentQ] = useState(1)
  const [answers, setAnswers] = useState<Record<number, string>>({})
  const totalQuestions = QUIZ_QUESTIONS.length
  const currentAnswer = answers[currentQ]

  /* AI chat */
  const [aiInput, setAiInput] = useState('')
  const [aiMessages, setAiMessages] = useState<AiMessage[]>(INITIAL_AI_MESSAGES)
  const aiMsgsRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (aiMsgsRef.current) {
      aiMsgsRef.current.scrollTop = aiMsgsRef.current.scrollHeight
    }
  }, [aiMessages])

  /* Newsletter */
  const [nlEmail, setNlEmail] = useState('')
  const [nlSubmitted, setNlSubmitted] = useState(false)

  /* Handlers */
  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const text = aiInput.trim()
    if (!text) return
    setAiMessages((prev) => [...prev, { role: 'user', text }])
    setAiInput('')
    setTimeout(() => {
      setAiMessages((prev) => [
        ...prev,
        { role: 'bot', text: 'Please login to continue Vitalize AI chat. Great question — fetching trusted research for you...' },
      ])
    }, 600)
  }

  const handleNlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!nlEmail.trim()) return
    setNlSubmitted(true)
    setNlEmail('')
    setTimeout(() => setNlSubmitted(false), 2400)
  }

  const handleNext = () => {
    if (!currentAnswer) return
    if (currentQ < totalQuestions) {
      setCurrentQ((q) => q + 1)
    } else {
      // eslint-disable-next-line no-alert
      alert('Quiz submitted!\n\nYour answers:\n' + JSON.stringify(answers, null, 2))
    }
  }

  const handlePrev = () => {
    if (currentQ > 1) setCurrentQ((q) => q - 1)
  }

  const handleSelectOption = (value: string) => {
    setAnswers((prev) => ({ ...prev, [currentQ]: value }))
  }

  const content = TAB_CONTENT[activeTab]
  const isLastQ = currentQ === totalQuestions
  const question = QUIZ_QUESTIONS[currentQ - 1]

  return (
    <>
      <div className="vita-home-page">
        <div className="pg">

          {/* TIPS TICKER */}
          <div className="">
            <div className="ticker">
              <div className="tick-lbl">
                <span className="tick-dot" />
                Daily tips
              </div>
              <div className="tick-track">
                <div className="tick-content">
                  {[...TICKER_ITEMS, ...TICKER_ITEMS].map((item, i) => (
                    <div className="tick-item" key={i}>{item}</div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* HERO */}
          <div className='Hero_main'>
            <div className="vh-container">
              <div className="hero">
                <div className="hero-l">
                  <div className="hero-eyebrow">
                    <span className="hero-eyebrow-dot" />
                    Cover story · Issue 12 · May 2026
                  </div>
                  <div className="hero-h1">
                    <TypeAnimation
                      sequence={[
                        "Smarter Health",
                        0,
                        "Smarter Health\nStarts Here",
                        1000,
                        "",
                      ]}
                      speed={30}
                      repeat={Infinity}
                      cursor={false}
                      style={{ whiteSpace: "pre-line" }}
                    />
                  </div>
                  <div className="hero-sub">
                    Science-backed wellness insights for modern Indian lifestyles. Every claim cited,
                    every author credentialled.
                  </div>
                  <div className="hero-author">
                    <img src="/vitalizeLogo/Doctor.jpg" className='ava' />
                    <div className="ava-info">
                      <span className="ava-name">Dr. Riya Menon</span>
                      <span className="ava-cred">MD Neurology · AIIMS Delhi</span>
                    </div>
                    <div className="verified-chip">
                      <i className="ti ti-circle-check" style={{ fontSize: 13 }} aria-hidden="true" />
                      Expert verified
                    </div>
                  </div>
                  <div className="hero-chips">
                    <div className="h-chip"><i className="ti ti-clock" style={{ fontSize: 14 }} aria-hidden="true" />12 min read</div>
                    <div className="h-chip"><i className="ti ti-eye" style={{ fontSize: 14 }} aria-hidden="true" />48k reads</div>
                    <div className="h-chip"><i className="ti ti-flame" style={{ fontSize: 14, color: '#F43F5E' }} aria-hidden="true" />#1 this month</div>
                  </div>
                  <div className="hero-btns">
                    <button className="btn-p" type="button" onClick={() => window.location.href = "/articles"}>Explore articles <i className="ti ti-arrow-right" style={{ fontSize: 14 }} aria-hidden="true" /></button>
                    <button className="btn-s" type="button" onClick={() => setLoginOpen(true)}>Start your journey</button>

                  </div>
                </div>

                <div className="hero-r">
                  <div className="hero-inner-grid">

                    {/* Left — score + meditation */}
                    <div className="hero-left">
                      <img src="/vitalizeLogo/girl_img.png" alt="" />
                    </div>

                    {/* Right — 4 stat cards */}
                    <div className="hero-stats-grid">

                      {/* Sleep */}
                      <div className="stat-card-new">
                        <div className="stat-card-header">
                          <div className="stat-card-title">
                            <span className="stat-name">Sleep</span>
                            <i
                              className="ti ti-moon stat-icon"
                              aria-hidden="true" style={{ color: '#4726d6' , fontSize: "20px" }}
                            />
                          </div>
                        </div>
                        <div className="stat-big-val">7h 30m</div>
                        <div className="sleep-legend">
                          <div className="legend-dot" style={{ background: '#818cf8' }} /><span className="legend-txt">deep/rem</span>
                          <div className="legend-dot" style={{ background: '#c7d2fe' }} /><span className="legend-txt">light</span>
                        </div>
                        <div className="sleep-quality">
                          <i className="ti ti-trending-up" aria-hidden="true" style={{ fontSize: 12 }} /> Good sleep quality
                        </div>
                      </div>

                      {/* Steps */}
                      <div className="stat-card-new">
                        <div className="stat-card-header">
                          <div className="stat-card-title">
                            <span className="stat-name">Steps</span>
                            <i
                              className="ti ti-run"
                              aria-hidden="true" style={{ color: '#1fc427', fontSize: "20px" }}
                            />
                          </div>
                        </div>
                        <div className="stat-big-val">7,890</div>
                        <div className="stat-sub">steps of 10,000</div>
                        <div className="stat-footer-row">
                          <span>Day</span><span>78% of 10,000</span>
                        </div>
                      </div>

                      {/* Heart Rate */}
                      <div className="stat-card-new">
                        <div className="stat-card-title">
                          <span className="stat-name">Heart Rate</span>
                          <i
                            className="ti ti-heart-filled"
                            aria-hidden="true" style={{ color: '#eb1919' , fontSize: "20px" }}
                          />
                        </div>
                        <div className="stat-big-val">85 bpm</div>
                        <div className="stat-muted-txt">Mini days heart rate variance</div>
                      </div>

                      {/* Water */}
                      <div className="stat-card-new">
                        <div className="stat-card-header" style={{ marginBottom: 4 }}>                         
                          <div className="stat-card-title">
                          <span className="stat-name">Water</span>
                          <i className="ti ti-droplet" aria-hidden="true" style={{ color: '#3b82f6', fontSize: "20px" }} />
                        </div>
                        </div>
                        <div className="stat-big-val">2.1 L</div>
                        <div className="stat-footer-row" style={{ marginTop: 6 }}>
                          <div className="water-target-label">
                            <div className="legend-dot" style={{ background: '#9ca3af' }} />
                            <span className="legend-txt">Target</span>
                          </div>
                          <span className="legend-txt">2.1 / 3.0 L</span>
                        </div>
                        <div className="stat-muted-txt">Target tracking</div>
                      </div>

                    </div>
                  </div>

                  {/* Daily tip */}
                  <div className="daily-tip-bar">
                    <div className="tip-left">
                      <div className="tip-icon-box">
                        <i className="ti ti-bulb" aria-hidden="true" style={{ fontSize: 16, color: '#1E6E3A' }} />
                      </div>
                      <div>
                        <div className="tip-label-txt">Daily tip</div>
                        <div className="tip-body-txt">Hydrate your body — stay energised</div>
                      </div>
                    </div>
                    {/* <span className="tip-right-txt">Health Insight</span> */}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* PODCAST */}
          <div className="vh-container">
            <div className="pod-section">
              <div className="sec-bar">
                <div className="sec-title">Podc<span>asts</span></div>
                <div className="sec-more" onClick={() => window.location.href = "/podcasts"}>
                  All episodes <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" />
                </div>
              </div>
              <div className="pod-row">
                {isLoggedIn ? (
                  latestPodcasts.length === 0 ? (
                    [1, 2, 3].map((i) => (
                      <div className="pod-card" key={i}>
                        <div className="pod-thumb pt-g animate-pulse bg-neutral-200" />
                        <div className='pod_meta_play'>
                          <div className="pod-meta">
                            <div className="h-2 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
                            <div className="h-3 w-40 bg-neutral-200 rounded animate-pulse mb-2" />
                            <div className="h-2 w-32 bg-neutral-200 rounded animate-pulse" />
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    latestPodcasts.map((p) => (
                      <div className="pod-card" key={p.id}>
                        <div className="pod-thumb pt-g" style={{ padding: 0, overflow: 'hidden' }}>
                          <video
                            src={p.videoUrl}
                            className="w-full h-full object-cover"
                            playsInline
                            muted
                            preload="metadata"
                          />
                        </div>
                        <div className='pod_meta_play'>
                          <div className="pod-meta">
                            <div className="pod-ep">{p.episode} · {p.category}</div>
                            <div className="pod-title">{p.title}</div>
                            <div className="pod-dur">
                              <i className="ti ti-clock" style={{ fontSize: 13 }} aria-hidden="true" />
                              {p.duration} · {p.guest}
                            </div>
                          </div>
                          <div className="pod-play" onClick={() => window.location.href = '/podcasts'}>
                            <div className="play-tri" />
                          </div>
                        </div>
                      </div>
                    ))
                  )
                ) : (
                  STATIC_PODCASTS.map((p) => (
                    <div className="pod-card" key={p.id}>
                      <div className="pod-thumb" style={{ padding: 0, overflow: 'hidden' }}>
                        <img
                          src={p.imageUrl}
                          alt={p.title}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className='pod_meta_play'>
                        <div className="pod-meta">
                          <div className="pod-ep">{p.ep}</div>
                          <div className="pod-title">{p.title}</div>
                          <div className="pod-dur">
                            <i className="ti ti-clock" style={{ fontSize: 13 }} aria-hidden="true" />
                            {p.dur} · {p.guest}
                          </div>
                        </div>
                        <div className="pod-play" onClick={() => setLoginOpen(true)}>
                          <div className="play-tri" />
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

              {/* FEATURE STRIP */}
          <div className="vh-container">
            <div className="feat-strip">
              <div className="feat">
                <div className="feat-icon fi-g"><i className="ti ti-robot" style={{ fontSize: 22 }} aria-hidden="true" /></div>
                <div className="feat-label">Vitalize AI</div>
                <div className="feat-desc">Ask anything about your health — cited answers, no hallucinations.</div>
                <div className="feat-link" onClick={() => window.location.href = "/ai"}>Chat now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
              <div className="feat">
                <div className="feat-icon fi-a"><i className="ti ti-microphone" style={{ fontSize: 22 }} aria-hidden="true" /></div>
                <div className="live-dot">Live</div>
                <div className="feat-label">Podcast</div>
                <div className="feat-desc">Deep conversations with doctors, scientists & founders.</div>
                <div className="feat-link" onClick={() => window.location.href = "/podcasts"}>Listen now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
              <div className="feat">
                <div className="feat-icon fi-b"><i className="ti ti-player-play" style={{ fontSize: 22 }} aria-hidden="true" /></div>
                <div className="feat-label">Videos</div>
                <div className="feat-desc">Short expert explainers, protocols and breakdowns.</div>
                <div className="feat-link" onClick={() => window.location.href = "/videos"}>Watch now <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
              <div className="feat hl">
                <div className="feat-icon"><i className="ti ti-chart-radar" style={{ fontSize: 22 }} aria-hidden="true" /></div>
                <div className="feat-label">Vital Score Quiz</div>
                <div className="feat-desc">Monthly wellness assessment across 6 health dimensions.</div>
                <div className="feat-link">Take the test <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
            </div>
          </div>

          {/* VIDEOS */}
          <div className="vh-container">
            <div className="vid-section">
              <div className="sec-bar">
                <div className="sec-title">Vide<span>os</span></div>
                <div className="sec-more" onClick={() => window.location.href = "/videos"}>All videos <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
              </div>
              <div className="vid-row">
                {VIDEOS.map((v, i) => (
                  <div className="vid-card" key={i}>
                    <div className="relative h-52 overflow-hidden">
                      <img
                        src={v.imageUrl}
                        alt={v.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="vid-dur">{v.dur}</div>
                    </div>
                    <div className="vid-info">
                      <div className="vid-cat">{v.cat}</div>
                      <div className="vid-title">{v.title}</div>
                      <div className="vid-views">{v.views}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>


      

          {/* CATEGORY ROW (TABS) */}
          <div className="vh-container">
            <div className="cat-row">
              {TABS.map((tab) => (
                <button
                  type="button"
                  key={tab.key}
                  className={`cat${activeTab === tab.key ? ' on' : ''}`}
                  onClick={() => setActiveTab(tab.key)}
                >
                  <div className="cat-icon" style={{ background: tab.iconBg }}>
                    <i className={`ti ${tab.icon}`} style={{ fontSize: 22, color: tab.iconColor }} aria-hidden="true" />
                  </div>
                  <div className="cat-name">{tab.name}</div>
                  <div className="cat-sub">{tab.sub}</div>
                </button>
              ))}
            </div>
          </div>

          {/* ARTICLES + TRENDING (TAB CONTENT) */}
          <div className="vh-container">
            <div className="main-cols">
              <div className="articles-col">
                <div className="sec-bar">
                  <div className="sec-title">{content.sectionTitle}</div>
                  <div className="sec-more">View all <i className="ti ti-arrow-right" style={{ fontSize: 13 }} aria-hidden="true" /></div>
                </div>
                <div className="art-grid">
                  {content.articles.map((a, i) => (
                    <div className="acard" key={`${activeTab}-art-${i}`}>
                      <div className={`acard-img ${a.imgClass}`}>
                        <i className={`ti ${a.icon}`} style={{ fontSize: 38, color: a.iconColor }} aria-hidden="true" />
                      </div>
                      <div className={`tag-pill ${a.tagClass}`}>{a.tagLabel}</div>
                      <div className="acard-h">{a.title}</div>
                      <div className="acard-foot">
                        <div className="acard-auth">
                          <div className="auth-av">{a.authorInitials}</div>
                          {a.authorName}
                        </div>
                        <div className="acard-rt">{a.readTime}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="sidebar">
                <div className="sec-bar" style={{ paddingBottom: 8 }}>
                  <div className="sec-title">Trending now</div>
                </div>
                {content.trending.map((t, i) => (
                  <div className="trend-item" key={`${activeTab}-tr-${i}`}>
                    <div className="trend-num">{i + 1}</div>
                    <div className={`trend-img ${t.imgClass}`}>
                      <i className={`ti ${t.icon}`} style={{ fontSize: 22, color: t.iconColor }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="trend-h">{t.title}</div>
                      <div className="trend-t">{t.readTime}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>



          {/* AI CHAT + QUIZ */}
          <div className="vh-container">
            <div className="tools-cols">
              {/* AI CHAT */}
              <div className="ai-panel">
                <div className="ai-head">
                  <div className="ai-title-row">
                    <div className="ai-orb"><i className="ti ti-robot" style={{ fontSize: 19, color: '#fff' }} aria-hidden="true" /></div>
                    <div>
                      <div className="ai-name">Vita AI</div>
                      <div className="ai-sub">Ask anything about your health</div>
                    </div>
                  </div>
                  <div className="ai-badge">Online</div>
                </div>
                <div className="ai-msgs" ref={aiMsgsRef}>
                  {aiMessages.map((m, i) => (
                    <div className={`msg ${m.role}`} key={i}>
                      {m.text}
                      {m.cite && (
                        <div className="msg-cite">
                          <i className="ti ti-link" style={{ fontSize: 12 }} aria-hidden="true" />
                          {m.cite}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                <div className="ai-sugs">
                  {AI_SUGGESTIONS.map((s) => (
                    <button
                      type="button"
                      className="ai-sug"
                      key={s}
                      onClick={() => setAiInput(s)}
                    >
                      {s}
                    </button>
                  ))}
                </div>
                <form className="ai-input-row" onSubmit={handleAiSubmit}>
                  <input
                    type="text"
                    className="ai-inp"
                    value={aiInput}
                    onChange={(e) => setAiInput(e.target.value)}
                    placeholder="Ask Vita AI anything..."
                    autoComplete="off"
                  />
                  <button type="submit" className="ai-send-btn">Send</button>
                </form>
              </div>

              {/* QUIZ */}
              <div className="quiz-panel">
                <div className="quiz-head">
                  <div className="quiz-title-row">
                    <div className="quiz-icon-box">
                      <i className="ti ti-chart-radar" style={{ fontSize: 19, color: '#8B5CF6' }} aria-hidden="true" />
                    </div>
                    <div>
                      <div className="quiz-name">Vital Score Quiz</div>
                      <div className="quiz-sub">Find your wellness gaps in 90 sec</div>
                    </div>
                  </div>
                </div>
                <div className="quiz-prog-wrap">
                  <div className="quiz-dots">
                    {Array.from({ length: totalQuestions }).map((_, i) => {
                      const step = i + 1
                      const cls = step < currentQ ? 'qd done' : step === currentQ ? 'qd on' : 'qd'
                      return <div className={cls} key={i} />
                    })}
                  </div>
                  <span className="q-step-lbl">Question {currentQ} of {totalQuestions}</span>
                </div>

                <div className="quiz-question active" key={currentQ}>
                  <div className="quiz-q">{question.q}</div>
                  <div className="quiz-opts">
                    {question.opts.map((opt) => (
                      <div
                        key={opt.value}
                        className={`qopt${currentAnswer === opt.value ? ' sel' : ''}`}
                        onClick={() => handleSelectOption(opt.value)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectOption(opt.value)
                          }
                        }}
                      >
                        <div className="qopt-ltr">{opt.value}</div>
                        {opt.label}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="quiz-footer">
                  <div className="quiz-step-txt">No sign-up required</div>
                  <div className="quiz-actions">
                    {currentQ > 1 && (
                      <button type="button" className="quiz-btn quiz-prev" onClick={handlePrev}>
                        ← Previous
                      </button>
                    )}
                    <button
                      type="button"
                      className={`quiz-btn quiz-next${isLastQ ? ' quiz-submit' : ''}`}
                      onClick={handleNext}
                      disabled={!currentAnswer}
                    >
                      {isLastQ ? 'Submit ✓' : 'Next question →'}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* VITAL SCORE + TRUTH CHECK */}
          <div className="vh-container">
            <div className="bottom-tools">
              <div className="vital-panel">
                <div className="panel-head">
                  <div className="panel-title-row">
                    <div className="panel-icon pi-teal"><i className="ti ti-activity" style={{ fontSize: 19 }} aria-hidden="true" /></div>
                    <div>
                      <div className="panel-name">Your Vital Score</div>
                      <div className="panel-sub">Monthly wellness check-in across 6 dimensions</div>
                    </div>
                  </div>
                  <div className="panel-badge pb-teal">May 2026</div>
                </div>
                <div className="vital-content">
                  <div className="ring-wrap">
                    <svg className="ring-svg" viewBox="0 0 110 110">
                      <circle className="r-bg" cx="55" cy="55" r="42.5" />
                      <circle className="r-val" cx="55" cy="55" r="42.5" />
                    </svg>
                    <div className="ring-txt">
                      <div className="ring-n">74</div>
                      <div className="ring-of">/100</div>
                    </div>
                  </div>
                  <div className="dims">
                    {VITAL_DIMS.map((d) => (
                      <div className="dim" key={d.label}>
                        <div className="dim-lbl">{d.label}</div>
                        <div className="dim-track">
                          <div className="dim-fill" style={{ width: `${d.pct}%`, background: d.color }} />
                        </div>
                        <div className="dim-v">{d.pct}</div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="vital-cta">Retake monthly check-in →</div>
              </div>
              <div className="truth-panel">
                <div className="panel-head">
                  <div className="panel-title-row">
                    <div className="panel-icon pi-coral"><i className="ti ti-microscope" style={{ fontSize: 19 }} aria-hidden="true" /></div>
                    <div>
                      <div className="panel-name">Truth Check</div>
                      <div className="panel-sub">We fact-check 5 viral health claims each week</div>
                    </div>
                  </div>
                  <div className="panel-badge pb-coral">This week</div>
                </div>
                <div className="claims">
                  {CLAIMS.map((c, i) => (
                    <div className={`claim ${c.type}`} key={i}>
                      <div className={`verdict v-${c.type}`}>{c.verdict}</div>
                      <div className="claim-txt">{c.text}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* EXPERTS */}
          <div className="vh-container">
            <div className="experts-section">
              <div className="sec-bar">
                <div className="sec-title">Insights from health experts</div>
                <div className="sec-more" onClick={() => window.location.href = '/experts'}>
                  View all experts <i className="ti ti-arrow-right" style={{ fontSize: 13 }} />
                </div>
              </div>
              <div className="experts-row">
                {isLoggedIn ? (
                  expertsQuery.isLoading ? (
                    [1, 2, 3, 4].map((i) => (
                      <div className="expert-card" key={i}>
                        <div className="exp-ava animate-pulse bg-neutral-200" />
                        <div className="h-3 w-24 bg-neutral-200 rounded animate-pulse mb-2" />
                        <div className="h-2 w-16 bg-neutral-200 rounded animate-pulse" />
                      </div>
                    ))
                  ) : realExperts.map((e) => {
                    const initials = e.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('')
                    return (
                      <div
                        className="expert-card"
                        key={e.id}
                        onClick={() => window.location.href = `/experts/${e.id}`}
                        style={{ cursor: 'pointer' }}
                      >
                        {e.imageUrl ? (
                          <img src={e.imageUrl} alt={e.name} className="exp-ava" style={{ objectFit: 'cover', borderRadius: '50%' }} />
                        ) : (
                          <div className="exp-ava" style={{ background: '#F0FAF4', color: '#1E6E3A' }}>{initials}</div>
                        )}
                        <div className="exp-name">{e.name}</div>
                        <div className="exp-role">{e.role}</div>
                        <div className="exp-article">{e.credentials}</div>
                        <div className="exp-link">View profile <i className="ti ti-arrow-right" style={{ fontSize: 12 }} /></div>
                      </div>
                    )
                  })
                ) : (
                  STATIC_EXPERTS.map((e) => (
                    <div className="expert-card" key={e.id}>
                      <img
                        src={e.imageUrl}
                        alt={e.name}
                        className="exp-ava"
                        style={{ objectFit: 'cover', borderRadius: '50%' }}
                      />
                      <div className="exp-name">{e.name}</div>
                      <div className="exp-role">{e.role}</div>
                      <div className="exp-article">{e.credentials}</div>
                      <div
                        className="exp-link"
                        onClick={() => setLoginOpen(true)}
                      >
                        Login to view profile<i className="ti ti-arrow-right" style={{ fontSize: 12 }} />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* INDIA BAND */}
          <div className="vh-container">
            <div className="india-band">
              {INDIA_CARDS.map((c, i) => (
                <React.Fragment key={i}>
                  <div className="india-card">
                    <div className="i-tag">{c.tag}</div>
                    <div className="i-h">{c.h}</div>
                    <div className="i-body">{c.body}</div>
                    <div className="i-link">{c.link}</div>
                  </div>
                  {i < INDIA_CARDS.length - 1 && <div className="idiv" />}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* NEWSLETTER */}
          <div className="nl-main">
            <div className="nl-band">
              <div className='vh-container'>
                <div className="nl-l">
                  <div className="nl-eyebrow">Every Tuesday morning</div>
                  <div className="nl-h">
                    Get weekly health insights<br />
                    that <span>actually matter</span>
                  </div>
                  <div className="nl-sub">
                    Expert tips, easy habits and the latest health updates — delivered to your inbox.
                    No spam, ever.
                  </div>
                </div>
                <div className="nl-r">
                  <form className="nl-form" onSubmit={handleNlSubmit}>
                    <input
                      type="email"
                      className="nl-inp"
                      value={nlEmail}
                      onChange={(e) => setNlEmail(e.target.value)}
                      placeholder="Enter your email address"
                      autoComplete="email"
                      disabled={nlSubmitted}
                      required
                    />
                    <button
                      type="submit"
                      className={`nl-btn${nlSubmitted ? ' subscribed' : ''}`}
                    >
                      {nlSubmitted ? 'Subscribed ✓' : 'Subscribe'}
                    </button>
                  </form>
                  <div className="nl-trust">
                    <div className="nl-trust-item">No spam, ever</div>
                    <div className="nl-trust-item">Unsubscribe anytime</div>
                    <div className="nl-trust-item">Free Starter Guide</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
      <LoginDialog open={loginOpen} onClose={() => setLoginOpen(false)} />
    </>
  )
}
